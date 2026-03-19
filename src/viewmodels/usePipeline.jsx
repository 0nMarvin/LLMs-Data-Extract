import { useState, useCallback, useRef, useEffect } from "react";
import useFetch from "./useFetch";
import { useAiModels } from "./useAiModels";
import { useListParser } from "./useListParser";
import { PROMPT_FLOWS } from "../config/prompts";
import { parseAIResponse, formatarParaSnakeCase, gerarIdDeterministico } from "../helpers/listUtils";

const extractContent = (json) => json?.choices?.[0]?.message?.content ?? null;

// Formata lista para exibição — espelha returnList do useListParser
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

// Processa array bruto em lista formatada com IDs determinísticos
function processarArray(bruto, tema) {
  return bruto.map((item, index) => {
    const higienizado = {};
    Object.keys(item).forEach((chaveOriginal) => {
      const valor     = item[chaveOriginal];
      const chaveLimpa = formatarParaSnakeCase(chaveOriginal);
      if (chaveLimpa !== "id" && valor !== null && valor !== undefined && valor !== "") {
        higienizado[chaveLimpa] = valor;
      }
    });
    return { id: gerarIdDeterministico(tema, index), ...higienizado };
  });
}

export const usePipeline = () => {
  const { loading, error, request } = useFetch();
  const { activeModel, models, selectedModelId, setSelectedModelId } = useAiModels();
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

  // Ref sempre atualizado — para leitura síncrona de tema/atributos/filtros
  const generationDataRef = useRef(generationData);
  useEffect(() => { generationDataRef.current = generationData; }, [generationData]);

  const [pipelineError, setPipelineError] = useState(null);
  const [pipelineStep,  setPipelineStep]  = useState(null);

  // ─── Primitiva ────────────────────────────────────────────────────────────
  const rodarEtapa = useCallback(async (promptFlow, userMessage) => {
    if (!activeModel?.url) throw new Error("Configuração de modelo incompleta: URL ausente.");

    const { json, response } = await request(activeModel.url, {
      method:  "POST",
      headers: activeModel.headers,
      body:    JSON.stringify({
        model:    activeModel.id,
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
  }, [activeModel, request]);

  // ─── 1. Modelar ───────────────────────────────────────────────────────────
  const iniciarModelar = useCallback(async (temaInput) => {
    setPipelineError(null);
    try {
      setTema(temaInput);

      setPipelineStep("atributos");
      const resAtributos = await rodarEtapa(PROMPT_FLOWS.MODELAGEM_ATRIBUTOS, temaInput);
      const atributosParsed = parseAIResponse(resAtributos);
      modelarResposta(resAtributos, "atributos");

      setPipelineStep("filtros");
      const resFiltros = await rodarEtapa(PROMPT_FLOWS.MODELAGEM_FILTRO, temaInput);
      const filtrosParsed = parseAIResponse(resFiltros);
      modelarResposta(resFiltros, "filtros");

      setPipelineStep(null);
      // Retorna os valores diretamente — sem depender do estado React
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

  // ─── 2. Processar — retorna { json, list } diretamente ───────────────────
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

      // Persiste no estado para UI
      dadoResposta(resGeracao);

      setPipelineStep(null);
      return finalList; // retorna diretamente para o caller
    } catch (err) {
      setPipelineError(`Erro ao processar dados: ${err.message}`);
      setPipelineStep(null);
      console.error("[iniciarProcessar]", err);
      return null;
    }
  }, [rodarEtapa, dadoResposta]);

  // ─── 3. Validar — recebe finalList como param, retorna finalList validado ─
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
      console.log("[iniciarValidar] resposta bruta:", resValidacao?.slice(0, 300));

      const brutoValidado = parseAIResponse(resValidacao);

      // Array vazio = modelo filtrou tudo → usa lista gerada sem filtro
      if (Array.isArray(brutoValidado) && brutoValidado.length === 0) {
        console.warn("[iniciarValidar] Validação retornou array vazio — usando lista gerada diretamente.");
        setPipelineStep(null);
        return finalList;
      }

      // Parse falhou ou retornou null → usa lista gerada como fallback
      if (!brutoValidado || !Array.isArray(brutoValidado)) {
        console.warn("[iniciarValidar] Parse falhou — usando lista gerada diretamente. Raw:", resValidacao?.slice(0, 500));
        setPipelineStep(null);
        return finalList;
      }

      const listaValidada = processarArray(brutoValidado, tema);
      const finalListValidado = {
        json: JSON.stringify(listaValidada),
        list: formatarLista(listaValidada),
      };

      // Persiste no estado para UI
      dadoResposta(resValidacao);

      setPipelineStep(null);
      return finalListValidado;
    } catch (err) {
      // Erro inesperado → usa lista gerada como fallback em vez de falhar
      console.error("[iniciarValidar] Erro inesperado, usando fallback:", err);
      setPipelineStep(null);
      return finalList;
    }
  }, [rodarEtapa, dadoResposta]);

  // ─── Fluxo completo ───────────────────────────────────────────────────────
  const executarFluxoCompleto = useCallback(async (temaInput, quantidade = 10) => {
    const modelouOk = await iniciarModelar(temaInput);
    if (!modelouOk) return;

    const finalList = await iniciarProcessar(quantidade);
    if (!finalList) return;

    await iniciarValidar(finalList);
  }, [iniciarModelar, iniciarProcessar, iniciarValidar]);

  return {
    iniciarModelar,
    iniciarProcessar,
    iniciarValidar,
    executarFluxoCompleto,
    editarAtributos,
    editarFiltros,
    resetar,
    carregarLista,
    models,
    selectedModelId,
    setSelectedModelId,
    loading,
    pipelineStep,
    error:         pipelineError || error,
    generationData,
  };
};