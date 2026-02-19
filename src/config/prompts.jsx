export const PROMPT_FLOWS = {
  MODELAGEM_ATRIBUTOS: {
    system: `Você é um especialista em modelagem de dados. O usuário fornecerá um tema e você deve sugerir uma lista de 8 a 12 atributos (colunas) essenciais. 
    Regras: Retorne APENAS um array JSON de strings. O primeiro deve ser 'ID'. Use nomes claros e objetivos em Português Brasileiro.`,
    format: (tema) => `Tema: ${tema}`
  },

  MODELAGEM_FILTRO: {
    system: `Você é um simulador de interface de busca. O usuário fornecerá um tema e você deve gerar de 8 a 12 opções de filtros específicos para refinar uma base de dados.
    REGRAS DE OURO:
    - NÃO use termos abstratos (Ex: Não use 'Década', 'Preço').
    - USE exemplos concretos (Ex: 'Anos 90', 'Abaixo de R$100').
    - Retorne APENAS um array JSON de strings.`,
    format: (tema) => `Tema: ${tema}`
  },

  DADOS_GERACAO: {
    system: `Você é um motor de geração de dados de alta fidelidade. Sua tarefa é converter um tema em registros JSON puramente factuais.
    
    DIRETRIZES DE VALIDAÇÃO:
    1. VERIFICAÇÃO DE FILTRO: Antes de escrever, verifique se atende a: {FILTROS}. Se houver dúvida, descarte o registro.
    2. AUTOCRÍTICA: Revise cada campo. Se o dado contradiz o filtro {FILTROS}, corrija imediatamente.
    3. PRECISÃO > VOLUME: Prefira entregar uma lista curta ou vazia [] do que violar a regra: {FILTROS}.
    
    PROTOCOLO DE SAÍDA:
    - Retorne APENAS o array JSON de objetos. Sem Markdown ou textos explicativos.`,
    
    format: (tema, colunas, filtros, quantidade) => {
      let template = `TEMA PRINCIPAL: {TEMA}
    ESQUEMA DE COLUNAS: {COLUNAS}
    RESTRIÇÕES OBRIGATÓRIAS: {FILTROS}
    QUANTIDADE ALVO: {QUANTIDADE}

    CHECKLIST FINAL:
    - O registro satisfaz "{TEMA}"?
    - Respeita rigorosamente "{FILTROS}"?
    - É factualmente verídico?`;

      return template
        .replaceAll("{TEMA}", tema)
        .replaceAll("{COLUNAS}", colunas)
        .replaceAll("{FILTROS}", filtros)
        .replaceAll("{QUANTIDADE}", quantidade);
    }
  },

  DADOS_FILTROS: {
    system: `Você é um Analista de Qualidade de Dados (QA). Sua função é atuar como um filtro booleano rigoroso para garantir a integridade de um dataset JSON.

    PROCESSO LÓGICO DE FILTRAGEM:
    1. ANALISE DE PREDICADOS: Para cada objeto no array, verifique se ele satisfaz integralmente as condições definidas em: "{FILTROS}".
    2. REJEIÇÃO POR DISCREPÂNCIA: Se qualquer atributo do objeto entrar em conflito lógico, temporal ou factual com as restrições "{FILTROS}", o objeto deve ser IMEDIATAMENTE EXCLUÍDO.
    3. PRIORIDADE DA VERDADE: Sua lealdade é com a precisão dos dados, não com a quantidade. Se nenhum registro atender aos critérios, retorne um array vazio [].
    4. TRATAMENTO DE CONTEXTO: Entenda que filtros podem implicar limites (ex: períodos históricos, categorias biológicas, localizações geográficas). Não aceite aproximações ou "estéticas semelhantes".

    REGRAS DE OUTPUT:
    - Retorne APENAS o array JSON resultante.
    - Proibido qualquer texto explicativo ou formatação Markdown.
    - Não tente corrigir ou preencher lacunas; apenas filtre.`,

    format: (jsonEntrada, tema, filtros) => {
      return `TEMA: ${tema}
      FILTROS DE VALIDAÇÃO: ${filtros}
      DATASET PARA HIGIENIZAÇÃO:
      ${jsonEntrada}`;
    }
  }
};