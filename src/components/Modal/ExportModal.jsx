import React, { useState } from 'react';
import BaseModal from './BaseModal';

const formats = [
  { id: 'csv',  label: 'CSV',   icon: '📊', desc: 'Separado por vírgulas' },
  { id: 'json', label: 'JSON',  icon: '🗂️', desc: 'Formato para APIs' },
  { id: 'txt',  label: 'TXT',   icon: '📄', desc: 'Texto simples' },
  { id: 'xlsx', label: 'Excel', icon: '📋', desc: 'Planilha Excel' },
];

const ExportModal = ({ onExport, onClose }) => {
  const [selected, setSelected] = useState(null);

  return (
    <BaseModal title="Exportar lista" subtitle="Escolha o formato" onClose={onClose} onConfirm={() => { onExport(selected); onClose(); }} confirmLabel="Exportar" confirmDisabled={!selected}>
      <div className="flex flex-col gap-2">
        {formats.map((fmt) => (
          <button key={fmt.id} onClick={() => setSelected(fmt.id)}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all"
            style={{ background: selected === fmt.id ? '#7B3A10' : '#FFF8E7', border: `1.5px solid ${selected === fmt.id ? '#7B3A10' : '#E8D5A3'}`, color: selected === fmt.id ? '#F5ECD7' : '#2A1005' }}
          >
            <span className="text-2xl">{fmt.icon}</span>
            <div>
              <div className="text-sm font-bold">{fmt.label}</div>
              <div className="text-xs" style={{ color: selected === fmt.id ? '#E8D5A3' : '#C8A76A' }}>{fmt.desc}</div>
            </div>
            {selected === fmt.id && <span className="ml-auto" style={{ color: '#F5C842' }}>✓</span>}
          </button>
        ))}
      </div>
    </BaseModal>
  );
};

export default ExportModal;