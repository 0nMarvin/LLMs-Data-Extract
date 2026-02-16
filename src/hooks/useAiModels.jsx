import { useState, useMemo } from 'react';
import { AI_MODELS, DEFAULT_MODEL_ID } from '../config/models';

export const useAiModels = () => {
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL_ID);

  const activeModel = useMemo(() => {
    return AI_MODELS.find(model => model.id === selectedModelId) || AI_MODELS[0];
  }, [selectedModelId]);

  return {
    models: AI_MODELS,
    selectedModelId,
    setSelectedModelId,
    activeModel,
  };
};

export default useAiModels;