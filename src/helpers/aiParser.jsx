import * as z from "zod";
import { useState } from "react";

// Função auxiliar para transformar "Nome do Produto" em "nome_do_produto"
const formatarParaSnakeCase = (str) => {
  return str
    .toLowerCase()                  // Tudo em minúsculo
    .normalize("NFD")               // Decompõe caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remove os acentos
    .replace(/[^a-z0-9\s]/g, "")    // Remove caracteres especiais (pontos, vírgulas)
    .trim()                         // Remove espaços nas pontas
    .replace(/\s+/g, "_");          // Troca espaços internos por underscores
};

// Schema para validação do objeto de estado
export const listGeneratorSchema = z.object({
  tema: z.string(),
  // Aplicando a transformação nos atributos
  atributos: z.array(z.string())
    .min(2)
    .nullable()
    .transform((val) => {
      if (!val) return null;
      return val.map(attr => formatarParaSnakeCase(attr));
    }),
  filtros: z.array(z.string()).nullable(),
  finalList: z.object({
    json: z.string().min(1),
    list: z.string()
  }).nullable()
});

const ResponseSchema = z.string();

const [generationData, setGenerationData] = useState({
  tema: "",
  atributos: null,
  filtros: null,
  finalList: null
});

/**
 * Responsavel por definitr o tema no estado global.
 * @param {string} tema - A string que define o tema da busca.
 */
function setTema(tema) {
  setGenerationData((prev) => ({ ...prev, tema }));
}

/**
 * Responsavel por modelar a resposta da IA, em um JSON.
 * @param {string} response - A string bruta retornada pelo fetch.
 */

function parseAIResponse(response) {
  // Valida se a entrada é string antes de processar
  const validated = ResponseSchema.parse(response);
  const match = validated.match(/\[[\s\S]*\]/);

  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch (e) {
      console.error("Erro no parse do JSON:", e);
      return null;
    }
  }
  return null;
}

/**
 * Modela a resposta da IA, limpa os dados e valida o estado global com Zod.
 * @param {string} response - A string bruta retornada pelo fetch.
 * @param {'atributos' | 'filtros'} etapa - A chave do estado que estamos preenchendo.
 */

function modelarResposta(response, etapa) {
  try {
    const arrayBruto = parseAIResponse(response);

    if (!arrayBruto || !Array.isArray(arrayBruto)) {
      console.error(`Falha no formato da lista para: ${etapa}`);
      return;
    }

    // Limpeza de strings 
    const listaLimpa = arrayBruto.map(item => String(item).trim());

    const schemaEtapa = etapa === 'atributos' 
      ? listGeneratorSchema.shape.atributos 
      : listGeneratorSchema.shape.filtros;

    const validacao = schemaEtapa.safeParse(listaLimpa);

    if (validacao.success) {
      setGenerationData((prev) => ({
        ...prev,
        [etapa]: validacao.data 
      }));
    } else {
      console.error(`Erro de validação na lista de ${etapa}:`, validacao.error);
      setGenerationData(prev => ({ ...prev, [etapa]: null }));
    }
  } catch (error) {
    console.error("Erro crítico ao modelar resposta:", error);
    setGenerationData(prev => ({ ...prev, [etapa]: null }));
  }
}

/**
 * Transforma a lista JSON em uma string formatada para o front-end.
 * @param {Array} listaJson - O array de objetos gerado pela IA.
 * @returns {string}
 */
function returnList(listaJson) {
  if (!listaJson || listaJson.length === 0) return "Nenhum item gerado ainda.";

  const textoFormatado = listaJson.map((item, index) => {
    // Pegamos todas as chaves do objeto atual (ex: ["ID", "Nome", "Distância", ...])
    const chaves = Object.keys(item);

    // Criamos as linhas de detalhe para cada chave, ignorando a chave 'ID' no corpo se preferir
    const detalhes = chaves
      .map(chave => {
        // Formata a chave para capitalizar e remove o ID da lista de detalhes se ele já for o título
        if (chave.toLowerCase() === 'id') return null;
        return `   - ${chave}: ${item[chave]}`;
      })
      .filter(linha => linha !== null) // Remove o ID da lista interna
      .join('\n');

    // Tenta usar a primeira chave disponível como título do bloco
    const titulo = item[chaves[1]] || `Item ${index + 1}`;

    return `${index + 1}. 📌 ${titulo.toUpperCase()}\n${detalhes}`;
  }).join('\n\n');

  return `Aqui está o resultado da sua modelagem:\n\n${textoFormatado}`;
}

/**
 * Processa a resposta final da IA, valida o objeto completo e atualiza o estado.
 * @param {string} response - Resposta bruta do fetch (Part 3).
 * @returns {boolean} - Indica se a operação foi bem sucedida.
 */

function dadoResposta(response) {
  const listaJson = parseAIResponse(response);
  if (!listaJson || !Array.isArray(listaJson)) return false;

  setGenerationData(prev => {
    const novoEstado = {
      ...prev,
      finalList: {
        json: JSON.stringify(listaJson),
        list: returnList(listaJson) // nome correto
      }
    };

    const result = listGeneratorSchema.safeParse(novoEstado);
    return result.success ? novoEstado : { ...prev, finalList: null };
  });
}