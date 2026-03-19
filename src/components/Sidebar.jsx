import { useState } from "react";

/**
 * Sidebar
 * @param {Array}    listas         - Histórico do useStorage
 * @param {Function} onSelectLista  - Callback ao clicar numa lista salva
 * @param {Function} onRemoverLista - Callback para remover uma lista
 * @param {Function} onNovaLista    - Callback ao clicar no logo ulIA (cria nova lista)
 */
const Sidebar = ({ listas = [], onSelectLista, onRemoverLista, onNovaLista }) => {
  const [open,     setOpen]     = useState(false);
  const [activeId, setActiveId] = useState(null);

  const handleSelect = (lista) => {
    setActiveId(lista.id);
    onSelectLista?.(lista);
  };

  const handleNovaLista = () => {
    setActiveId(null);
    onNovaLista?.();
  };

  const formatarData = (iso) =>
    new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });

  return (
    <div className="fixed inset-y-0 left-0 z-50 pointer-events-none font-mono">
      <div
        className="h-full flex flex-col transition-all duration-300 pointer-events-auto shadow-2xl"
        style={{
          width:      open ? "240px" : "52px",
          background: "linear-gradient(180deg, #3B1A08 0%, #2A1005 100%)",
        }}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-end px-3 py-3 shrink-0 transition-all duration-300 rounded-br-lg shadow-md"
          style={{ background: "#7B3A10", width: open ? "100%" : "calc(100% + 12px)" }}
        >
          <button
            onClick={() => setOpen(!open)}
            className="flex flex-col gap-1 p-1 hover:opacity-70 transition-opacity cursor-pointer"
          >
            <span className="block w-5 h-0.5 bg-yellow-100" />
            <span className="block w-5 h-0.5 bg-yellow-100" />
            <span className="block w-5 h-0.5 bg-yellow-100" />
          </button>
        </div>

        {/* Logo — clicável para nova lista */}
        <button
          onClick={handleNovaLista}
          className="flex flex-col items-center justify-center py-8 shrink-0 hover:opacity-70 transition-opacity cursor-pointer w-full"
          title="Nova lista"
        >
          {open ? (
            <>
              <span
                className="font-black leading-none tracking-tighter select-none"
                style={{ fontSize: "3.5rem", color: "#F5C842", fontFamily: "Georgia, serif" }}
              >
                ulIA
              </span>
              <span className="text-center mt-2 text-sm font-semibold leading-snug" style={{ color: "#E8D5A3" }}>
                Extração de Lista<br />em IA
              </span>
            </>
          ) : (
            <div
              className="flex flex-col items-center leading-none select-none"
              style={{ fontFamily: "Georgia, serif", color: "#F5C842" }}
            >
              <span className="font-black" style={{ fontSize: "1.5rem" }}>ul</span>
              <span className="font-black" style={{ fontSize: "1.5rem" }}>IA</span>
            </div>
          )}
        </button>

        <div className="mx-3 mb-2" style={{ height: "1px", background: "#7B3A1066" }} />

        {/* Histórico de listas */}
        {open && (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="px-3 pb-2">
              <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: "#C8A76A" }}>
                listas salvas
              </p>
            </div>

            {listas.length === 0 ? (
              <p className="px-3 text-xs italic" style={{ color: "#7B3A1066" }}>
                Nenhuma lista ainda
              </p>
            ) : (
              <nav className="flex flex-col gap-1 px-2 overflow-y-auto flex-1 pb-4">
                {listas.map((lista) => (
                  <div
                    key={lista.id}
                    className="group relative rounded transition-colors"
                    style={{
                      background: activeId === lista.id ? "#7B3A10" : "transparent",
                      borderLeft: activeId === lista.id ? "3px solid #F5C842" : "3px solid transparent",
                    }}
                  >
                    <button
                      onClick={() => handleSelect(lista)}
                      className="w-full text-left px-3 py-3 pr-7 cursor-pointer"
                    >
                      <div className="text-[9px] font-mono mb-0.5" style={{ color: "#C8A76A" }}>
                        {formatarData(lista.criadoEm)}
                      </div>
                      <div className="font-bold text-sm leading-tight truncate" style={{ color: "#F5ECD7" }}>
                        {lista.tema}
                      </div>
                      <div className="text-[10px] mt-0.5 truncate" style={{ color: "#C8A76A" }}>
                        {lista.modelName}
                      </div>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoverLista?.(lista.id);
                        if (activeId === lista.id) setActiveId(null);
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-black cursor-pointer hover:text-red-400"
                      style={{ color: "#C8A76A" }}
                      title="Remover"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </nav>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;