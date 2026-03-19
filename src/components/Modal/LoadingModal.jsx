import React, { useEffect, useState } from 'react';
import { MODAL_THEME as T } from './modalTheme';

const BRAND_CHARS = ['u', 'l', 'I', 'A', '.', '.', '.'];

const STATUS_BY_STEP = {
  atributos: 'gerando atributos...',
  filtros:   'gerando filtros...',
  geracao:   'processando dados...',
  validacao: 'validando com auditor...',
  default:   'inicializando pipeline...',
};

/**
 * LoadingModal
 *
 * @param {boolean}  isOpen       - Exibe ou oculta o modal
 * @param {string}   pipelineStep - Etapa atual (atributos | filtros | geracao | validacao)
 * @param {string[]} logEntries   - Entradas do ticker de log
 */
const LoadingModal = ({ isOpen, pipelineStep, logEntries = [] }) => {
  const [statusText, setStatusText] = useState(STATUS_BY_STEP.default);

  useEffect(() => {
    setStatusText(STATUS_BY_STEP[pipelineStep] ?? STATUS_BY_STEP.default);
  }, [pipelineStep]);

  if (!isOpen) return null;

  const tickerText = logEntries.length > 0
    ? logEntries.map((e) => `→ ${e}`).join('   ') + '   '
    : '→ aguardando dados   ';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: T.overlay }}
    >
      <div
        className="relative flex flex-col items-center rounded-2xl p-8 shadow-2xl gap-8"
        style={{ background: T.bg, border: `2px solid ${T.border}`, minWidth: '380px', maxWidth: '90vw' }}
      >
        {/* ulIA... animado */}
        <div style={styles.brand}>
          {BRAND_CHARS.map((char, i) => (
            <span
              key={i}
              style={{
                ...styles.char,
                animationDelay: `${i * 0.15}s`,
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Status da etapa */}
        <p style={{ ...styles.status, color: T.muted }}>{statusText}</p>

        {/* Ticker de log */}
        <div style={{ ...styles.ticker, background: T.surface, border: `1px solid ${T.border}` }}>
          <div style={{ ...styles.tickerLabel, color: T.muted }}>LOG</div>
          <div style={styles.tickerTrack}>
            <span style={{ ...styles.tickerText, color: T.accent }}>{tickerText}</span>
          </div>
        </div>

        {/* Barra de progresso */}
        <div style={{ ...styles.progressBar, background: T.border }}>
          <div style={{ ...styles.progressFill, background: T.accent }} />
        </div>
      </div>

      <style>{cssAnimations(T)}</style>
    </div>
  );
};

const cssAnimations = (T) => `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=DM+Mono:wght@400;500&display=swap');

  @keyframes lmBounce {
    0%, 60%, 100% { transform: translateY(0px) scale(1);       opacity: 0.45; color: ${T.muted};   }
    30%            { transform: translateY(-14px) scale(1.25);  opacity: 1;    color: ${T.accent};  }
  }

  @keyframes lmScroll {
    0%   { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }

  @keyframes lmProgressFlow {
    0%   { width: 0%;  margin-left: 0%; }
    50%  { width: 60%; margin-left: 20%; }
    100% { width: 0%;  margin-left: 100%; }
  }
`;

const styles = {
  brand: {
    fontFamily:    "'Playfair Display', Georgia, serif",
    fontSize:      '52px',
    fontWeight:    900,
    letterSpacing: '-2px',
    lineHeight:    1,
    display:       'flex',
    alignItems:    'flex-end',
  },
  char: {
    display:                 'inline-block',
    transformOrigin:         'center bottom',
    animationName:           'lmBounce',
    animationDuration:       '1.4s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
  },
  status: {
    fontFamily:    "'DM Mono', monospace",
    fontSize:      '12px',
    letterSpacing: '0.08em',
    margin:        0,
    textAlign:     'center',
    transition:    'opacity 0.3s ease',
  },
  ticker: {
    width:        '100%',
    borderRadius: '8px',
    padding:      '10px 14px',
    overflow:     'hidden',
  },
  tickerLabel: {
    fontFamily:    "'DM Mono', monospace",
    fontSize:      '10px',
    letterSpacing: '0.12em',
    marginBottom:  '6px',
  },
  tickerTrack: {
    overflow: 'hidden',
  },
  tickerText: {
    display:                 'inline-block',
    whiteSpace:              'nowrap',
    fontFamily:              "'DM Mono', monospace",
    fontSize:                '11.5px',
    animationName:           'lmScroll',
    animationDuration:       '14s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  progressBar: {
    width:        '100%',
    height:       '3px',
    borderRadius: '99px',
    overflow:     'hidden',
  },
  progressFill: {
    height:                  '100%',
    borderRadius:            '99px',
    animationName:           'lmProgressFlow',
    animationDuration:       '2.2s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
  },
};

export default LoadingModal;