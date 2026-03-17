import React from 'react';

const BadgeCount = ({ count, limit }) => {
  const isFull = limit && count >= limit;

  return (
    <div 
      className={`flex items-center justify-center px-2 h-6 rounded-sm shadow-sm transition-all duration-300 ${
        isFull ? 'bg-[#7B3A10]' : 'bg-[#2A1005]'
      }`}
    >
      <span 
        className="text-[#F5C842] text-[10px] font-black leading-none whitespace-nowrap"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        {count.toString().padStart(2, '0')}
        {limit && <span className="opacity-40 ml-1">/ {limit.toString().padStart(2, '0')}</span>}
      </span>
    </div>
  );
};

export default BadgeCount;