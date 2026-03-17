import React from 'react';

const TagItem = ({ label, onRemove }) => (
  <div className="flex items-center gap-2 bg-white border border-brand-200 px-3 py-1 rounded-md text-brand-900 text-sm font-medium shadow-sm hover:border-brand-400 transition-all animate-in fade-in zoom-in duration-200">
    <span>{label}</span>
    <button
      onClick={onRemove}
      className="text-brand-300 hover:text-red-500 transition-colors font-bold text-lg leading-none focus:outline-none"
      title="Remover"
    >
      ×
    </button>
  </div>
);

export default TagItem;