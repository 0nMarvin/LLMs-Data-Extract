import React from "react";
import useAiModels from "../hooks/useAiModels";
import useFetch from "../hooks/useFetch";
import { POST_PROMPT, API_URL } from "../api";

const AITest = () => {
  const [corpo, setCorpo] = React.useState("");
  const aiModels = useAiModels(); 
  const { data, loading, error, request } = useFetch();

async function handleSend() {
    if (!corpo.trim()) return;
    console.log("Corpo do Prompt:", corpo);
    console.log("ID do Modelo Ativo:", aiModels.activeModel.id);

    try {
      const { url, options } = POST_PROMPT(corpo, aiModels.activeModel.id);
      
      // O hook useFetch já lida com o estado de loading e erro internamente
      await request(url, options);
    } catch (err) {
      console.error("Erro ao enviar prompt:", err);
    }
  }

  // Extraímos a resposta do JSON retornado pelo OpenRouter
  // O caminho costuma ser: data.choices[0].message.content
  const respostaIA = data?.choices?.[0]?.message?.content;

  return (
    <section className="max-w-2xl mx-auto m-8 p-6 bg-white rounded-xl shadow-md border border-slate-200">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Teste de IA</h1>
        <p className="text-sm text-slate-500">Modelo: {aiModels.activeModel?.name}</p>
      </header>

      <div className="space-y-4">
        <textarea
          value={corpo}
          onChange={(event) => setCorpo(event.target.value)}
          placeholder="Digite seu prompt..."
          className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />

        <button 
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-lg transition-all ${
            loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={handleSend} // Referência correta aqui
        >
          {loading ? "Processando..." : "Gerar Resposta"}
        </button>
      </div>

      {error && (
      <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-bold text-red-800">Ops! Algo deu errado:</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    )}

      {respostaIA && (
        <div className="mt-8 p-4 bg-slate-50 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Resposta da IA:</h3>
          <p className="text-slate-800 whitespace-pre-wrap">{respostaIA}</p>
        </div>
      )}
    </section>
  );
}

export default AITest;