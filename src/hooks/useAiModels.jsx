import { useState, useMemo } from 'react';
import AI_MODELS_DATA from '../config/ai-models.json'; // Certifique-se de que o caminho está correto

export const useAiModels = () => {
  const [selectedModelId, setSelectedModelId] = useState(AI_MODELS_DATA[0].id);

  const activeModel = useMemo(() => {
    const model = AI_MODELS_DATA.find(m => m.id === selectedModelId) || AI_MODELS_DATA[0];
    
    return {
      ...model,
      headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_KEY}`, 
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin, // Opcional para OpenRouter
      }
    };
  }, [selectedModelId]);

  return {
    models: AI_MODELS_DATA,
    selectedModelId,
    setSelectedModelId,
    activeModel,
  };
};

export default useAiModels;