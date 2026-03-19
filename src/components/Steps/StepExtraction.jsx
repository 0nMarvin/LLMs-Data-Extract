import React, { useState, useEffect, useRef } from 'react';
import Button from '../Button';
import ExportModal from '../Modal/ExportModal';

const ALTURA_COLAPSADA = 420;
const SCROLL_PASSO     = 200;

const StepExtraction = ({ tema, quantidade, resultado, finalListJson, isLoading, error, onEditar, onNewList }) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [copiado,      setCopiado]      = useState(false);
  const [expandido,    setExpandido]    = useState(false);
  const [aoFundo,      setAoFundo]      = useState(false);


  const conteudoRef = useRef(null);
  const cardRef      = useRef(null);

  useEffect(() => {
    const anchor = document.getElementById('extraction-anchor');
    if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleCopiar = async () => {
    if (!resultado) return;
    try {
      await navigator.clipboard.writeText(resultado);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      console.warn("Clipboard indisponível");
    }
  };

  const irParaFim  = () => { cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end'   }); setAoFundo(true);  };
  const irParaTopo = () => { cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setAoFundo(false); };
  const toggleScroll = () => aoFundo ? irParaTopo() : irParaFim();
  const scrollUp   = () => conteudoRef.current?.scrollBy({ top: -SCROLL_PASSO, behavior: 'smooth' });
  const scrollDown = () => conteudoRef.current?.scrollBy({ top:  SCROLL_PASSO, behavior: 'smooth' });

  const temConteudo = resultado && !error;

  return (
    <div className="flex flex-col gap-8 mt-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Divisor */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px" style={{ background: 'rgba(42,16,5,0.1)' }} />
        <span className="text-[9px] font-black font-mono uppercase tracking-widest" style={{ color: 'rgba(42,16,5,0.3)' }}>
          resultado
        </span>
        <div className="flex-1 h-px" style={{ background: 'rgba(42,16,5,0.1)' }} />
      </div>

      {/* Cabeçalho */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase font-mono" style={{ color: '#2A1005' }}>Resultado</h1>
          <p className="text-sm mt-1 italic" style={{ color: '#C8A76A' }}>
            {quantidade} itens gerados para{' '}
            <span className="font-bold not-italic" style={{ color: '#7B3A10' }}>"{tema}"</span>
          </p>
        </div>
      </div>

      {/* Card de resultado */}
      <div className="relative">
      <div
        ref={cardRef}
        className="rounded-2xl flex flex-col"
        style={{ background: '#FFFEF0', border: '1.5px solid #E8D5A3', minHeight: '320px' }}
      >
        {/* Cabeçalho do card */}
        <div
          className="flex items-center gap-2 px-8 py-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(42,16,5,0.08)' }}
        >
          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: '#F5C842' }} />
          <span className="text-xs font-black font-mono uppercase tracking-widest" style={{ color: 'rgba(42,16,5,0.35)' }}>
            {error ? 'erro na geração' : `${quantidade} itens · ${tema}`}
          </span>

          {temConteudo && (
            <div className="ml-auto flex items-center gap-2">
              {/* Scroll up/down — só visível quando colapsado */}
              {!expandido && (
                <>
                  <button
                    onClick={scrollUp}
                    title="Subir"
                    className="text-[11px] px-2 py-1 rounded transition-all hover:opacity-70 font-mono font-black"
                    style={{ border: '1px solid rgba(42,16,5,0.15)', color: 'rgba(42,16,5,0.4)' }}
                  >
                    ↑
                  </button>
                  <button
                    onClick={scrollDown}
                    title="Descer"
                    className="text-[11px] px-2 py-1 rounded transition-all hover:opacity-70 font-mono font-black"
                    style={{ border: '1px solid rgba(42,16,5,0.15)', color: 'rgba(42,16,5,0.4)' }}
                  >
                    ↓
                  </button>
                </>
              )}

              {/* Expandir / Colapsar */}
              <button
                onClick={() => { setExpandido((v) => !v); setAoFundo(false); }}
                title={expandido ? 'Colapsar' : 'Expandir lista completa'}
                className="text-[10px] font-black font-mono uppercase tracking-widest px-3 py-1 rounded-md transition-all hover:opacity-70"
                style={{
                  background: expandido ? '#7B3A10' : 'transparent',
                  border:     '1px solid rgba(42,16,5,0.15)',
                  color:      expandido ? '#F5C842' : 'rgba(42,16,5,0.4)',
                }}
              >
                {expandido ? '⊟ colapsar' : '⊞ expandir'}
              </button>

              {/* Copiar */}
              <button
                onClick={handleCopiar}
                className="text-[10px] font-black font-mono uppercase tracking-widest px-3 py-1 rounded-md transition-all hover:opacity-70"
                style={{
                  background: copiado ? '#7B3A10' : 'transparent',
                  border:     '1px solid rgba(42,16,5,0.15)',
                  color:      copiado ? '#F5C842' : 'rgba(42,16,5,0.4)',
                }}
              >
                {copiado ? '✓ copiado' : '📋 copiar'}
              </button>
            </div>
          )}
        </div>

        {/* Corpo do card — altura controlada */}
        <div
          ref={conteudoRef}
          className="px-8 py-6 transition-all duration-300"
          style={{
            overflowY:  expandido ? 'visible' : 'auto',
            maxHeight:  expandido ? 'none'    : `${ALTURA_COLAPSADA}px`,
          }}
        >
          {/* Erro */}
          {error && (
            <div className="flex items-center justify-center" style={{ minHeight: '200px' }}>
              <p className="text-sm font-mono text-center" style={{ color: '#7B3A10' }}>❌ {error}</p>
            </div>
          )}

          {/* Aguardando */}
          {!error && !resultado && (
            <div className="flex items-center justify-center" style={{ minHeight: '200px' }}>
              <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'rgba(42,16,5,0.3)' }}>
                aguardando pipeline...
              </p>
            </div>
          )}

          {/* Resultado */}
          {temConteudo && (
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#2A1005', fontFamily: 'Georgia, serif' }}>
              {resultado}
            </p>
          )}
        </div>

        {/* Gradiente de fade no rodapé do card quando colapsado */}
        {temConteudo && !expandido && (
          <div
            className="h-8 shrink-0 rounded-b-2xl pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, #FFFEF0)' }}
          />
        )}
      </div>

      {/* Seta fixa na viewport — aparece apenas quando expandido */}
      {temConteudo && expandido && (
        <button
          onClick={toggleScroll}
          title={aoFundo ? 'Ir para o topo' : 'Ir para o final'}
          className="flex flex-col items-center justify-center gap-1 hover:opacity-70 transition-all"
          style={{
            position:  'fixed',
            right:     '1.5rem',
            top:       '50%',
            transform: 'translateY(-50%)',
            zIndex:    40,
          }}
        >
          <div
            className="flex items-center justify-center w-9 h-9 rounded-full shadow-md transition-all"
            style={{ border: '1.5px solid #E8D5A3', background: '#FFFEF0' }}
          >
            <span className="text-base font-black" style={{ color: '#7B3A10' }}>
              {aoFundo ? '↑' : '↓'}
            </span>
          </div>
          <span
            className="text-[8px] font-black font-mono uppercase tracking-widest"
            style={{ writingMode: 'vertical-rl', color: '#C8A76A' }}
          >
            {aoFundo ? 'topo' : 'fim'}
          </span>
        </button>
      )}
      </div>

      {/* Ações */}
      {!isLoading && (
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onEditar}>[ editar ]</Button>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={onNewList}>+ Nova Lista</Button>
            {temConteudo && (
              <Button variant="primary" onClick={() => setIsExportOpen(true)}>📤 Exportar</Button>
            )}
          </div>
        </div>
      )}

      {isExportOpen && (
        <ExportModal
          finalListJson={finalListJson}
          tema={tema}
          onClose={() => setIsExportOpen(false)}
        />
      )}
    </div>
  );
};

export default StepExtraction;