import React from 'react';
import Header        from './components/Header';
import Sidebar       from './components/SideBar';
import StepTheme     from './components/Steps/StepTheme';
import StepSetup     from './components/Steps/StepSetup';
import StepExtraction from './components/Steps/StepExtraction';
import LoadingModal  from './components/Modal/LoadingModal';
import ErrorModal    from './components/Modal/ErrorModal';
import { useAppViewModel } from './useAppViewModel';

const App = () => {
  const vm = useAppViewModel();

  return (
    <div className="bg-page-bg min-h-screen">

      <Header
        models={vm.models}
        selectedModelId={vm.selectedModelId}
        setSelectedModelId={vm.setModelId}
        activeModel={vm.activeModel}
      />

      <Sidebar
        listas={vm.listas}
        onSelectLista={vm.selecionarLista}
        onRemoverLista={vm.removerLista}
        onNovaLista={vm.novaLista}
      />

      <LoadingModal
        isOpen={vm.loading}
        pipelineStep={vm.pipelineStep}
        logEntries={vm.LOG_ENTRIES}
      />

      <ErrorModal
        errorReport={vm.errorReport}
        onClose={vm.clearError}
      />

      {vm.step === 1 && vm.modalTemaAberto && (
        <StepTheme
          onConfirm={vm.confirmarTema}
          onClose={vm.fecharModalTema}
          models={vm.models}
          selectedModelId={vm.selectedModelId}
          setSelectedModelId={vm.setModelId}
        />
      )}

      <main className="p-8 max-w-5xl mx-auto pt-24">

        {vm.step >= 2 && (
          <StepSetup
            tema={vm.tema}
            escopo={vm.escopo}
            exclusao={vm.exclusao}
            atributos={vm.generationData.atributos}
            filtros={vm.generationData.filtros}
            onEditarAtributos={vm.handleEditarAtributos}
            onEditarFiltros={vm.handleEditarFiltros}
            onBack={vm.novaLista}
            onNext={vm.gerarLista}
            qtdObjetos={vm.qtdObjetos}
            onChangeQtd={vm.setQtdObjetos}
            validacaoAtiva={vm.validacaoAtiva}
            setValidacaoAtiva={vm.setValidacaoAtiva}
          />
        )}

        {vm.step === 3 && (
          <StepExtraction
            tema={vm.tema}
            quantidade={vm.qtdObjetos}
            resultado={vm.resultadoExibido}
            finalListJson={vm.finalListJsonAtivo}
            isLoading={vm.loading}
            error={vm.error}
            onEditar={vm.editarResultado}
            onNewList={vm.novaLista}
          />
        )}

      </main>
    </div>
  );
};

export default App;