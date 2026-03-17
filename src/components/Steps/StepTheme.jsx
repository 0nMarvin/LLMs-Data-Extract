import React from 'react';

const StepTheme = ({ onConfirm }) => {
  const [tema, setTema] = React.useState('');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(42, 16, 5, 0.75)' }}
    >
      <div
        className="flex flex-col gap-5 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300"
        style={{ background: '#FFFEF0', border: '2px solid #E8D5A3', minWidth: '380px', maxWidth: '90vw' }}
      >
        <div>
          <h2 className="font-black text-lg" style={{ color: '#2A1005', fontFamily: 'Georgia, serif' }}>
            Qual é o tema da lista?
          </h2>
          <p className="text-xs mt-1" style={{ color: '#C8A76A' }}>
            Defina o tema para a lista que a IA irá extrair
          </p>
        </div>

        <input
          autoFocus
          type="text"
          value={tema}
          onChange={(e) => setTema(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && tema.trim() && onConfirm(tema.trim())}
          placeholder="Ex: Artistas de jazz brasileiros..."
          className="rounded-lg px-4 py-3 text-sm outline-none transition-all"
          style={{
            background: '#FFF8E7',
            border: `1.5px solid ${tema ? '#7B3A10' : '#E8D5A3'}`,
            color: '#2A1005',
          }}
        />

        <div className="flex justify-end">
          <button
            onClick={() => tema.trim() && onConfirm(tema.trim())}
            disabled={!tema.trim()}
            className="px-5 py-2 rounded-lg text-sm font-bold transition-all"
            style={{
              background: tema.trim() ? '#7B3A10' : '#E8D5A3',
              color: tema.trim() ? '#F5C842' : '#C8A76A',
              cursor: tema.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Confirmar tema →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepTheme;