import { useState, useCallback, useRef, useEffect } from "react";
import useFetch from "./useFetch";
import { useListParser } from "./useListParser";
import { PROMPT_FLOWS } from "../config/prompts";
import { parseAIResponse, formatarParaSnakeCase, gerarIdDeterministico } from "../helpers/listUtils";

const extractContent = (json) => json?.choices?.[0]?.message?.content ?? null;

function formatarLista(listaJson) {
  if (!listaJson?.length) return "Nenhum item gerado ainda.";
  const texto = listaJson.map((item, index) => {
    const chaves   = Object.keys(item);
    const detalhes = chaves
      .map((k) => (k.toLowerCase() === "id" ? null : `   - ${k}: ${item[k]}`))
      .filter(Boolean)
      .join("\n");
    const titulo = item[chaves[1]] || `Item ${index + 1}`;
    return `${index + 1}. 📌 ${titulo.toUpperCase()}\n${detalhes}`;
  }).join("\n\n");
  return `Aqui está o resultado da sua modelagem:\n\n${texto}`;
}

function processarArray(bruto, tema) {
  return bruto.map((item, index) => {
    const higienizado = {};
    Object.keys(item).forEach((chaveOriginal) => {
      const valor      = item[chaveOriginal];
      const chaveLimpa = formatarParaSnakeCase(chaveOriginal);
      if (chaveLimpa !== "id" && valor !== null && valor !== undefined && valor !== "") {
        higienizado[chaveLimpa] = valor;
      }
    });
    return { id: gerarIdDeterministico(tema, index), ...higienizado };
  });
}

/**
 * usePipeline
 * @param {{ id, url, headers }} activeModel — recebido do App (fonte única de verdade)
 */
