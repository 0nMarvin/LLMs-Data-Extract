import React from 'react';
import { MODAL_THEME as T } from './modalTheme';

/**
 * BaseModal
 * Quando onClose é null, os botões de fechar (× e Cancelar) são ocultados
 * e o clique no overlay não fecha o modal.
 */
const BaseModal = ({ title, subtitle, onClose, onConfirm, confirmLabel, confirmDisabled, children }) => {
  const podeFechar = typeof onClose === 'function';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: T.overlay }}
      onClick={podeFechar ? onClose : undefined}
    >
      <div
        className="relative flex flex-col gap-5 rounded-2xl p-8 shadow-2xl"
        style={{ background: T.bg, border: `2px solid ${T.border}`, minWidth: '380px', maxWidth: '90vw' }}
        onClick={(e) => e.stopPropagation()}
      >
        {podeFechar && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-xl hover:opacity-60"
            style={{ color: T.accent }}
          >
            ×
          </button>
        )}

        <div>
          <h2 className="font-black text-lg" style={{ color: T.text, fontFamily: 'Georgia, serif' }}>{title}</h2>
          {subtitle && <p className="text-xs mt-1" style={{ color: T.muted }}>{subtitle}</p>}
        </div>

        {children}

        <div className="flex gap-3 justify-end">
          {podeFechar && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold hover:opacity-70"
              style={{ color: T.accent }}
            >
              Cancelar
            </button>
          )}
          <button
            onClick={onConfirm}
            disabled={confirmDisabled}
            className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
            style={{
              background: confirmDisabled ? T.border : T.accent,
              color:      confirmDisabled ? T.muted  : T.confirmLabel,
              cursor:     confirmDisabled ? 'not-allowed' : 'pointer',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BaseModal;