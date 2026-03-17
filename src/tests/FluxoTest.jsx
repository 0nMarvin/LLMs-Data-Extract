import React, { useState } from "react";
import { usePipeline } from "../viewmodels/usePipeline";

const FluxoTest = () => {
  const {
    iniciarModelar,
    iniciarProcessar,
    iniciarValidar,
    editarAtributos,
    editarFiltros,
    models,
    selectedModelId,
    setSelectedModelId,
    loading,
    pipelineStep,
    error,
    generationData,
  } = usePipeline();

  const [temaInput, setTemaInput] = useState("");

  const handleEditAtributos = (e) => {
    const lista = e.target.value.split("\n").filter(i => i.trim() !== "");
    editarAtributos(lista);
  };

  const handleEditFiltros = (e) => {
    const lista = e.target.value.split("\n").filter(i => i.trim() !== "");
    editarFiltros(lista);
  };

  return (
    <section style={{ padding: "20px", paddingBottom: "100px", fontFamily: "sans-serif", backgroundColor: "#f4f4f9", minHeight: "100vh" }}>
      <h1>🛠️ Sandbox do Pipeline InOut</h1>

      <div style={cardStyle}>
        <h3>Passo 1: Definir Tema</h3>

        <div style={{ marginBottom: "12px" }}>
          <label style={labelStyle}>🤖 Modelo</label>
          <select
            value={selectedModelId}
            onChange={(e) => setSelectedModelId(e.target.value)}
            disabled={loading}
            style={selectStyle}
          >
            {models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>📌 Tema</label>
          <input
            value={temaInput}
            onChange={(e) => setTemaInput(e.target.value)}
            placeholder="Ex: Carros de Luxo"
            style={inputStyle}
          />
          <button
            onClick={() => iniciarModelar(temaInput)}
            disabled={loading || !temaInput}
            style={buttonStyle}
          >
            {pipelineStep === "atributos" || pipelineStep === "filtros"
              ? "Modelando..."
              : "Gerar Atributos e Filtros"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
        <div style={cardStyle}>
          <h4>📋 Atributos (Curadoria)</h4>
          <textarea
            value={generationData.atributos?.join("\n") || ""}
            onChange={handleEditAtributos}
            style={textAreaStyle}
          />
        </div>
        <div style={cardStyle}>
          <h4>🔍 Filtros (Curadoria)</h4>
          <textarea
            value={generationData.filtros?.join("\n") || ""}
            onChange={handleEditFiltros}
            style={textAreaStyle}
          />
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: "20px", textAlign: "center" }}>
        <h3>Passo 2 & 3: Processamento Final</h3>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={() => iniciarProcessar(15)}
            disabled={loading || !generationData.atributos}
            style={{ ...buttonStyle, backgroundColor: "#2196F3" }}
          >
            {pipelineStep === "geracao" ? "Gerando Lista..." : "Gerar Lista (Processar)"}
          </button>
          <button
            onClick={iniciarValidar}
            disabled={loading || !generationData.finalList}
            style={{ ...buttonStyle, backgroundColor: "#4CAF50" }}
          >
            {pipelineStep === "validacao" ? "Validando..." : "Validar com Auditor (QA)"}
          </button>
        </div>
      </div>

      {generationData.finalList && (
        <div style={{ ...cardStyle, marginTop: "20px", backgroundColor: "#fff" }}>
          <h3>📄 Resultado da Modelagem</h3>
          <div
            style={{
              whiteSpace: "pre-wrap",
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "5px",
              maxHeight: "450px",
              overflowY: "auto",
              backgroundColor: "#fafafa"
            }}
          >
            {generationData.finalList.list}
          </div>
        </div>
      )}

      <footer style={footerStyle}>
        <span>Modelo: <strong>{selectedModelId}</strong></span>
        <span style={{ marginLeft: "20px" }}>Status: <strong>{pipelineStep || "Ocioso"}</strong></span>
        {loading && <span style={{ marginLeft: "20px", color: "#2196F3" }}>⏳ Processando...</span>}
        {error && <span style={{ marginLeft: "20px", color: "red" }}>❌ {error}</span>}
      </footer>
    </section>
  );
};

const cardStyle = { background: "white", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" };
const labelStyle = { display: "block", marginBottom: "4px", fontSize: "13px", fontWeight: "600", color: "#555" };
const inputStyle = { padding: "10px", width: "250px", marginRight: "10px", borderRadius: "4px", border: "1px solid #ccc" };
const selectStyle = { padding: "10px", minWidth: "250px", borderRadius: "4px", border: "1px solid #ccc", backgroundColor: "white", fontSize: "14px", cursor: "pointer" };
const buttonStyle = { padding: "10px 20px", borderRadius: "4px", border: "none", backgroundColor: "#6200ee", color: "white", cursor: "pointer" };
const textAreaStyle = { width: "100%", height: "150px", marginTop: "10px", padding: "10px", borderRadius: "4px", border: "1px solid #ddd", fontFamily: "monospace" };
const footerStyle = { position: "fixed", bottom: 0, left: 0, width: "100%", background: "#333", color: "#fff", padding: "10px 20px", fontSize: "14px", zIndex: 1000 };

export default FluxoTest;