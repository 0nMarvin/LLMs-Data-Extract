export const PROMPT_FLOWS = {
  MODELAGEM_TAGS: {
    system: `Você é um especialista em modelagem de dados. O usuário fornecerá um tema e você deve sugerir uma lista de 8 a 12 atributos (colunas) essenciais. 
    Regras: Retorne APENAS um array JSON de strings. O primeiro deve ser 'ID'. Use nomes claros e objetivos em Português Brasileiro.`,
    format: (tema) => `Tema: ${tema}`
  }
}