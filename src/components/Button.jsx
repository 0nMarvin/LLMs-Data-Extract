import React from 'react';

const variants = {
  primary:   { background: '#7B3A10', color: '#F5C842', border: 'none' },
  secondary: { background: 'transparent', color: '#7B3A10', border: '2px solid #7B3A10' },
  ghost:     { background: 'transparent', color: '#C8A76A', border: 'none' },
  danger:    { background: '#FFF8C0', color: '#c0392b', border: '1.5px solid #c0392b' },
};

const Button = ({ children, onClick, variant = 'primary', disabled = false, className = '', ...props }) => {
  const style = variants[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2.5 rounded-lg font-black text-xs tracking-[0.25em] uppercase font-mono transition-all active:scale-95 hover:opacity-80 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      style={{ ...style, opacity: disabled ? 0.4 : 1 }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;