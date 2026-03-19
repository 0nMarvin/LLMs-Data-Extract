import React, { useState } from 'react';
import BaseModal from './BaseModal';
import { MODAL_THEME as T } from './modalTheme';

/**
 * ErrorModal
 * Exibe detalhes do erro com botão copiar para suporte.
 *
 * @param {{ message, context, timestamp } | null} errorReport
 * @param {Function} onClose
 */
const ErrorModal = ({ errorReport, onClose }) => {
  const [copiado, setCopiado] = useState(false);

  if (!errorReport) return null;

  const textoParaCopiar = [
    `❌ Erro: ${errorReport.message}`,
    `🕐 Horário: ${new Date(errorReport.timestamp).toLocaleString('pt-BR')}`,
    errorReport.context && Object.keys(errorReport.context).length > 0
      ? `📋 Contexto:\n${JSON.stringify(errorReport.context, null, 2)}`
      : null,
  ].filter(Boolean).join('\n\n');

  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText(textoParaCopiar);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      console.warn("Clipboard indisponível");
    }
  };

  return (
    <BaseModal
      title="Ocorreu um erro"
      subtitle="Copie as informações abaixo e envie para o suporte"
      onClose={onClose}
      onConfirm={handleCopiar}
      confirmLabel={copiado ? '✓ Copiado!' : '📋 Copiar para suporte'}
      confirmDisabled={false}
    >
      {/* Mensagem principal */}
      <div
        className="rounded-lg px-4 py-3 text-sm font-mono"
        style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.accent }}
      >
        {errorReport.message}
      </div>

      {/* Detalhes técnicos */}
      {errorReport.context && Object.keys(errorReport.context).length > 0 && (
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-black font-mono uppercase tracking-widest" style={{ color: T.muted }}>
            contexto técnico
          </p>
          <pre
            className="rounded-lg px-4 py-3 text-xs font-mono overflow-auto"
            style={{
              background:  T.surface,
              border:      `1px solid ${T.border}`,
              color:       T.text,
              maxHeight:   '160px',
            }}
          >
            {JSON.stringify(errorReport.context, null, 2)}
          </pre>
        </div>
      )}

      {/* Timestamp */}
      <p className="text-[10px] font-mono" style={{ color: T.muted }}>
        {new Date(errorReport.timestamp).toLocaleString('pt-BR')}
      </p>
    </BaseModal>
  );
};

export default ErrorModal;