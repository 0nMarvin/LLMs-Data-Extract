import { useState, useCallback } from "react";
import useFetch from "./useFetch";
import { useAiModels } from "./useAiModels";
import { useListParser } from "./useListParser";
import { PROMPT_FLOWS } from "../config/prompts";

// Extrai o texto da resposta da API — adapte ao formato da sua API
const extractContent = (json) => {
  return json?.choices?.[0]?.message?.content ?? null;
};

export const usePipeline = () => {
  const { loading, error, request } = useFetch();
  const { activeModel, models, selectedModelId, setSelectedModelId } = useAiModels();
  const {
    setTema,
    modelarResposta,
    dadoResposta,
    setAtributos: editarAtributos,
    setFiltros: editarFiltros,
    generationData,
  } = useListParser();

  const [pipelineError, setPipelineError] = useState(null);
  const [pipelineStep, setPipelineStep] = useState(null);

  // ─── Primitiva: executa uma etapa do pipeline ──────────────────────────────
  const rodarEtapa = useCallback(
    async (promptFlow, userMessage) => {
      if (!activeModel?.url) {
        throw new Error("Configuração de modelo incompleta: URL ausente.");
      }

      const { json, response } = await request(activeModel.url, {
        method: "POST",
        headers: activeModel.headers,
        body: JSON.stringify({
          model: activeModel.id,
          messages: [
            { role: "system", content: promptFlow.system },
            { role: "user", content: userMessage },
          ],
        }),
      });

      if (!response?.ok || !json) {
        throw new Error(`Falha na etapa. Status: ${response?.status ?? "sem resposta"}`);
      }

      const content = extractContent(json);

      if (!content) {
        throw new Error("Resposta da API veio vazia ou em formato inesperado.");
      }

      return content;
    },
    [activeModel, request]
  );

  // ─── 1. Modelar: gera atributos + filtros → pipeline PAUSA aqui ────────────
  const iniciarModelar = useCallback(
    async (temaInput) => {
      setPipelineError(null);

      try {
        setTema(temaInput);

        setPipelineStep("atributos");
        const resAtributos = await rodarEtapa(PROMPT_FLOWS.MODELAGEM_ATRIBUTOS, temaInput);
        modelarResposta(resAtributos, "atributos");

        setPipelineStep("filtros");
        const resFiltros = await rodarEtapa(PROMPT_FLOWS.MODELAGEM_FILTRO, temaInput);
        modelarResposta(resFiltros, "filtros");

        setPipelineStep(null);
        return true;
      } catch (err) {
        setPipelineError(`Erro ao modelar: ${err.message}`);
        setPipelineStep(null);
        console.error("[iniciarModelar]", err);
        return false;
      }
    },
    [rodarEtapa, setTema, modelarResposta]
  );

  // ─── 2. Processar: gera dados com base nos atributos+filtros (pós-curadoria)
  const iniciarProcessar = useCallback(
    async (quantidade = 10) => {
      setPipelineError(null);

      const { tema, atributos, filtros } = generationData;

      if (!tema || !atributos || !filtros) {
        setPipelineError("Execute a modelagem antes de processar.");
        return false;
      }

      try {
        setPipelineStep("geracao");

        const userMessage = PROMPT_FLOWS.DADOS_GERACAO.format(
          tema,
          atributos.join(", "),
          filtros.join(", "),
          quantidade
        );

        const resGeracao = await rodarEtapa(PROMPT_FLOWS.DADOS_GERACAO, userMessage);
        const sucesso = dadoResposta(resGeracao);

        if (!sucesso) {
          throw new Error("O parser não conseguiu interpretar os dados gerados.");
        }

        setPipelineStep(null);
        return true;
      } catch (err) {
        setPipelineError(`Erro ao processar dados: ${err.message}`);
        setPipelineStep(null);
        console.error("[iniciarProcessar]", err);
        return false;
      }
    },
    [rodarEtapa, dadoResposta, generationData]
  );

  // ─── 3. Validar: filtra e higieniza os dados gerados ──────────────────────
  const iniciarValidar = useCallback(async () => {
    setPipelineError(null);

    const { tema, filtros, finalList } = generationData;

    if (!finalList?.json) {
      setPipelineError("Nenhum dado gerado para validar.");
      return false;
    }

    try {
      setPipelineStep("validacao");

      const userMessage = PROMPT_FLOWS.DADOS_FILTROS.format(
        finalList.json,
        tema,
        filtros?.join(", ") ?? ""
      );

      const resValidacao = await rodarEtapa(PROMPT_FLOWS.DADOS_FILTROS, userMessage);
      const sucesso = dadoResposta(resValidacao);

      if (!sucesso) {
        throw new Error("Validação não retornou dados utilizáveis.");
      }

      setPipelineStep(null);
      return true;
    } catch (err) {
      setPipelineError(`Erro ao validar dados: ${err.message}`);
      setPipelineStep(null);
      console.error("[iniciarValidar]", err);
      return false;
    }
  }, [rodarEtapa, dadoResposta, generationData]);

  // ─── Fluxo completo (sem pausa para curadoria) ─────────────────────────────
  const executarFluxoCompleto = useCallback(
    async (temaInput, quantidade = 10) => {
      const modelouOk = await iniciarModelar(temaInput);
      if (!modelouOk) return;

      const processouOk = await iniciarProcessar(quantidade);
      if (!processouOk) return;

      await iniciarValidar();
    },
    [iniciarModelar, iniciarProcessar, iniciarValidar]
  );

  return {
    // Ações do pipeline
    iniciarModelar,
    iniciarProcessar,
    iniciarValidar,
    executarFluxoCompleto,

    // Curadoria humana
    editarAtributos,
    editarFiltros,

    // Seleção de modelo
    models,
    selectedModelId,
    setSelectedModelId,

    // Estado exposto ao front-end
    loading,
    pipelineStep,
    error: pipelineError || error,
    generationData,
  };
};