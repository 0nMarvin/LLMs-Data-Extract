import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { MODAL_THEME as T } from './modalTheme';
import { useExport } from '../../viewmodels/useExport';

const FORMATOS = [
  { id: 'csv',  label: 'CSV',   icon: '📊', desc: 'Separado por vírgulas',   clipboardOk: true  },
  { id: 'json', label: 'JSON',  icon: '🗂️', desc: 'Formato para APIs',       clipboardOk: true  },
  { id: 'txt',  label: 'TXT',   icon: '📄', desc: 'Texto simples',            clipboardOk: true  },
  { id: 'xlsx', label: 'Excel', icon: '📋', desc: 'Planilha Excel',           clipboardOk: false },
];

/**
 * ExportModal
 * @param {string}   finalListJson  - JSON string da lista gerada
 * @param {string}   tema           - Usado no nome do arquivo
 * @param {Function} onClose
 */
const ExportModal = ({ finalListJson, tema = "lista", onClose }) => {
  const [selected, setSelected] = useState(null);
  const [copiado,  setCopiado]  = useState(false);

  const { exportar, exportando, erroExport } = useExport();

  const handleDownload = async () => {
    if (!selected) return;
    await exportar(selected, "download", finalListJson, tema);
    if (!erroExport) onClose();
  };

  const handleCopiar = async () => {
    if (!selected) return;
    await exportar(selected, "clipboard", finalListJson, tema);
    if (!erroExport) {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

  const formatoAtivo = FORMATOS.find((f) => f.id === selected);

  return (
    <BaseModal
      title="Exportar lista"
      subtitle="Escolha o formato e como deseja receber"
      onClose={onClose}
      onConfirm={handleDownload}
      confirmLabel={exportando ? "Exportando..." : "⬇ Download"}
      confirmDisabled={!selected || exportando}
    >
      {/* Seleção de formato */}
      <div className="flex flex-col gap-2">
        {FORMATOS.map((fmt) => (
          <button
            key={fmt.id}
            onClick={() => setSelected(fmt.id)}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all"
            style={{
              background: selected === fmt.id ? T.accent  : T.surface,
              border:     `1.5px solid ${selected === fmt.id ? T.accent : T.border}`,
              color:      selected === fmt.id ? '#F5ECD7' : T.text,
            }}
          >
            <span style={{ fontSize: '20px' }}>{fmt.icon}</span>
            <div className="flex-1">
              <div className="text-sm font-bold">{fmt.label}</div>
              <div className="text-xs" style={{ color: selected === fmt.id ? T.border : T.muted }}>
                {fmt.desc}
              </div>
            </div>
            {selected === fmt.id && (
              <span className="font-black" style={{ color: T.confirmLabel }}>✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Botão copiar — só aparece se formato suporta clipboard */}
      {selected && formatoAtivo?.clipboardOk && (
        <button
          onClick={handleCopiar}
          disabled={exportando}
          className="w-full py-2.5 rounded-lg text-sm font-bold transition-all hover:opacity-80 disabled:opacity-40"
          style={{
            background: copiado ? T.accent   : 'transparent',
            border:     `1.5px solid ${T.border}`,
            color:      copiado ? T.confirmLabel : T.accent,
          }}
        >
          {copiado ? '✓ Copiado para clipboard!' : '📋 Copiar para clipboard'}
        </button>
      )}

      {/* Aviso XLSX sem clipboard */}
      {selected === 'xlsx' && (
        <p className="text-xs font-mono text-center" style={{ color: T.muted }}>
          Excel não suporta cópia para clipboard — use o download.
        </p>
      )}

      {/* Erro */}
      {erroExport && (
        <p className="text-xs font-mono" style={{ color: '#c0392b' }}>
          ❌ {erroExport}
        </p>
      )}
    </BaseModal>
  );
};

export default ExportModal;