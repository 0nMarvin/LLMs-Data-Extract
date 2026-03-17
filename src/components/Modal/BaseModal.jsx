import React from 'react';

const BaseModal = ({ title, subtitle, onClose, onConfirm, confirmLabel, confirmDisabled, children }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center"
    style={{ background: 'rgba(42, 16, 5, 0.55)' }}
    onClick={onClose}
  >
    <div
      className="relative flex flex-col gap-5 rounded-2xl p-8 shadow-2xl"
      style={{ background: '#FFFEF0', border: '2px solid #E8D5A3', minWidth: '380px', maxWidth: '90vw' }}
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-xl hover:opacity-60" style={{ color: '#7B3A10' }}>×</button>

      <div>
        <h2 className="font-black text-lg" style={{ color: '#2A1005', fontFamily: 'Georgia, serif' }}>{title}</h2>
        {subtitle && <p className="text-xs mt-1" style={{ color: '#C8A76A' }}>{subtitle}</p>}
      </div>

      {children}

      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="px-4 py-2 text-sm font-semibold hover:opacity-70" style={{ color: '#7B3A10' }}>Cancelar</button>
        <button
          onClick={onConfirm}
          disabled={confirmDisabled}
          className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
          style={{ background: confirmDisabled ? '#E8D5A3' : '#7B3A10', color: confirmDisabled ? '#C8A76A' : '#F5C842', cursor: confirmDisabled ? 'not-allowed' : 'pointer' }}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default BaseModal;