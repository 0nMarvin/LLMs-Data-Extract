import React, { useState, useEffect, useRef, useMemo } from 'react';
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

  // --- AJUSTE: Contagem Real de Itens ---
  const contagemReal = useMemo(() => {
    try {
      if (!finalListJson) return 0;
      const parsed = typeof finalListJson === 'string' ? JSON.parse(finalListJson) : finalListJson;
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch (e) {
      return 0;
    }
  }, [finalListJson]);

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
      <div id="extraction-anchor" />
      
      {/* Divisor */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px" style={{ background: 'rgba(42,16,5,0.1)' }} />
        <span className="text-[9px] font-black font-mono uppercase tracking-widest" style={{ color: 'rgba(42,16,5,0.3)' }}>
          resultado
        </span>
        <div className="flex-1 h-px" style={{ background: 'rgba(42,16,5,0.1)' }} />
      </div>

      {/* Cabeçalho - Usando contagemReal */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase font-mono" style={{ color: '#2A1005' }}>Resultado</h1>
          <p className="text-sm mt-1 italic" style={{ color: '#C8A76A' }}>
            {contagemReal} itens gerados para{' '}
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
        <div
          className="flex items-center gap-2 px-8 py-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(42,16,5,0.08)' }}
        >
          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: '#F5C842' }} />
          <span className="text-xs font-black font-mono uppercase tracking-widest" style={{ color: 'rgba(42,16,5,0.35)' }}>
            {error ? 'erro na geração' : `${contagemReal} itens · ${tema}`}
          </span>

          {temConteudo && (
            <div className="ml-auto flex items-center gap-2">
              {!expandido && (
                <>
                  <button onClick={scrollUp} className="text-[11px] px-2 py-1 rounded transition-all hover:opacity-70 font-mono font-black" style={{ border: '1px solid rgba(42,16,5,0.15)', color: 'rgba(42,16,5,0.4)' }}>↑</button>
                  <button onClick={scrollDown} className="text-[11px] px-2 py-1 rounded transition-all hover:opacity-70 font-mono font-black" style={{ border: '1px solid rgba(42,16,5,0.15)', color: 'rgba(42,16,5,0.4)' }}>↓</button>
                </>
              )}
              <button
                onClick={() => { setExpandido((v) => !v); setAoFundo(false); }}
                className="text-[10px] font-black font-mono uppercase tracking-widest px-3 py-1 rounded-md transition-all hover:opacity-70"
                style={{
                  background: expandido ? '#7B3A10' : 'transparent',
                  border:     '1px solid rgba(42,16,5,0.15)',
                  color:      expandido ? '#F5C842' : 'rgba(42,16,5,0.4)',
                }}
              >
                {expandido ? '⊟ colapsar' : '⊞ expandir'}
              </button>
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

        <div
          ref={conteudoRef}
          className="px-8 py-6 transition-all duration-300"
          style={{
            overflowY:  expandido ? 'visible' : 'auto',
            maxHeight:  expandido ? 'none'    : `${ALTURA_COLAPSADA}px`,
          }}
        >
          {error && (
            <div className="flex items-center justify-center" style={{ minHeight: '200px' }}>
              <p className="text-sm font-mono text-center" style={{ color: '#7B3A10' }}>❌ {error}</p>
            </div>
          )}
          {!error && !resultado && (
            <div className="flex items-center justify-center" style={{ minHeight: '200px' }}>
              <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'rgba(42,16,5,0.3)' }}>aguardando pipeline...</p>
            </div>
          )}
          {temConteudo && (
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#2A1005', fontFamily: 'Georgia, serif' }}>
              {resultado}
            </p>
          )}
        </div>
      </div>
      </div>

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