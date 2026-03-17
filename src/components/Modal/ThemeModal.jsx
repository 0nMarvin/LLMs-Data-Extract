import React, { useState } from 'react';
import BaseModal from './BaseModal';

const ThemeModal = ({ onConfirm, onClose }) => {
  const [tema, setTema] = useState('');

  return (
    <BaseModal title="Novo tema" subtitle="Defina o tema para a lista" onClose={onClose} onConfirm={() => { onConfirm(tema); onClose(); }} confirmLabel="Salvar tema" confirmDisabled={!tema.trim()}>
      <input autoFocus value={tema} onChange={(e) => setTema(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && tema.trim() && (onConfirm(tema), onClose())}
        placeholder="Ex: Artistas de jazz brasileiros..."
        className="rounded-lg px-4 py-3 text-sm outline-none"
        style={{ background: '#FFF8E7', border: `1.5px solid ${tema ? '#7B3A10' : '#E8D5A3'}`, color: '#2A1005' }}
      />
    </BaseModal>
  );
};

export default ThemeModal;