import { useState, useMemo } from "react";
import { AI_MODELS, DEFAULT_MODEL_ID } from "../models/llms.models";

export const useAiModels = () => {
  const [selectedModelId, setSelectedModelId] = useState(DEFAULT_MODEL_ID);

  const activeModel = useMemo(() => {
    const model =
      AI_MODELS.find((m) => m.id === selectedModelId) || AI_MODELS[0];

    return {
      ...model,
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
      },
    };
  }, [selectedModelId]);

  return {
    models: AI_MODELS,
    selectedModelId,
    setSelectedModelId,
    activeModel,
  };
};

export default useAiModels;