/**
 * Transforma strings em snake_case removendo acentos e caracteres especiais.
 */
export const formatarParaSnakeCase = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "_");
};

/**
 * Gera um ID determinístico baseado no tema e no índice do item.
 */
export const gerarIdDeterministico = (tema, index) => {
  const stopWords = ['de', 'da', 'do', 'dos', 'das', 'a', 'o', 'e', 'os', 'as', 'com', 'para', 'em'];
  const palavras = tema
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")     
    .split(/\s+/)
    .filter(p => p.length > 1 && !stopWords.includes(p));

  let prefixo = palavras.length === 0 ? "GEN" : 
                palavras.length === 1 ? palavras[0].substring(0, 4).toUpperCase() :
                palavras.slice(0, 2).map(p => p.substring(0, 3).toUpperCase()).join("");

  return `${prefixo}-${String(index + 1).padStart(3, '0')}`;
};

/**
 * Extrai o array JSON de uma resposta de texto da IA.
 */
export const parseAIResponse = (response) => {
  if (!response || typeof response !== 'string') return null;

  try {
    const semThink = response.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    const match = semThink.match(/\[[\s\S]*\]/);
    if (!match) return null;

    let jsonString = match[0]
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") 
      .trim();

    return JSON.parse(jsonString);
  } catch (e) {
    console.error("Erro no Parse. Texto bruto:", response);
    return null;
  }
};