export const usePipeline = (activeModel) => {
  const { loading, error, request } = useFetch();
  const {
    setTema,
    modelarResposta,
    dadoResposta,
    setAtributos: editarAtributos,
    setFiltros:   editarFiltros,
    resetar,
    carregarLista,
    generationData,
  } = useListParser();

  const generationDataRef = useRef(generationData);
  useEffect(() => { generationDataRef.current = generationData; }, [generationData]);

  // Ref para activeModel — evita stale closure sem re-criar rodarEtapa a cada render
  const activeModelRef = useRef(activeModel);
  useEffect(() => { activeModelRef.current = activeModel; }, [activeModel]);

  const [pipelineError, setPipelineError] = useState(null);
  const [pipelineStep,  setPipelineStep]  = useState(null);

  // ─── Primitiva ────────────────────────────────────────────────────────────
  const rodarEtapa = useCallback(async (promptFlow, userMessage) => {
    const model = activeModelRef.current;
    if (!model?.url) throw new Error("Configuração de modelo incompleta: URL ausente.");

    const { json, response } = await request(model.url, {
      method:  "POST",
      headers: model.headers,
      body:    JSON.stringify({
        model:    model.id,
        messages: [
          { role: "system", content: promptFlow.system },
          { role: "user",   content: userMessage },
        ],
      }),
    });

    if (!response?.ok || !json)
      throw new Error(`Falha na etapa. Status: ${response?.status ?? "sem resposta"}`);

    const content = extractContent(json);
    if (!content) throw new Error("Resposta da API veio vazia ou em formato inesperado.");
    return content;
  }, [request]); // activeModel lido via ref — não precisa de dep

  // ─── 1. Modelar — atributos e filtros em paralelo ─────────────────────────
  const iniciarModelar = useCallback(async (temaInput) => {
    setPipelineError(null);
    try {
      setTema(temaInput);
      setPipelineStep("modelagem");

      // Dispara as duas requisições ao mesmo tempo
      const [resAtributos, resFiltros] = await Promise.all([
        rodarEtapa(PROMPT_FLOWS.MODELAGEM_ATRIBUTOS, temaInput),
        rodarEtapa(PROMPT_FLOWS.MODELAGEM_FILTRO,    temaInput),
      ]);

      const atributosParsed = parseAIResponse(resAtributos);
      const filtrosParsed   = parseAIResponse(resFiltros);

      modelarResposta(resAtributos, "atributos");
      modelarResposta(resFiltros,   "filtros");

      setPipelineStep(null);
      return {
        atributos: Array.isArray(atributosParsed) ? atributosParsed.map(String) : [],
        filtros:   Array.isArray(filtrosParsed)   ? filtrosParsed.map(String)   : [],
      };
    } catch (err) {
      setPipelineError(`Erro ao modelar: ${err.message}`);
      setPipelineStep(null);
      console.error("[iniciarModelar]", err);
      return null;
    }
  }, [rodarEtapa, setTema, modelarResposta]);

  // ─── 2. Processar ─────────────────────────────────────────────────────────
  const iniciarProcessar = useCallback(async (quantidade = 10) => {
    setPipelineError(null);

    const { tema, atributos, filtros } = generationDataRef.current;
    if (!tema || !atributos || !filtros) {
      setPipelineError("Execute a modelagem antes de processar.");
      return null;
    }

    try {
      setPipelineStep("geracao");

      const userMessage = PROMPT_FLOWS.DADOS_GERACAO.format(
        tema, atributos.join(", "), filtros.join(", "), quantidade
      );

      const resGeracao = await rodarEtapa(PROMPT_FLOWS.DADOS_GERACAO, userMessage);

      const bruto = parseAIResponse(resGeracao);
      if (!bruto || !Array.isArray(bruto) || bruto.length === 0)
        throw new Error("O parser não conseguiu interpretar os dados gerados.");

      const listaFormatada = processarArray(bruto, tema);
      const finalList = {
        json: JSON.stringify(listaFormatada),
        list: formatarLista(listaFormatada),
      };

      dadoResposta(resGeracao);
      setPipelineStep(null);
      return finalList;
    } catch (err) {
      setPipelineError(`Erro ao processar dados: ${err.message}`);
      setPipelineStep(null);
      console.error("[iniciarProcessar]", err);
      return null;
    }
  }, [rodarEtapa, dadoResposta]);

  // ─── 3. Validar — opcional, usa finalList como fallback em caso de falha ──
  const iniciarValidar = useCallback(async (finalListParam) => {
    setPipelineError(null);

    const { tema, filtros } = generationDataRef.current;
    const finalList = finalListParam ?? generationDataRef.current.finalList;

    if (!finalList?.json) {
      setPipelineError("Nenhum dado gerado para validar.");
      return null;
    }

    try {
      setPipelineStep("validacao");

      const userMessage = PROMPT_FLOWS.DADOS_FILTROS.format(
        finalList.json, tema, filtros?.join(", ") ?? ""
      );

      const resValidacao = await rodarEtapa(PROMPT_FLOWS.DADOS_FILTROS, userMessage);

      const brutoValidado = parseAIResponse(resValidacao);

      // Qualquer falha no parse → usa lista gerada diretamente (sem travar)
      if (!brutoValidado || !Array.isArray(brutoValidado) || brutoValidado.length === 0) {
        console.warn("[iniciarValidar] Fallback para lista gerada.", resValidacao?.slice(0, 200));
        setPipelineStep(null);
        return finalList;
      }

      const listaValidada = processarArray(brutoValidado, tema);
      const finalListValidado = {
        json: JSON.stringify(listaValidada),
        list: formatarLista(listaValidada),
      };

      dadoResposta(resValidacao);
      setPipelineStep(null);
      return finalListValidado;
    } catch (err) {
      console.error("[iniciarValidar] Fallback:", err);
      setPipelineStep(null);
      return finalList; // nunca bloqueia
    }
  }, [rodarEtapa, dadoResposta]);

  return {
    iniciarModelar,
    iniciarProcessar,
    iniciarValidar,
    editarAtributos,
    editarFiltros,
    resetar,
    carregarLista,
    loading,
    pipelineStep,
    error:         pipelineError || error,
    generationData,
  };
};