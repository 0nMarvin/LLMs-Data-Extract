import { useState, useCallback } from "react";

// ─── Cookie helpers ────────────────────────────────────────────────────────────

const COOKIE_EXPIRY_DAYS = 30;

function setCookie(name, value, days = COOKIE_EXPIRY_DAYS) {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

// ─── LocalStorage helpers ──────────────────────────────────────────────────────

function lsGet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("[useStorage] localStorage cheio ou indisponível:", e);
  }
}

// ─── Chaves ───────────────────────────────────────────────────────────────────

const KEYS = {
  MODELO: "ulia_modelo",
  TEMA:   "ulia_tema",
  LISTAS: "ulia_listas",
};

const MAX_LISTAS = 50;

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useStorage
 * - Cookies: modelo selecionado + último tema (expiram em 30 dias)
 * - localStorage: histórico de listas geradas (até 50 entradas)
 */
export const useStorage = () => {
  const [savedModelId, setSavedModelId] = useState(() => getCookie(KEYS.MODELO));
  const [savedTema,    setSavedTema]    = useState(() => getCookie(KEYS.TEMA));
  const [listas,       setListas]       = useState(() => lsGet(KEYS.LISTAS) ?? []);

  const saveModelId = useCallback((id) => {
    setCookie(KEYS.MODELO, id);
    setSavedModelId(id);
  }, []);

  const saveTema = useCallback((tema) => {
    setCookie(KEYS.TEMA, tema);
    setSavedTema(tema);
  }, []);

  /**
   * Cria uma nova entrada no histórico.
   * @param {{ tema, atributos, filtros, finalList, modelId, modelName }} entrada
   */
  const salvarLista = useCallback((entrada) => {
    setListas((prev) => {
      const nova = {
        id:        crypto.randomUUID(),
        criadoEm:  new Date().toISOString(),
        tema:      entrada.tema,
        modelId:   entrada.modelId,
        modelName: entrada.modelName,
        atributos: entrada.atributos,
        filtros:   entrada.filtros,
        finalList: entrada.finalList,
      };
      const atualizado = [nova, ...prev].slice(0, MAX_LISTAS);
      lsSet(KEYS.LISTAS, atualizado);
      return atualizado;
    });
  }, []);

  /**
   * Atualiza campos da entrada mais recente (index 0) sem criar uma nova.
   * Usado para persistir edições de atributos/filtros em tempo real.
   * @param {Partial<{ atributos, filtros, finalList }>} patch
   */
  const atualizarPrimeira = useCallback((patch) => {
    setListas((prev) => {
      if (prev.length === 0) return prev;
      const atualizado = [...prev];
      atualizado[0] = { ...atualizado[0], ...patch };
      lsSet(KEYS.LISTAS, atualizado);
      return atualizado;
    });
  }, []);

  const removerLista = useCallback((id) => {
    setListas((prev) => {
      const atualizado = prev.filter((l) => l.id !== id);
      lsSet(KEYS.LISTAS, atualizado);
      return atualizado;
    });
  }, []);

  const limparListas = useCallback(() => {
    localStorage.removeItem(KEYS.LISTAS);
    setListas([]);
  }, []);

  return {
    savedModelId,    saveModelId,
    savedTema,       saveTema,
    listas,          salvarLista, atualizarPrimeira, removerLista, limparListas,
  };
};

export default useStorage;