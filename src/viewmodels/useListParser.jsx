import { useState } from "react";
import { listGeneratorSchema, initialGenerationState } from "../models/listItem.model";
import {
  formatarParaSnakeCase,
  gerarIdDeterministico,
  parseAIResponse,
} from "../helpers/listUtils";

export function useListParser() {
  const [generationData, setGenerationData] = useState(initialGenerationState);

  // ─── Setters básicos ──────────────────────────────────────────────────────

  function setTema(tema) {
    setGenerationData((prev) => ({ ...prev, tema }));
  }

  function setAtributos(novosAtributos) {
    const validacao = listGeneratorSchema.shape.atributos.safeParse(novosAtributos);
    if (validacao.success) {
      setGenerationData((prev) => ({ ...prev, atributos: validacao.data }));
      return true;
    }
    return false;
  }

  function setFiltros(novosFiltros) {
    const validacao = listGeneratorSchema.shape.filtros.safeParse(novosFiltros);
    if (validacao.success) {
      setGenerationData((prev) => ({ ...prev, filtros: validacao.data }));
      return true;
    }
    return false;
  }

  /**
   * Reseta o estado para o inicial.
   * Chamado ao iniciar uma nova lista do zero.
   */
  function resetar() {
    setGenerationData(initialGenerationState);
  }

  /**
   * Carrega uma lista salva completa no estado do pipeline de uma só vez.
   * Evita inconsistências ao trocar entre listas salvas.
   * @param {{ tema, atributos, filtros, finalList }} lista
   */
  function carregarLista(lista) {
    setGenerationData({
      tema:      lista.tema      ?? "",
      atributos: lista.atributos ?? null,
      filtros:   lista.filtros   ?? null,
      finalList: lista.finalList ?? null,
    });
  }

  // ─── Parsers de resposta da API ───────────────────────────────────────────

  function modelarResposta(response, etapa) {
    try {
      const arrayBruto = parseAIResponse(response);
      if (!arrayBruto || !Array.isArray(arrayBruto)) return;

      const listaLimpa = arrayBruto.map((item) => String(item).trim());

      const schemaEtapa =
        etapa === "atributos"
          ? listGeneratorSchema.shape.atributos
          : listGeneratorSchema.shape.filtros;

      const validacao = schemaEtapa.safeParse(listaLimpa);

      setGenerationData((prev) => ({
        ...prev,
        [etapa]: validacao.success ? validacao.data : null,
      }));
    } catch {
      setGenerationData((prev) => ({ ...prev, [etapa]: null }));
    }
  }

  function returnList(listaJson) {
    if (!listaJson || listaJson.length === 0) return "Nenhum item gerado ainda.";

    const textoFormatado = listaJson
      .map((item, index) => {
        const chaves = Object.keys(item);
        const detalhes = chaves
          .map((chave) => {
            if (chave.toLowerCase() === "id") return null;
            return `   - ${chave}: ${item[chave]}`;
          })
          .filter(Boolean)
          .join("\n");

        const titulo = item[chaves[1]] || `Item ${index + 1}`;
        return `${index + 1}. 📌 ${titulo.toUpperCase()}\n${detalhes}`;
      })
      .join("\n\n");

    return `Aqui está o resultado da sua modelagem:\n\n${textoFormatado}`;
  }

  function dadoResposta(response) {
    const listaBruta = parseAIResponse(response);
    if (!listaBruta || !Array.isArray(listaBruta)) return false;

    setGenerationData((prev) => {
      const listaFormatada = listaBruta.map((item, index) => {
        const itemHigienizado = {};

        Object.keys(item).forEach((chaveOriginal) => {
          const valor = item[chaveOriginal];
          const chaveLimpa = formatarParaSnakeCase(chaveOriginal);

          if (chaveLimpa !== "id" && valor !== null && valor !== undefined && valor !== "") {
            itemHigienizado[chaveLimpa] = valor;
          }
        });

        return {
          id: gerarIdDeterministico(prev.tema || "LISTA", index),
          ...itemHigienizado,
        };
      });

      const novoFinalList = {
        json: JSON.stringify(listaFormatada),
        list: returnList(listaFormatada),
      };

      const estadoParaValidar = { ...prev, finalList: novoFinalList };
      const result = listGeneratorSchema.safeParse(estadoParaValidar);

      if (result.success) return estadoParaValidar;

      console.error("Erro na validação do estado final:", result.error);
      return prev;
    });

    return true;
  }

  return {
    generationData,
    setTema,
    setAtributos,
    setFiltros,
    resetar,
    carregarLista,
    modelarResposta,
    dadoResposta,
  };
}