import { useState, useEffect } from "react";
import { useTags }        from "./hooks/useTags";
import { useAiModels }    from "./hooks/useAiModels";
import { useStorage }     from "./hooks/useStorage";
import { useErrorReport } from "./hooks/useErrorReport";
import { usePipeline }    from "./hooks/usePipeline";

export const LOG_ENTRIES = [
  'carregando atributos',
  'validando filtros',
  'preparando modelo',
  'gerando estrutura',
  'analisando contexto',
  'processando dados',
];

export const useAppViewModel = () => {
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
  }, []);

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

  const [step,            setStep]            = useState(1);
  const [modalTemaAberto, setModalTemaAberto] = useState(true);
  const [tema,            setTema]            = useState(savedTema ?? '');
  const [qtdObjetos,      setQtdObjetos]      = useState(10);
  const [listaAtiva,      setListaAtiva]      = useState(null);
  
  // NOVO: Estado para controlar se a validação está ativa
  const [validacaoAtiva, setValidacaoAtiva] = useState(true);

  const resultadoExibido  = listaAtiva?.finalList?.list ?? generationData.finalList?.list ?? null;
  const finalListJsonAtivo = listaAtiva?.finalList?.json ?? generationData.finalList?.json ?? null;

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
  }, [error]);

  const confirmarTema = async (novoTema) => {
    setTema(novoTema);
    saveTema(novoTema);
    setListaAtiva(null);
    setModalTemaAberto(false);
    setStep(2);

    const modelagem = await iniciarModelar(novoTema);
    if (!modelagem) return;

    salvarLista({
      tema:      novoTema,
      atributos: modelagem.atributos,
      filtros:   modelagem.filtros,
      finalList: null,
      modelId:   selectedModelId,
      modelName: activeModel?.name ?? selectedModelId,
    });
  };

  /** AJUSTE: Lógica de geração respeitando o toggle de validação */
  const gerarLista = async (qtd) => {
    setQtdObjetos(qtd);
    setListaAtiva(null);
    clearError();

    // 1. Geração inicial
    const finalList = await iniciarProcessar(qtd);
    if (!finalList) return;

    let resultadoFinal = finalList;

    // 2. Validação condicional: só executa se validacaoAtiva for true
    if (validacaoAtiva) {
      const finalListValidado = await iniciarValidar(finalList);
      if (finalListValidado) {
        resultadoFinal = finalListValidado;
      }
    }

    setStep(3);
    atualizarPrimeira({ finalList: resultadoFinal });
  };

  const editarResultado = () => {
    setListaAtiva(null);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const novaLista = () => {
    setListaAtiva(null);
    setModalTemaAberto(true);
    resetar();
    setStep(1);
  };

  const fecharModalTema = listas.length > 0 ? () => setModalTemaAberto(false) : null;

  const handleEditarAtributos = (lista) => {
    editarAtributos(lista);
    atualizarPrimeira({ atributos: lista });
  };

  const handleEditarFiltros = (lista) => {
    editarFiltros(lista);
    atualizarPrimeira({ filtros: lista });
  };

  const selecionarLista = (lista) => {
    setListaAtiva(lista);
    setTema(lista.tema);
    saveTema(lista.tema);
    if (lista.modelId) handleSetModelId(lista.modelId);
    carregarLista(lista);
    setStep(lista.finalList ? 3 : 2);
  };

  return {
    models,
    selectedModelId,
    activeModel,
    setModelId: handleSetModelId,
    escopo,
    exclusao,
    step,
    modalTemaAberto,
    tema,
    qtdObjetos,
    setQtdObjetos,
    // NOVO: Expondo estados de validação
    validacaoAtiva,
    setValidacaoAtiva,
    generationData,
    resultadoExibido,
    finalListJsonAtivo,
    loading,
    pipelineStep,
    error,
    errorReport,
    clearError,
    listas,
    removerLista,
    confirmarTema,
    gerarLista,
    editarResultado,
    novaLista,
    fecharModalTema,
    selecionarLista,
    handleEditarAtributos,
    handleEditarFiltros,
    LOG_ENTRIES,
  };
};