import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { MODAL_THEME as T } from './modalTheme';

const ThemeModal = ({ onConfirm, onClose }) => {
  const [tema, setTema] = useState('');

  return (
    <BaseModal
      title="Novo tema"
      subtitle="Defina o tema para a lista"
      onClose={onClose}
      onConfirm={() => { onConfirm(tema); onClose(); }}
      confirmLabel="Salvar tema"
      confirmDisabled={!tema.trim()}
    >
      <input
        autoFocus
        value={tema}
        onChange={(e) => setTema(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && tema.trim() && (onConfirm(tema), onClose())}
        placeholder="Ex: Artistas de jazz brasileiros..."
        className="rounded-lg px-4 py-3 text-sm outline-none"
        style={{
          background: T.surface,
          border:     `1.5px solid ${tema ? T.accent : T.border}`,
          color:      T.text,
        }}
      />
    </BaseModal>
  );
};

export default ThemeModal;