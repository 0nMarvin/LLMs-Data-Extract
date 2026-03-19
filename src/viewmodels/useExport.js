import { useCallback, useRef, useState } from "react";

// ─── SheetJS (XLSX) carregado dinamicamente via CDN ───────────────────────────
const XLSX_CDN = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";

function carregarSheetJS() {
  return new Promise((resolve, reject) => {
    if (window.XLSX) return resolve(window.XLSX);
    const script = document.createElement("script");
    script.src = XLSX_CDN;
    script.onload  = () => resolve(window.XLSX);
    script.onerror = () => reject(new Error("Falha ao carregar SheetJS"));
    document.head.appendChild(script);
  });
}

// ─── Helpers de download ──────────────────────────────────────────────────────

function downloadBlob(blob, nomeArquivo) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement("a");
  a.href     = url;
  a.download = nomeArquivo;
  a.click();
  URL.revokeObjectURL(url);
}

function sanitizarNome(tema = "lista") {
  return tema
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 40) || "lista";
}

// ─── Conversores ──────────────────────────────────────────────────────────────

function paraCSV(itens) {
  if (!itens.length) return "";
  const cabecalho = Object.keys(itens[0]);
  const linhas    = itens.map((item) =>
    cabecalho.map((col) => {
      const val = item[col] ?? "";
      const str = String(val).replace(/"/g, '""');
      return str.includes(",") || str.includes("\n") || str.includes('"')
        ? `"${str}"`
        : str;
    }).join(",")
  );
  return [cabecalho.join(","), ...linhas].join("\n");
}

function paraTXT(itens) {
  return itens.map((item, i) => {
    const chaves   = Object.keys(item);
    const titulo   = item[chaves[1]] || `Item ${i + 1}`;
    const detalhes = chaves
      .filter((k) => k.toLowerCase() !== "id")
      .map((k) => `   - ${k}: ${item[k]}`)
      .join("\n");
    return `${i + 1}. ${titulo.toUpperCase()}\n${detalhes}`;
  }).join("\n\n");
}

async function paraXLSX(itens, tema) {
  const XLSX   = await carregarSheetJS();
  const wb     = XLSX.utils.book_new();
  const ws     = XLSX.utils.json_to_sheet(itens);

  // Largura automática das colunas
  const cols = Object.keys(itens[0] ?? {}).map((key) => ({
    wch: Math.max(
      key.length,
      ...itens.map((row) => String(row[key] ?? "").length)
    ) + 2,
  }));
  ws["!cols"] = cols;

  XLSX.utils.book_append_sheet(wb, ws, sanitizarNome(tema).slice(0, 31));
  return XLSX.write(wb, { bookType: "xlsx", type: "array" });
}

// ─── Hook principal ────────────────────────────────────────────────────────────

/**
 * useExport
 *
 * Exporta finalList.json nos formatos CSV, JSON, TXT e XLSX.
 * Suporta download direto e cópia para clipboard.
 *
 * @returns {{
 *   exportar: (formato, modo, finalListJson, tema) => Promise<void>,
 *   exportando: boolean,
 *   erroExport: string | null,
 * }}
 */
export const useExport = () => {
  const [exportando,  setExportando]  = useState(false);
  const [erroExport,  setErroExport]  = useState(null);

  /**
   * @param {"csv"|"json"|"txt"|"xlsx"} formato
   * @param {"download"|"clipboard"}    modo
   * @param {string}  finalListJson  - JSON string do array de objetos
   * @param {string}  tema           - Usado no nome do arquivo
   */
  const exportar = useCallback(async (formato, modo, finalListJson, tema = "lista") => {
    setErroExport(null);
    setExportando(true);

    try {
      const itens = JSON.parse(finalListJson);
      if (!Array.isArray(itens) || itens.length === 0)
        throw new Error("Lista vazia ou inválida para exportar.");

      const nome = sanitizarNome(tema);

      if (formato === "csv") {
        const conteudo = paraCSV(itens);
        if (modo === "clipboard") {
          await navigator.clipboard.writeText(conteudo);
        } else {
          downloadBlob(new Blob([conteudo], { type: "text/csv;charset=utf-8;" }), `${nome}.csv`);
        }

      } else if (formato === "json") {
        const conteudo = JSON.stringify(itens, null, 2);
        if (modo === "clipboard") {
          await navigator.clipboard.writeText(conteudo);
        } else {
          downloadBlob(new Blob([conteudo], { type: "application/json" }), `${nome}.json`);
        }

      } else if (formato === "txt") {
        const conteudo = paraTXT(itens);
        if (modo === "clipboard") {
          await navigator.clipboard.writeText(conteudo);
        } else {
          downloadBlob(new Blob([conteudo], { type: "text/plain;charset=utf-8;" }), `${nome}.txt`);
        }

      } else if (formato === "xlsx") {
        const buffer = await paraXLSX(itens, tema);
        if (modo === "clipboard") {
          throw new Error("XLSX não pode ser copiado para clipboard — use download.");
        }
        downloadBlob(
          new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
          `${nome}.xlsx`
        );

      } else {
        throw new Error(`Formato desconhecido: ${formato}`);
      }

    } catch (err) {
      console.error("[useExport]", err);
      setErroExport(err.message);
    } finally {
      setExportando(false);
    }
  }, []);

  return { exportar, exportando, erroExport };
};

export default useExport;