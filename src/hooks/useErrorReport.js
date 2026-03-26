import { useState, useCallback } from "react";

/**
 * useErrorReport
 * Gerencia erros reportáveis com contexto completo para o modal de erro.
 *
 * @returns {{
 *   errorReport: { message, context, timestamp } | null,
 *   reportError: (message: string, context?: object) => void,
 *   clearError: () => void,
 * }}
 */
export const useErrorReport = () => {
  const [errorReport, setErrorReport] = useState(null);

  const reportError = useCallback((message, context = {}) => {
    const report = {
      message,
      context,
      timestamp: new Date().toISOString(),
    };
    console.error("[ulIA Error Report]", report);
    setErrorReport(report);
  }, []);

  const clearError = useCallback(() => setErrorReport(null), []);

  return { errorReport, reportError, clearError };
};

export default useErrorReport;