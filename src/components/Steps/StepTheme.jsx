import React, { useState } from 'react';
import BaseModal from '../Modal/BaseModal';
import { MODAL_THEME as T } from '../Modal/modalTheme';

/**
 * StepTheme
 * Recebe o estado do modelo como props vindas do App — mesma fonte de verdade
 * que o Header, garantindo sincronização entre os dois.
 *
 * @param {Function} onConfirm         - Chamado com o tema confirmado
 * @param {Array}    models            - Lista de modelos disponíveis
 * @param {string}   selectedModelId   - ID do modelo atualmente selecionado
 * @param {Function} setSelectedModelId - Atualiza o modelo no App (e no Header)
 */
const StepTheme = ({ onConfirm, onClose = null, models = [], selectedModelId, setSelectedModelId }) => {
  const [tema, setTema] = useState('');

  const handleConfirm = () => {
    if (tema.trim()) onConfirm(tema.trim());
  };

  return (
    <BaseModal
      title="Qual é o tema da lista?"
      subtitle="Defina o tema e escolha o modelo que irá gerar a lista"
      onClose={onClose ?? (() => {})}
      onConfirm={handleConfirm}
      confirmLabel="Confirmar tema →"
      confirmDisabled={!tema.trim()}
    >
      {/* Input de tema */}
      <input
        autoFocus
        type="text"
        value={tema}
        onChange={(e) => setTema(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && tema.trim() && handleConfirm()}
        placeholder="Ex: Artistas de jazz brasileiros..."
        className="rounded-lg px-4 py-3 text-sm outline-none transition-all w-full"
        style={{
          background: T.surface,
          border:     `1.5px solid ${tema ? T.accent : T.border}`,
          color:      T.text,
        }}
      />

      {/* Divisor */}
      <div className="flex items-center gap-3 mt-1">
        <div className="flex-1 h-px" style={{ background: T.border }} />
        <span className="text-[9px] font-black font-mono uppercase tracking-widest" style={{ color: T.muted }}>
          modelo
        </span>
        <div className="flex-1 h-px" style={{ background: T.border }} />
      </div>

      {/* Cards de modelo */}
      <div className="flex flex-col gap-2">
        {models.map((model) => {
          const isSelected = model.id === selectedModelId;
          return (
            <button
              key={model.id}
              onClick={() => setSelectedModelId(model.id)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
              style={{
                background: isSelected ? T.accent  : T.surface,
                border:     `1.5px solid ${isSelected ? T.accent : T.border}`,
                color:      isSelected ? '#F5ECD7' : T.text,
              }}
            >
              {/* Ícone do modelo */}
              <div
                className="shrink-0 w-8 h-8 rounded-full overflow-hidden flex items-center justify-center"
                style={{ background: T.border }}
              >
                {model.img ? (
                  <img src={model.img} alt={model.provider} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] font-black" style={{ color: T.accent }}>
                    {model.provider?.[0] ?? 'AI'}
                  </span>
                )}
              </div>

              {/* Nome e provider */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold truncate">{model.name}</div>
                <div className="text-xs truncate" style={{ color: isSelected ? T.border : T.muted }}>
                  {model.provider}
                </div>
              </div>

              {/* Check */}
              {isSelected && (
                <span className="shrink-0 font-black" style={{ color: T.confirmLabel }}>✓</span>
              )}
            </button>
          );
        })}
      </div>
    </BaseModal>
  );
};

export default StepTheme;