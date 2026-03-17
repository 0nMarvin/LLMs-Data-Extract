// StepExtraction.jsx — scroll automático para a âncora ao montar
import React, { useState, useEffect } from 'react';
import Button from '../Button';
import ExportModal from '../Modal/ExportModal';

const StepExtraction = ({ tema, quantidade, resultado, isLoading, onBack, onNewList }) => {
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Scroll automático ao montar
  useEffect(() => {
    const anchor = document.getElementById('extraction-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleExport = (formato) => {
    console.log(`Exportando em ${formato}...`);
  };

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
        <Button variant="ghost" onClick={onBack}>[ editar ]</Button>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl p-8 flex flex-col gap-4"
        style={{ background: '#FFFEF0', border: '1.5px solid #E8D5A3', minHeight: '320px' }}
      >
        <div className="flex items-center gap-2 pb-4" style={{ borderBottom: '1px solid rgba(42,16,5,0.08)' }}>
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: '#F5C842', animation: isLoading ? 'pulse 1s infinite' : 'none' }}
          />
          <span className="text-xs font-black font-mono uppercase tracking-widest" style={{ color: 'rgba(42,16,5,0.35)' }}>
            {isLoading ? 'Extraindo...' : `${quantidade} itens · ${tema}`}
          </span>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: '#F5C842',
                    animation: 'bounce 1.2s ease-in-out infinite',
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
            <p className="text-xs font-black font-mono uppercase tracking-widest" style={{ color: 'rgba(42,16,5,0.4)' }}>
              Extraindo lista...
            </p>
            <style>{`
              @keyframes bounce {
                0%, 100% { transform: translateY(0); opacity: 0.3; }
                50% { transform: translateY(-6px); opacity: 1; }
              }
            `}</style>
          </div>
        )}

        {/* Resultado */}
        {!isLoading && resultado && (
          <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#2A1005', fontFamily: 'Georgia, serif' }}>
            {resultado}
          </p>
        )}
      </div>

      {/* Ações */}
      {!isLoading && (
        <div className="flex items-center justify-between">
          <Button variant="secondary" onClick={onNewList}>+ Nova Lista</Button>
          <Button variant="primary" onClick={() => setIsExportOpen(true)}>📤 Exportar</Button>
        </div>
      )}

      {isExportOpen && (
        <ExportModal onExport={handleExport} onClose={() => setIsExportOpen(false)} />
      )}
    </div>
  );
};

export default StepExtraction;