import { useState } from "react";

const conversations = [
  { id: 1, title: "Lista Artistas", model: "DeepSeek: R1 0528" },
  { id: 2, title: "Lista Países Famosos", model: "OpenAI: gpt-oss-20b" },
  { id: 3, title: "Álbuns de 2023", model: "DeepSeek: R1 0528" },
  { id: 4, title: "Lista Artistas", model: "Meta: Llama 4 Maverick" },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(1);

  return (
    /* Ajuste 1: O container pai agora tem largura dinâmica e pointer-events-none 
       para não bloquear o que está atrás da área transparente.
    */
    <div className="fixed inset-y-0 left-0 z-50 pointer-events-none font-mono">
      
      {/* Sidebar - Reativamos o pointer-events para os cliques funcionarem nela */}
      <div
        className="h-full flex flex-col transition-all duration-300 pointer-events-auto shadow-2xl"
        style={{ 
          width: open ? "220px" : "52px", 
          background: "linear-gradient(180deg, #3B1A08 0%, #2A1005 100%)" 
        }}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-end px-3 py-3 shrink-0 transition-all duration-300 rounded-br-lg shadow-md"
          style={{
            background: "#7B3A10",
            width: open ? "100%" : "calc(100% + 12px)",
          }}
        >
          <button onClick={() => setOpen(!open)} className="flex flex-col gap-1 p-1 hover:opacity-70 transition-opacity cursor-pointer">
            <span className="block w-5 h-0.5 bg-yellow-100" />
            <span className="block w-5 h-0.5 bg-yellow-100" />
            <span className="block w-5 h-0.5 bg-yellow-100" />
          </button>
        </div>

        {/* Logo */}
        <div className="flex flex-col items-center justify-center py-8 shrink-0">
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
            <div className="flex flex-col items-center leading-none select-none" style={{ fontFamily: "Georgia, serif", color: "#F5C842" }}>
              <span className="font-black" style={{ fontSize: "1.5rem" }}>ul</span>
              <span className="font-black" style={{ fontSize: "1.5rem" }}>IA</span>
            </div>
          )}
        </div>

        <div className="mx-3 mb-2" style={{ height: "1px", background: "#7B3A1066" }} />

        {/* Lista de conversas */}
        {/* Adicionado overflow-hidden quando fechado para não bugar o texto */}
        <nav className={`flex flex-col gap-1 px-2 overflow-y-auto flex-1 ${!open && 'hidden'}`}>
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className="text-left px-3 py-3 rounded transition-colors cursor-pointer"
              style={{
                background: active === c.id ? "#7B3A10" : "transparent",
                borderLeft: active === c.id ? "3px solid #F5C842" : "3px solid transparent",
              }}
            >
              <div className="font-bold text-sm leading-tight" style={{ color: "#F5ECD7" }}>{c.title}</div>
              <div className="text-xs mt-0.5" style={{ color: "#C8A76A", fontFamily: "monospace" }}>{c.model}</div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;