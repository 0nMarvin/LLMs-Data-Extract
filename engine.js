/* Ultimate Werewolf - motor do gerador de vila (porte do app.py para o navegador). */
const UW = (() => {
  const FILTROS = [
    { tag: "vampiros", label: "Vampiros" },
    { tag: "macons", label: "Maçons" },
    { tag: "lobos_especiais", label: "Lobos especiais" },
    { tag: "culto", label: "Líder de Culto" },
  ];
  const CATEGORIAS = [["vila", "Aldeões"], ["info", "Investigadores"], ["prot", "Protetores"], ["caos", "Caóticos"],
    ["extra", "Extras"], ["macons", "Maçons"], ["lobos", "Lobisomens"], ["vampiros", "Vampiros"], ["culto", "Culto"]];
  const LIMITAVEIS = ["info", "prot", "caos", "extra", "macons"];
  const PADROES = {
    info:   [[6, 1], [10, 2], [18, 3], [30, 4], [45, 5], [60, 6]],
    prot:   [[6, 1], [10, 2], [20, 3], [32, 4], [48, 5]],
    caos:   [[6, 1], [12, 2], [22, 3], [34, 4], [50, 5]],
    extra:  [[6, 2], [10, 3], [16, 4], [24, 5], [34, 6], [46, 7]],
    macons: [[6, 0], [12, 2], [26, 3]],
  };
  const INIMIGOS = new Set(["Werewolf", "Wolf Cub", "Sorcerer", "Vampire", "Minion", "Alpha Wolf"]);
  const LIMIAR_EQUILIBRIO = 3, LIMIAR_FORTE = 10;
  const QUANDO = { first: "Só na 1ª noite", every: "Toda noite", once: "Uma vez no jogo", n3: "Só na 3ª noite",
    ident: "1ª noite · só identificar", trigger: "Quando acontecer" };
  const ESPECIAIS = ["info", "prot", "caos", "extra"];

  let ROLES = {}; // nome -> papel (mantém a ordem do JSON)

  const randint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const choice = arr => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = arr => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } };
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  const sum = (o, f) => Object.entries(o).reduce((s, [k, q]) => s + f(k, q), 0);

  async function load() {
    const list = UW_ROLES;
    ROLES = {};
    for (const r of list) ROLES[r.name] = r;
    return { roles: Object.values(ROLES), filtros: FILTROS, limitaveis: LIMITAVEIS,
      categorias: CATEGORIAS.map(([id, label]) => ({ id, label })) };
  }

  function padroes(n) {
    const out = {};
    for (const [c, t] of Object.entries(PADROES)) {
      const ok = t.filter(([m]) => n >= m).map(([, v]) => v);
      out[c] = ok.length ? Math.max(...ok) : t[0][1];
    }
    return out;
  }

  function limpar(sel) {
    const out = {};
    for (const [nome, q0] of Object.entries(sel || {})) {
      if (ROLES[nome]) {
        const q = Math.max(0, Math.min(Math.trunc(+q0) || 0, ROLES[nome].max));
        if (q) out[nome] = q;
      }
    }
    return out;
  }

  function balanco(sel) {
    const total = sum(sel, (n, q) => ROLES[n].adj * q);
    const jogadores = sum(sel, (n, q) => q);
    const inimigos = sum(sel, (n, q) => (INIMIGOS.has(n) ? q : 0));
    const esperados = jogadores ? Math.max(1, Math.ceil((jogadores - 4.5) / 3.5)) : 0;
    const a = Math.abs(total);
    let status, texto;
    if (a <= LIMIAR_EQUILIBRIO) { status = "equilibrada"; texto = "Vila equilibrada"; }
    else {
      const forca = a <= LIMIAR_FORTE ? "levemente" : "muito";
      const lado = total > 0 ? "a vila" : "os inimigos";
      status = total > 0 ? "vila" : "inimigos";
      texto = `Favorece ${forca} ${lado}`;
    }
    const avisos = [];
    if (jogadores && !(jogadores >= 6 && jogadores <= 68)) avisos.push("A planilha original só admite de 6 a 68 jogadores.");
    if (sel["Mason"] === 1) avisos.push("Nunca deve haver apenas 1 Maçom.");
    if ("Lone Wolf" in sel && (sel["Werewolf"] || 0) < 2) avisos.push("Lobo Solitário exige pelo menos 2 Lobisomens.");
    if ("Sorcerer" in sel && !("Seer" in sel)) avisos.push("A Feiticeira procura a Vidente: a vila precisa ter uma Vidente.");
    if ("Apprentice Seer" in sel && !("Seer" in sel)) avisos.push("O Vidente Aprendiz precisa da Vidente na vila.");
    if (jogadores && inimigos !== esperados)
      avisos.push(`Pela fórmula da planilha, ${jogadores} jogadores teriam cerca de ${esperados} inimigos (você tem ${inimigos}).`);
    return { total, jogadores, inimigos, esperados, status, texto, avisos };
  }

  function roteiro(sel) {
    const passos = new Map();
    const passo = (n, no, acao) => {
      const chave = JSON.stringify([no.ordem, no.fala]);
      if (!passos.has(chave)) passos.set(chave, { ordem: no.ordem, fala: no.fala, quando: no.quando,
        papeis: [], nomes: [], acoes: [], conferir: false });
      const p = passos.get(chave);
      p.nomes.push(n);
      p.papeis.push(sel[n] === 1 ? n : `${n} ×${sel[n]}`);
      p.acoes.push(acao);
      p.conferir = p.conferir || ROLES[n].conferir;
    };
    for (const n of Object.keys(sel)) {
      const r = ROLES[n];
      if (r.ident) passo(n, { ordem: r.ident.ordem, fala: r.ident.fala, quando: "ident" }, r.ident.nota);
      if (r.noite) passo(n, r.noite, r.acao);
    }
    const lista = [...passos.values()].sort((a, b) => a.ordem - b.ordem || (a.fala < b.fala ? -1 : a.fala > b.fala ? 1 : 0));
    for (const p of lista) { p.quando_txt = QUANDO[p.quando]; p.acao = p.acoes[Math.max(0, p.nomes.indexOf("Werewolf"))]; delete p.acoes; }
    const primeira = lista.filter(p => p.quando !== "trigger" && p.quando !== "n3");
    const seguintes = lista.filter(p => p.quando !== "first" && p.quando !== "ident");
    const sem_acao = Object.keys(sel).filter(n => !ROLES[n].noite && !ROLES[n].ident);
    return { primeira, seguintes, sem_acao };
  }

  function vila(sel) {
    sel = limpar(sel);
    return { sel, balanco: balanco(sel), roteiro: roteiro(sel) };
  }

  function gerarVila(n, alvo, vmax, fixos, off, limites, tentativas = 500) {
    const fx = limpar(fixos);
    const nfix = sum(fx, (k, q) => q);
    vmax = Math.max(0, Math.min(vmax, ROLES["Villager"].max));
    if (nfix > n) throw new Error(`Você fixou ${nfix} cartas, mais que os ${n} jogadores.`);
    if ((fx["Villager"] || 0) > vmax) throw new Error("Você fixou mais aldeões que o máximo permitido.");
    const lim = padroes(n);
    for (const [c, val] of Object.entries(limites || {})) {
      if (c in lim && val !== null && val !== undefined && val !== "") lim[c] = Math.max(0, Math.trunc(+val) || 0);
    }
    const usados = {};
    for (const c of LIMITAVEIS) usados[c] = sum(fx, (k, q) => (ROLES[k].grupo === c ? q : 0));
    const ok = r => !r.tags.some(t => off.has(t));
    const n_mal = Math.max(1, Math.ceil((n - 4.5) / 3.5));
    const mal_fixo = sum(fx, (k, q) => (INIMIGOS.has(k) ? q : 0));
    const pools = {};
    for (const c of ESPECIAIS) pools[c] = Object.values(ROLES).filter(r => r.grupo === c && ok(r)).map(r => r.name);
    let melhor = null;

    for (let t = 0; t < tentativas; t++) {
      const v = { ...fx };
      const cnt = { ...usados };
      const over = { info: 0, prot: 0, caos: 0, extra: 0 };
      let livre = n - nfix;

      const add = (nome, q = 1) => {
        q = Math.min(q, ROLES[nome].max - (v[nome] || 0), livre);
        if (q > 0) { v[nome] = (v[nome] || 0) + q; livre -= q; }
        return Math.max(q, 0);
      };
      const disponiveis = c => pools[c].filter(x => !(x in v) && (x !== "Apprentice Seer" || "Seer" in v));
      const sortearCat = (c, k) => {
        for (let i = 0; i < k; i++) {
          const d = disponiveis(c);
          if (livre <= 0 || !d.length) break;
          add(choice(d));
          cnt[c] += 1;
        }
      };

      // 1) Investigadores
      const cap = Math.max(0, lim.info - usados.info);
      const k = randint((cap >= 1 && usados.info === 0) ? 1 : 0, cap);
      sortearCat("info", Math.max(0, Math.min(k, livre - Math.max(0, n_mal - mal_fixo))));
      const temSeer = "Seer" in v;

      // 2) Inimigos
      const mal = sum(v, (k_, q) => (INIMIGOS.has(k_) ? q : 0));
      let falta = Math.max(0, Math.min(n_mal - mal, livre));
      const reserva = v["Werewolf"] ? 0 : 1;
      if (falta > reserva + 1 && ok(ROLES["Vampire"]) && !("Vampire" in v) && Math.random() < 0.35)
        falta -= add("Vampire", randint(1, Math.min(3, falta - reserva)));
      const extras = ["Wolf Cub", "Sorcerer", "Alpha Wolf", "Minion"];
      shuffle(extras);
      for (const e of extras) {
        if (e === "Sorcerer" && !temSeer) continue;
        if (falta > reserva && ok(ROLES[e]) && !(e in v) && Math.random() < 0.4) falta -= add(e);
      }
      falta -= add("Werewolf", falta);
      if (falta > 0 && ok(ROLES["Vampire"])) add("Vampire", falta);
      if (!v["Werewolf"] && livre) add("Werewolf");
      if ((v["Werewolf"] || 0) >= 2 && !("Lone Wolf" in v) && ok(ROLES["Lone Wolf"]) && Math.random() < 0.2) add("Lone Wolf");

      // 3) Maçons
      const capM = lim.macons - usados.macons;
      if (!("Mason" in v) && ok(ROLES["Mason"]) && capM >= 2 && livre >= 2 && Math.random() < 0.5)
        add("Mason", randint(2, Math.min(3, capM, livre)));

      // 4) Protetores, caóticos, extras
      const cats = ["prot", "caos", "extra"];
      shuffle(cats);
      for (const c of cats) sortearCat(c, randint(0, Math.max(0, lim[c] - usados[c])));

      // 5) Aldeões
      add("Villager", randint(0, vmax) - (v["Villager"] || 0));

      // 6) Completar / estourar o máximo
      while (livre > 0) {
        let cand = ESPECIAIS.filter(c => cnt[c] < lim[c] && disponiveis(c).length);
        if ((v["Villager"] || 0) < vmax) cand.push("Villager");
        if (cand.length) {
          const c = choice(cand);
          if (c === "Villager") add("Villager");
          else { add(choice(disponiveis(c))); cnt[c] += 1; }
          continue;
        }
        cand = ESPECIAIS.filter(c => disponiveis(c).length);
        if (cand.length) {
          const m = Math.min(...cand.map(c => over[c]));
          const c = choice(cand.filter(c2 => over[c2] === m));
          add(choice(disponiveis(c)));
          cnt[c] += 1;
          over[c] += 1;
          continue;
        }
        const antes = livre;
        add("Villager", livre);
        add("Werewolf", livre);
        if (livre && ok(ROLES["Vampire"])) add("Vampire", livre);
        if (livre === antes) break;
      }
      if (livre) continue;
      const total = sum(v, (k_, q) => ROLES[k_].adj * q);
      const d = Math.abs(total - alvo);
      if (!melhor || d < melhor[0]) {
        melhor = [d, v, over];
        if (d === 0) break;
      }
    }
    if (!melhor) throw new Error("Não foi possível montar uma vila com esses números e filtros. " +
      "Não há cartas suficientes para esse número de jogadores com os filtros atuais; " +
      "tente reativar algum grupo removido ou reduzir os fixos.");
    const [, v, over] = melhor;
    const gerados = {};
    for (const [k, q] of Object.entries(v)) if (q > (fx[k] || 0)) gerados[k] = q - (fx[k] || 0);
    return { v, gerados, over };
  }

  function gerar(d) {
    const n = clamp(Math.trunc(+d.n) || 12, 6, 68);
    const alvo = clamp(Math.trunc(+d.alvo) || 0, -200, 200);
    const vmax = clamp(Number.isFinite(+d.vmax) ? Math.trunc(+d.vmax) : 15, 0, 15);
    const { v, gerados, over } = gerarVila(n, alvo, vmax, d.sel, new Set(d.off || []), d.limites);
    const rot = Object.fromEntries(CATEGORIAS);
    const est = Object.entries(over).filter(([, q]) => q).map(([c, q]) => `+${q} em ${rot[c]}`);
    const aviso = est.length ? `Para completar ${n} jogadores, os máximos foram ampliados: ${est.join(", ")}.` : "";
    return { sel: v, gerados, balanco: balanco(v), roteiro: roteiro(v), aviso };
  }

  return { load, padroes, vila, gerar };
})();
