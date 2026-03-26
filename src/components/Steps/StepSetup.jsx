import React from 'react';
import SectionCard from '../Forms/SectionCard';
import BadgeCount from '../Forms/BadgeCount';
import QuantitySelector from '../Forms/QuantitySelector';
import Button from '../Button';

const LIMIT = 10;

const StepSetup = ({
  tema,
  escopo,
  exclusao,
  atributos,
  filtros,
  onEditarAtributos,
  onEditarFiltros,
  onBack,
  onNext,
  qtdObjetos,
  onChangeQtd,
  // NOVO: Props para o controle de filtros[cite: 6]
  validacaoAtiva,
  setValidacaoAtiva
}) => {

  const handleRemoveAtributo = (index) => {
    const nova = atributos.filter((_, i) => i !== index);
    onEditarAtributos(nova);
  };

  const handleAddAtributo = (val) => {
    if (atributos && atributos.length < LIMIT) {
      onEditarAtributos([...atributos, val]);
    }
  };

  const handleRemoveFiltro = (index) => {
    const nova = filtros.filter((_, i) => i !== index);
    onEditarFiltros(nova);
  };

  const handleAddFiltro = (val) => {
    if (filtros && filtros.length < LIMIT) {
      onEditarFiltros([...filtros, val]);
    }
  };

  const podeContinuar = !!(atributos?.length && filtros?.length);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-5xl font-black uppercase font-mono text-amber-950">Nova Lista</h1>
        <p className="text-base font-sans mt-1" style={{ color: '#2A1005', opacity: 0.6 }}>
          Configure os parâmetros para a extração de dados
        </p>
      </div>

      {/* Tema */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-sans font-bold text-amber-700">Tema Principal</span>
          <span className="text-amber-700 font-bold">|</span>
          <span className="text-xl font-sans text-amber-700 italic">sobre o que está procurando?</span>
          <button onClick={onBack} className="ml-auto text-base font-bold uppercase tracking-widest hover:opacity-60 text-amber-800 font-mono">
            [ editar ]
          </button>
        </div>
        <div className="px-4 py-3 rounded-lg text-base font-medium" style={{ background: '#FFF8C0', border: '1.5px solid #C8A76A', color: '#2A1005' }}>
          {tema}
        </div>
      </div>

      {/* Atributos + Filtros */}
      {(atributos || filtros) && (
        <div className="flex flex-col gap-6 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-400" style={{ borderTop: '1px solid rgba(42,16,5,0.1)' }}>
          {atributos && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <BadgeCount count={atributos.length} limit={LIMIT} />
                <span className="text-xl font-mono text-amber-700 font-bold">Atributos</span>
                <span className="text-amber-700 font-bold">|</span>
                <span className="text-sm italic text-amber-700">campos de cada item</span>
              </div>
              <SectionCard items={atributos} onRemoveItem={handleRemoveAtributo} onAddItem={handleAddAtributo} />
            </div>
          )}

          {filtros && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <BadgeCount count={filtros.length} limit={LIMIT} />
                <span className="text-xl font-mono text-amber-700 font-bold">Filtros</span>
                <span className="text-amber-700 font-bold">|</span>
                <span className="text-sm italic text-amber-700">critérios de qualidade</span>
              </div>
              <SectionCard items={filtros} onRemoveItem={handleRemoveFiltro} onAddItem={handleAddFiltro} />
            </div>
          )}
        </div>
      )}

      {/* NOVO: Botão de Ativação/Desativação de Filtros[cite: 6] */}
      <div className="flex items-center justify-between p-4 rounded-xl" 
           style={{ background: 'rgba(200, 167, 106, 0.1)', border: '1px dashed #C8A76A' }}>
        <div className="flex flex-col">
          <span className="text-sm font-black font-mono uppercase" style={{ color: '#7B3A10' }}>
            Refinar com IA?
          </span>
          <span className="text-[10px] italic" style={{ color: '#2A1005' }}>
            {validacaoAtiva 
              ? "A IA removerá itens que não seguem os filtros acima." 
              : "A lista será gerada sem validação adicional (mais rápido)."}
          </span>
        </div>
        <button
          onClick={() => setValidacaoAtiva(!validacaoAtiva)}
          className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
          style={{ background: validacaoAtiva ? '#7B3A10' : '#E8D5A3' }}
        >
          <span className={`${validacaoAtiva ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition duration-200`} />
        </button>
      </div>

      <div className="flex items-end justify-between gap-6 pt-6" style={{ borderTop: '1px solid rgba(42,16,5,0.1)' }}>
        <QuantitySelector
          label="Quantidade"
          subtitle="quantos itens?"
          min={5}
          max={100}
          step={5}
          value={qtdObjetos}
          onChange={onChangeQtd}
        />
        <button
          onClick={() => onNext(qtdObjetos)}
          disabled={!podeContinuar}
          className="px-10 py-4 rounded-lg font-black text-sm tracking-[0.3em] uppercase font-mono shadow-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: '#7B3A10', color: '#F5C842' }}
        >
          Gerar Lista
        </button>
      </div>
      <div id="extraction-anchor" />
    </div>
  );
};

export default StepSetup;