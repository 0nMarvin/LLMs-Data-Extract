import { env } from "./helpers/envVerify";

export function POST_PROMPT(body, modelId) {
  return {
    url: env.VITE_OPENROUTER_URL, 
    options: {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.VITE_OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': `${env.VITE_URL}`, 
        'X-Title': 'Mediador de Dados AI' 
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { 
            role: "user", 
            content: body 
          }
        ],
        temperature: 0,
      }),
    },
  };
}