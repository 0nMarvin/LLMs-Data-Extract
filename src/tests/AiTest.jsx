import React from "react";
import useAiModels from "../hooks/useAiModels";
import useFetch from "../hooks/useFetch";
import { POST_PROMPT } from "../api";

const AITest = () => {
  const [corpo, setCorpo] = React.useState("");
  
  // Integração com o seu hook useAiModels
  const { models, activeModel, setSelectedModelId } = useAiModels(); 
  const { data, loading, error, request } = useFetch();

  /**
   * Envia o prompt para a API
   */
  async function handleSend() {
    if (!corpo.trim()) return;S

    try {
      // Usa o ID do modelo ativo definido no hook
      const { url, options } = POST_PROMPT(corpo, activeModel.id);
      
      console.log(`Enviando para o modelo: ${activeModel.name} (${activeModel.id})`);
      
      await request(url, options);
    } catch (err) {
      console.error("Erro detalhado na requisição:", err);
    }
  }

  // Extração segura da resposta do OpenRouter
  const respostaIA = data?.choices?.[0]?.message?.content;

  return (
    <section className="max-w-2xl mx-auto m-8 p-6 bg-white rounded-xl shadow-md border border-slate-200 font-sans">
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Teste de IA</h1>
          <p className="text-sm text-slate-500">Fluxo de Mediação e Modelagem</p>
        </div>

        {/* Seletor de Modelo Dinâmico */}
        <div className="flex flex-col items-end">
          <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">
            Modelo Ativo
          </label>
          <select 
            value={activeModel?.id} 
            onChange={(e) => setSelectedModelId(e.target.value)} // Atualiza o ID no useAiModels
            className="p-2 text-xs border rounded-md bg-slate-50 border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hover:bg-white transition-colors"
          >
            {models?.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="space-y-4">
        {/* Área de Input do Prompt */}
        <div className="relative">
          <textarea
            value={corpo}
            onChange={(event) => setCorpo(event.target.value)}
            placeholder="Digite o tema ou prompt para testar..."
            className="w-full h-40 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none shadow-sm"
          />
          <span className="absolute bottom-3 right-3 text-[10px] text-slate-400">
            {corpo.length} caracteres
          </span>
        </div>

        <button 
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-lg shadow-sm transition-all flex justify-center items-center gap-2 ${
            loading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
          }`}
          onClick={handleSend}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processando...
            </>
          ) : (
            "Gerar Resposta"
          )}
        </button>
      </div>

      {/* Tratamento de Erro (Especialmente para 429) */}
      {error && (
        <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-bold text-orange-800 uppercase tracking-tight">Erro na Requisição</h3>
              <div className="text-sm text-orange-700 mt-1">
                {error.includes("429") ? (
                  <p><strong>Limite Atingido (Too Many Requests):</strong> O OpenRouter bloqueou esta chamada temporariamente. Aguarde 30-60 segundos ou mude o modelo.</p>
                ) : (
                  <p>{error}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Área de Resposta da IA */}
      {respostaIA && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resposta ({activeModel.name})</h3>
            <button 
              onClick={() => navigator.clipboard.writeText(respostaIA)}
              className="text-[10px] text-blue-600 hover:underline font-bold"
            >
              Copiar JSON
            </button>
          </div>
          <div className="p-4 bg-slate-900 text-slate-100 rounded-lg border border-slate-800 shadow-inner overflow-x-auto">
            <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono">
              {respostaIA}
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}

export default AITest;