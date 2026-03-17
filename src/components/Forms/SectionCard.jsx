import React, { useState, useRef } from 'react';
import TagItem from './TagItem';

const SectionCard = ({ title, subtitle, items = [], onRemoveItem, onAddItem }) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const spanRef = useRef(null);

  const handleAddClick = () => {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      onAddItem(inputValue.trim());
      setInputValue('');
      setEditing(false);
    }
    if (e.key === 'Escape') {
      setEditing(false);
      setInputValue('');
    }
  };

  return (
    <div className="w-full py-4" style={{ borderBottom: '1px solid rgba(42,16,5,0.12)' }}>
      {/* Cabeçalho inline */}
      <div className="flex items-center gap-2 mb-3">
        <h3
          className="font-black uppercase text-xs tracking-[0.25em]"
          style={{ color: '#2A1005', fontFamily: "'Space Mono', monospace" }}
        >
          {title}
        </h3>
        {subtitle && (
          <>
            <span style={{ color: 'rgba(42,16,5,0.25)', fontSize: '14px' }}>|</span>
            <span className="text-xs italic" style={{ color: '#C8A76A' }}>
              {subtitle}
            </span>
          </>
        )}
      </div>

      {/* Tags + input */}
      <div className="flex flex-wrap gap-2 items-center">
        {items.map((item, index) => (
          <TagItem
            key={index}
            label={item}
            onRemove={() => onRemoveItem(index)}
          />
        ))}

        {editing && (
          <div className="relative flex items-center">
            <span
              ref={spanRef}
              className="absolute invisible whitespace-pre text-xs font-bold px-3 py-1"
            >
              {inputValue || ' '}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => { setEditing(false); setInputValue(''); }}
              placeholder="digitando"
              className="text-xs font-bold outline-none rounded-full px-3 py-1 transition-all"
              style={{
                background: '#FFF8C0',
                border: '1.5px solid #C8A76A',
                color: '#2A1005',
                width: spanRef.current ? spanRef.current.offsetWidth + 30 : '90px',
                minWidth: '90px',
              }}
            />
          </div>
        )}

        {!editing && (
          <button
            onClick={handleAddClick}
            className="flex items-center justify-center w-7 h-7 rounded-full transition-all cursor-pointer text-lg leading-none"
            style={{ border: '1.5px solid rgba(42,16,5,0.2)', color: 'rgba(42,16,5,0.35)' }}
            title="Adicionar item"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
};

export default SectionCard;