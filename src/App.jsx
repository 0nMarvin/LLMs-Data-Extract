import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/SideBar';
import StepSetup from './components/Steps/StepSetup';
import StepExtraction from './components/Steps/StepExtraction';
import StepTheme from './components/Steps/StepTheme';
import LoadingModal from './components/Modal/LoadingModal';
import ErrorModal from './components/Modal/ErrorModal';
import { useTags } from './viewmodels/useTags';
import { usePipeline } from './viewmodels/usePipeline';
import { useAiModels } from './viewmodels/useAiModels';
import { useStorage } from './viewmodels/useStorage';
import { useErrorReport } from './viewmodels/useErrorReport';

const LOG_ENTRIES = [
  'carregando atributos',
  'validando filtros',
  'preparando modelo',
  'gerando estrutura',
  'analisando contexto',
  'processando dados',
];

const App = () => {
  const escopo   = useTags(['Apenas residentes em Londrina']);
  const exclusao = useTags([]);

  const {
    savedModelId, saveModelId,
    savedTema,    saveTema,
    listas,       salvarLista, atualizarPrimeira, removerLista,
  } = useStorage();

  const { errorReport, reportError, clearError } = useErrorReport();

  const { models, selectedModelId, setSelectedModelId, activeModel } = useAiModels();

  useEffect(() => {
    if (savedModelId && savedModelId !== selectedModelId) {
      setSelectedModelId(savedModelId);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSetModelId = (id) => {
    setSelectedModelId(id);
    saveModelId(id);
  };

  const {
    iniciarModelar,
    iniciarProcessar,
    iniciarValidar,
    editarAtributos,
    editarFiltros,
    resetar,
    carregarLista,
    loading,
    pipelineStep,
    error,
    generationData,
  } = usePipeline(activeModel);

  const [step,        setStep]        = useState(1);
  const [modalTemaAberto, setModalTemaAberto] = useState(true);
  const [tema,        setTema]        = useState(savedTema ?? '');
  const [qtdObjetos,  setQtdObjetos]  = useState(10);

  // ─── listaAtiva: sobrescreve generationData ao carregar lista salva ────────
  // null = usa dados frescos do pipeline; objeto = usa dados da lista salva
  const [listaAtiva, setListaAtiva] = useState(null);


  // O resultado exibido: lista ativa salva tem prioridade sobre o pipeline
  const resultadoExibido = listaAtiva?.finalList?.list ?? generationData.finalList?.list ?? null;

  // Propaga erros do pipeline para o ErrorModal
  useEffect(() => {
    if (error) {
      reportError(error, {
        pipelineStep,
        tema,
        modelId:   selectedModelId,
        atributos: generationData.atributos,
        filtros:   generationData.filtros,
      });
    }
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps


  // ─── Passo 1: confirma tema, inicia modelagem, salva rascunho ─────────────
  const handleThemeConfirm = async (novoTema) => {
    setTema(novoTema);
    saveTema(novoTema);
    setListaAtiva(null);
    setModalTemaAberto(false);
    setStep(2);

    // iniciarModelar retorna { atributos, filtros } diretamente — sem stale closure
    const modelagem = await iniciarModelar(novoTema);
    if (!modelagem) return;

    // Salva rascunho com os valores frescos retornados pelo pipeline
    salvarLista({
      tema:      novoTema,
      atributos: modelagem.atributos,
      filtros:   modelagem.filtros,
      finalList: null,
      modelId:   selectedModelId,
      modelName: activeModel?.name ?? selectedModelId,
    });
  };

  // ─── Passo 2: gera + valida, atualiza lista no histórico ──────────────────
  const handleGerar = async (qtd) => {
    setQtdObjetos(qtd);
    setListaAtiva(null);
    clearError(); // limpa erro anterior antes de nova tentativa

    const finalList = await iniciarProcessar(qtd);
    if (!finalList) return;

    const finalListValidado = await iniciarValidar(finalList);
    if (!finalListValidado) return;

    setStep(3);

    // Atualiza a entrada já existente (criada em handleThemeConfirm) com o resultado final
    atualizarPrimeira({ finalList: finalListValidado });
  };

  // ─── Passo 3 → Editar ─────────────────────────────────────────────────────
  const handleEditar = () => {
    setListaAtiva(null);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─── Nova lista — reseta tudo ──────────────────────────────────────────────
  const handleNovaLista = () => {
    setListaAtiva(null);
    setModalTemaAberto(true);
    resetar();
    setStep(1);
  };

  // ─── Sidebar: carregar lista salva ────────────────────────────────────────
  const handleSelectLista = (lista) => {
    // Armazena a lista inteira como ativa — isso atualiza o resultado exibido
    setListaAtiva(lista);

    setTema(lista.tema);
    saveTema(lista.tema);

    if (lista.modelId) handleSetModelId(lista.modelId);

    carregarLista(lista);

    // Se tinha resultado, vai pro step 3 (mostra resultado + setup acima)
    setStep(lista.finalList ? 3 : 2);
  };

  return (
    <div className="bg-page-bg min-h-screen">
      <Header
        models={models}
        selectedModelId={selectedModelId}
        setSelectedModelId={handleSetModelId}
        activeModel={activeModel}
      />

      <Sidebar
        listas={listas}
        onSelectLista={handleSelectLista}
        onRemoverLista={removerLista}
        onNovaLista={handleNovaLista}
      />

      <LoadingModal
        isOpen={loading}
        pipelineStep={pipelineStep}
        logEntries={LOG_ENTRIES}
      />

      <ErrorModal
        errorReport={errorReport}
        onClose={clearError}
      />

      {step === 1 && modalTemaAberto && (
        <StepTheme
          onConfirm={handleThemeConfirm}
          onClose={listas.length > 0 ? () => setModalTemaAberto(false) : null}
          models={models}
          selectedModelId={selectedModelId}
          setSelectedModelId={handleSetModelId}
        />
      )}

      <main className="p-8 max-w-5xl mx-auto pt-24">

        {step >= 2 && (
          <StepSetup
            tema={tema}
            escopo={escopo}
            exclusao={exclusao}
            atributos={generationData.atributos}
            filtros={generationData.filtros}
            onEditarAtributos={(lista) => { editarAtributos(lista); atualizarPrimeira({ atributos: lista }); }}
            onEditarFiltros={(lista) => { editarFiltros(lista); atualizarPrimeira({ filtros: lista }); }}
            onBack={() => setStep(1)}
            onNext={handleGerar}
            qtdObjetos={qtdObjetos}
            onChangeQtd={setQtdObjetos}
          />
        )}

        {step === 3 && (
          <StepExtraction
            tema={tema}
            quantidade={qtdObjetos}
            resultado={resultadoExibido}
            finalListJson={listaAtiva?.finalList?.json ?? generationData.finalList?.json ?? null}
            isLoading={loading}
            error={error}
            onEditar={handleEditar}
            onNewList={handleNovaLista}
          />
        )}

      </main>
    </div>
  );
};

export default App;