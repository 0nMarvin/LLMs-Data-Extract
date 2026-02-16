export const API_URL = import.meta.env.VITE_OPENROUTER_URL;

export function POST_PROMPT(body, modelId) {
  return {
    url: API_URL,
    options: {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        // Opcional
        'HTTP-Referer': 'http://localhost:5173', 
        'X-Title': 'Meu App Dev' 
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { 
            role: "user", 
            content: body 
          }
        ],
      }),
    },
  };
}