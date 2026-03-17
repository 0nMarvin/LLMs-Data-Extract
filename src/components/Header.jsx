import React from 'react';
import { useAiModels } from '../viewmodels/useAiModels';

const Header = () => {
  const { models, selectedModelId, setSelectedModelId, activeModel } = useAiModels();

  return (
    <header className="flex justify-center items-center px-6 py-4 bg-brand-50 shadow-md">

      <div className="relative flex items-center">

        <div
          className="absolute left-2 z-10 w-9 h-9 rounded-full overflow-hidden border-2 border-brand-50 flex items-center justify-center wh shrink-0"
        >
          {activeModel?.img ? (
            <img
              src={activeModel.img}
              alt={activeModel.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-[10px] font-bold text-brand-700">IA</div>
          )}
        </div>

        <select
          value={selectedModelId}
          onChange={(e) => setSelectedModelId(e.target.value)}
          className="bg-brand-900 h-12 w-80 rounded-full text-brand-50 text-center text-base 
                     appearance-none border-none pl-14 pr-12 cursor-pointer 
                     hover:bg-brand-800 transition-colors shadow-inner"
        >
          {models.map(m => (
            <option key={m.id} value={m.id} className="bg-white text-black text-left">
              {m.name}
            </option>
          ))}
        </select>

        <div className="absolute right-4 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3"
            stroke="currentColor"
            className="w-5 h-5 text-brand-50"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

      </div>
    </header>
  );
};

export default Header;