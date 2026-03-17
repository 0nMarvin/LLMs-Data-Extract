import { useState } from 'react';

export const useTags = (initialState = []) => {
  const [tags, setTags] = useState(initialState);

  const addTag = (label) => {
    if (!label) return;
    setTags((prev) => (prev.includes(label) ? prev : [...prev, label]));
  };

  const removeTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => setTags([]);

  return {
    tags,
    addTag,
    removeTag,
    clearAll
  };
};