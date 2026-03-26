import { useState, useCallback, useRef, useEffect } from "react";
import useFetch from "./useFetch";
import { useListParser } from "./useListParser";
import { PROMPT_FLOWS } from "../config/prompts";

const extractContent = (json) => json?.choices?.[0]?.message?.content ?? null;

/**
 * usePipeline
 * @param {{ id, url, headers }} activeModel — recebido do App (fonte única de verdade)
 *
 * Não importa listUtils diretamente — usa as funções utilitárias
 * expostas pelo useListParser para manter a responsabilidade centralizada.
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
    parsear,
    processarArray,
    formatarLista,
    generationData,
  } = useListParser();

  const generationDataRef = useRef(generationData);
  useEffect(() => { generationDataRef.current = generationData; }, [generationData]);

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
  }, [request]);

  // ─── 1. Modelar — atributos e filtros em paralelo ─────────────────────────
  const iniciarModelar = useCallback(async (temaInput) => {
    setPipelineError(null);
    try {
      setTema(temaInput);
      setPipelineStep("modelagem");

      const [resAtributos, resFiltros] = await Promise.all([
        rodarEtapa(PROMPT_FLOWS.MODELAGEM_ATRIBUTOS, temaInput),
        rodarEtapa(PROMPT_FLOWS.MODELAGEM_FILTRO,    temaInput),
      ]);

      const atributosParsed = parsear(resAtributos);
      const filtrosParsed   = parsear(resFiltros);

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
  }, [rodarEtapa, setTema, modelarResposta, parsear]);

// ─── 2. Processar (Versão Robustecida com Lotes e Anti-Repetição) ───────────
  const iniciarProcessar = useCallback(async (quantidadeTotal = 10) => {
    setPipelineError(null);

    const { tema, atributos, filtros } = generationDataRef.current;
    if (!tema || !atributos || !filtros) {
      setPipelineError("Execute a modelagem antes de processar.");
      return null;
    }

    try {
      setPipelineStep("geracao");
      
      const TAMANHO_LOTE = 20; // Tamanho ideal para evitar "preguiça" da IA
      const numLotes = Math.ceil(quantidadeTotal / TAMANHO_LOTE);
      let listaAcumuladaRaw = [];
      let nomesJaGerados = []; // Para evitar repetição baseada no nome/ID

      for (let i = 0; i < numLotes; i++) {
        const qtdDesteLote = Math.min(TAMANHO_LOTE, quantidadeTotal - listaAcumuladaRaw.length);
        if (qtdDesteLote <= 0) break;

        // Criamos uma instrução extra de exclusão para o lote atual
        const instrucaoAntiRepeticao = nomesJaGerados.length > 0 
          ? `\nPROIBIDO GERAR OS SEGUINTES ITENS (JÁ EXISTENTES): ${nomesJaGerados.join(", ")}.`
          : "";

        const userMessage = PROMPT_FLOWS.DADOS_GERACAO.format(
          tema, 
          atributos.join(", "), 
          filtros.join(", "), 
          qtdDesteLote
        ) + instrucaoAntiRepeticao;

        const resGeracao = await rodarEtapa(PROMPT_FLOWS.DADOS_GERACAO, userMessage);
        const bruto = parsear(resGeracao);

        if (bruto && Array.isArray(bruto)) {
          // Adicionamos os novos itens e atualizamos a lista de nomes proibidos
          listaAcumuladaRaw = [...listaAcumuladaRaw, ...bruto];
          
          // Mapeamos a primeira coluna (geralmente Nome ou ID) para evitar duplicatas no próximo lote
          const novosNomes = bruto.map(item => Object.values(item)[0]); 
          nomesJaGerados = [...nomesJaGerados, ...novosNomes];
        }
      }

      if (listaAcumuladaRaw.length === 0)
        throw new Error("O parser não conseguiu interpretar os dados gerados.");

      const listaFormatada = processarArray(listaAcumuladaRaw, tema);
      const finalList = {
        json: JSON.stringify(listaFormatada),
        list: formatarLista(listaFormatada),
      };

      dadoResposta(JSON.stringify(listaAcumuladaRaw)); // Salva o histórico bruto consolidado
      setPipelineStep(null);
      return finalList;
    } catch (err) {
      setPipelineError(`Erro ao processar dados: ${err.message}`);
      setPipelineStep(null);
      console.error("[iniciarProcessar]", err);
      return null;
    }
  }, [rodarEtapa, parsear, processarArray, formatarLista, dadoResposta]);

// ─── 3. Validar (Versão Robustecida para Grandes Volumes) ──────────────────
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

      // 1. Converte o JSON gigante em um array real para fatiar
      const dadosCompletos = JSON.parse(finalList.json);
      const TAMANHO_LOTE_VALIDACAO = 20; // Fatia para não sobrecarregar o analista (IA)
      let dadosHigieneTotal = [];

      // 2. Loop de fatiamento
      for (let i = 0; i < dadosCompletos.length; i += TAMANHO_LOTE_VALIDACAO) {
        const fatia = dadosCompletos.slice(i, i + TAMANHO_LOTE_VALIDACAO);
        const jsonFatia = JSON.stringify(fatia);

        const userMessage = PROMPT_FLOWS.DADOS_FILTROS.format(
          jsonFatia, 
          tema, 
          filtros?.join(", ") ?? ""
        );

        // Chamada para validar apenas esta fatia
        const resValidacao = await rodarEtapa(PROMPT_FLOWS.DADOS_FILTROS, userMessage);
        const brutoValidado = parsear(resValidacao);

        if (brutoValidado && Array.isArray(brutoValidado)) {
          dadosHigieneTotal = [...dadosHigieneTotal, ...brutoValidado];
        } else {
          // Se uma fatia falhar bizarramente, mantemos a original para não perder dados
          console.warn(`[Lote ${i}] Falha na validação, mantendo dados originais da fatia.`);
          dadosHigieneTotal = [...dadosHigieneTotal, ...fatia];
        }
      }

      // 3. Reconstrói o objeto final com tudo o que passou no filtro
      const listaValidada = processarArray(dadosHigieneTotal, tema);
      const finalListValidado = {
        json: JSON.stringify(listaValidada),
        list: formatarLista(listaValidada),
      };

      dadoResposta(JSON.stringify(dadosHigieneTotal));
      setPipelineStep(null);
      return finalListValidado;

    } catch (err) {
      console.error("[iniciarValidar] Erro crítico, usando fallback:", err);
      setPipelineStep(null);
      return finalList; // Em caso de erro catastrófico, retorna a lista sem validar
    }
  }, [rodarEtapa, parsear, processarArray, formatarLista, dadoResposta]);

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