// QuantitySelector.jsx
import React from 'react';

const QuantitySelector = ({ 
  label = "Quantidade",
  subtitle = "quantos itens?",
  value,
  onChange,
  min = 1,
  max = 100,
  step = 5,
}) => {
  const options = [];
  for (let i = min; i <= max; i += step) options.push(i);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-xl font-mono text-amber-700 font-bold">{label}</span>
        <span className="text-amber-700 font-bold">|</span>
        <span className="text-sm font-base italic text-amber-700">{subtitle}</span>
      </div>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="appearance-none w-full px-4 py-3 pr-10 rounded-lg text-sm font-bold font-mono outline-none cursor-pointer"
          style={{ background: '#FFF8C0', border: '1.5px solid #C8A76A', color: '#2A1005' }}
        >
          {options.map(n => (
            <option key={n} value={n}>{String(n).padStart(2, '0')}</option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#7B3A10' }}>▾</div>
      </div>
    </div>
  );
};

export default QuantitySelector;