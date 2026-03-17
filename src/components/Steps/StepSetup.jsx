// StepSetup.jsx — só adiciona o id âncora no final
import React, { useState } from 'react';
import SectionCard from '../Forms/SectionCard';
import BadgeCount from '../Forms/BadgeCount';
import QuantitySelector from '../Forms/QuantitySelector';

const LIMIT = 10;

const StepSetup = ({ tema, escopo, exclusao, onNext, onBack }) => {
  const [qtdObjetos, setQtdObjetos] = useState(10);

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

      {/* Escopo */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <BadgeCount count={escopo.tags.length} limit={LIMIT} />
          <span className="text-xl font-mono text-amber-700 font-bold">Escopo/Contexto</span>
          <span className="text-amber-700 font-bold">|</span>
          <span className="text-sm font-base italic text-amber-700">quais contexto ou filtros?</span>
        </div>
        <SectionCard
          items={escopo.tags}
          onRemoveItem={escopo.removeTag}
          onAddItem={(val) => escopo.tags.length < LIMIT && escopo.addTag(val)}
        />
        {escopo.tags.length >= LIMIT && (
          <p className="text-xs font-mono" style={{ color: '#7B3A10' }}>Limite de {LIMIT} itens atingido.</p>
        )}
      </div>

      {/* Exclusão */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <BadgeCount count={exclusao.tags.length} limit={LIMIT} />
          <span className="text-xl font-mono text-amber-700 font-bold">Exclusão</span>
          <span className="text-amber-700 font-bold">|</span>
          <span className="text-sm font-base italic text-amber-700">o que não incluir?</span>
        </div>
        <SectionCard
          items={exclusao.tags}
          onRemoveItem={exclusao.removeTag}
          onAddItem={(val) => exclusao.tags.length < LIMIT && exclusao.addTag(val)}
        />
        {exclusao.tags.length >= LIMIT && (
          <p className="text-xs font-mono" style={{ color: '#7B3A10' }}>Limite de {LIMIT} itens atingido.</p>
        )}
      </div>

      {/* Quantidade + Botão */}
      <div className="flex items-end justify-between gap-6 pt-6" style={{ borderTop: '1px solid rgba(42,16,5,0.1)' }}>
        <QuantitySelector
          label="Quantidade"
          subtitle="quantos itens?"
          min={1}
          max={10}
          step={1}
          value={qtdObjetos}
          onChange={setQtdObjetos}
        />
        <button
          onClick={() => onNext(qtdObjetos)}
          className="px-10 py-4 rounded-lg font-black text-sm tracking-[0.3em] uppercase font-mono shadow-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          style={{ background: '#7B3A10', color: '#F5C842' }}
        >
          Gerar Lista
        </button>
      </div>

      {/* Âncora — StepExtraction será inserido após este elemento */}
      <div id="extraction-anchor" />
    </div>
  );
};

export default StepSetup;