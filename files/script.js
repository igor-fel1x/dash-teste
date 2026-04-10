/* ============================================================
   UmiData — script.js v5
   - Gráfico "Internações x Umidade" REMOVIDO completamente
   - Ranking sempre visível (não depende do gráfico removido)
============================================================ */

const GESTOR = "Cacau gay";
const REGIAO = "Sudeste";

/* ── BANCO DE DADOS ── */
const DB = {
  "AC":{ nome:"Acre",               sigla:"AC", ibge:"12", regiao:"Norte",        umidade:75, internacoes:480,  hospitais:62   },
  "AL":{ nome:"Alagoas",            sigla:"AL", ibge:"27", regiao:"Nordeste",     umidade:28, internacoes:1800, hospitais:145  },
  "AM":{ nome:"Amazonas",           sigla:"AM", ibge:"13", regiao:"Norte",        umidade:78, internacoes:1100, hospitais:190  },
  "AP":{ nome:"Amapá",              sigla:"AP", ibge:"16", regiao:"Norte",        umidade:80, internacoes:310,  hospitais:48   },
  "BA":{ nome:"Bahia",              sigla:"BA", ibge:"29", regiao:"Nordeste",     umidade:25, internacoes:4100, hospitais:680  },
  "CE":{ nome:"Ceará",              sigla:"CE", ibge:"23", regiao:"Nordeste",     umidade:19, internacoes:3200, hospitais:440  },
  "DF":{ nome:"Distrito Federal",   sigla:"DF", ibge:"53", regiao:"Centro-Oeste", umidade:13, internacoes:5200, hospitais:180  },
  "ES":{ nome:"Espírito Santo",     sigla:"ES", ibge:"32", regiao:"Sudeste",      umidade:42, internacoes:1100, hospitais:340  },
  "GO":{ nome:"Goiás",              sigla:"GO", ibge:"52", regiao:"Centro-Oeste", umidade:15, internacoes:4600, hospitais:420  },
  "MA":{ nome:"Maranhão",           sigla:"MA", ibge:"21", regiao:"Nordeste",     umidade:30, internacoes:2800, hospitais:380  },
  "MG":{ nome:"Minas Gerais",       sigla:"MG", ibge:"31", regiao:"Sudeste",      umidade:22, internacoes:3700, hospitais:980  },
  "MS":{ nome:"Mato Grosso do Sul", sigla:"MS", ibge:"50", regiao:"Centro-Oeste", umidade:20, internacoes:3200, hospitais:280  },
  "MT":{ nome:"Mato Grosso",        sigla:"MT", ibge:"51", regiao:"Centro-Oeste", umidade:18, internacoes:3900, hospitais:310  },
  "PA":{ nome:"Pará",               sigla:"PA", ibge:"15", regiao:"Norte",        umidade:72, internacoes:1400, hospitais:280  },
  "PB":{ nome:"Paraíba",            sigla:"PB", ibge:"25", regiao:"Nordeste",     umidade:21, internacoes:1600, hospitais:195  },
  "PE":{ nome:"Pernambuco",         sigla:"PE", ibge:"26", regiao:"Nordeste",     umidade:22, internacoes:3500, hospitais:520  },
  "PI":{ nome:"Piauí",              sigla:"PI", ibge:"22", regiao:"Nordeste",     umidade:18, internacoes:1900, hospitais:210  },
  "PR":{ nome:"Paraná",             sigla:"PR", ibge:"41", regiao:"Sul",          umidade:52, internacoes:1900, hospitais:640  },
  "RJ":{ nome:"Rio de Janeiro",     sigla:"RJ", ibge:"33", regiao:"Sudeste",      umidade:28, internacoes:3100, hospitais:820  },
  "RN":{ nome:"Rio G. do Norte",    sigla:"RN", ibge:"24", regiao:"Nordeste",     umidade:23, internacoes:1700, hospitais:215  },
  "RO":{ nome:"Rondônia",           sigla:"RO", ibge:"11", regiao:"Norte",        umidade:62, internacoes:850,  hospitais:155  },
  "RR":{ nome:"Roraima",            sigla:"RR", ibge:"14", regiao:"Norte",        umidade:68, internacoes:290,  hospitais:42   },
  "RS":{ nome:"Rio G. do Sul",      sigla:"RS", ibge:"43", regiao:"Sul",          umidade:58, internacoes:1800, hospitais:720  },
  "SC":{ nome:"Santa Catarina",     sigla:"SC", ibge:"42", regiao:"Sul",          umidade:65, internacoes:1200, hospitais:520  },
  "SE":{ nome:"Sergipe",            sigla:"SE", ibge:"28", regiao:"Nordeste",     umidade:26, internacoes:1200, hospitais:165  },
  "SP":{ nome:"São Paulo",          sigla:"SP", ibge:"35", regiao:"Sudeste",      umidade:18, internacoes:4820, hospitais:1250 },
  "TO":{ nome:"Tocantins",          sigla:"TO", ibge:"17", regiao:"Norte",        umidade:35, internacoes:820,  hospitais:125  },
};

const SERIE = {
  labels:["Sem 1","Sem 2","Sem 3","Sem 4","Sem 5","Atual"],
  "AC":[80,79,78,77,76,75],"AL":[33,32,30,29,28,28],"AM":[82,81,80,80,79,78],
  "AP":[84,83,82,81,80,80],"BA":[32,30,28,27,26,25],"CE":[26,24,23,21,20,19],
  "DF":[18,16,15,14,13,13],"ES":[48,46,45,44,43,42],"GO":[22,20,18,17,16,15],
  "MA":[36,34,32,31,30,30],"MG":[30,28,26,24,23,22],"MS":[24,23,22,21,20,20],
  "MT":[24,22,21,19,18,18],"PA":[74,73,73,72,72,72],"PB":[26,25,24,23,22,21],
  "PE":[28,27,26,24,23,22],"PI":[24,22,21,19,18,18],"PR":[56,55,54,53,52,52],
  "RJ":[38,36,34,32,30,28],"RN":[28,27,26,25,24,23],"RO":[65,64,63,62,62,62],
  "RR":[72,71,70,69,69,68],"RS":[62,61,60,59,58,58],"SC":[68,67,66,65,65,65],
  "SE":[30,29,28,27,26,26],"SP":[30,26,23,21,19,18],"TO":[42,40,38,37,36,35],
};

let estadoAtual = null;
let lineChart = null, barChart = null;

/* ── UTILITÁRIOS ── */
function todos()     { return Object.values(DB); }
function daRegiao(r) { return todos().filter(e => e.regiao === r); }

function cor(u) {
  if (u < 15) return "#ef4444";
  if (u < 25) return "#f97316";
  if (u < 40) return "#eab308";
  return "#22c55e";
}
function fillBg(u) {
  if (u < 15) return "rgba(239,68,68,.1)";
  if (u < 25) return "rgba(249,115,22,.09)";
  if (u < 40) return "rgba(234,179,8,.08)";
  return "rgba(34,197,94,.07)";
}
function esbCls(u) {
  if (u < 15) return "esb-critico";
  if (u < 25) return "esb-alerta";
  if (u < 40) return "esb-atencao";
  return "esb-normal";
}
function pill(u) {
  if (u < 15) return ["CRÍTICO",  "pill-c"];
  if (u < 25) return ["ALERTA",   "pill-a"];
  if (u < 40) return ["ATENÇÃO",  "pill-t"];
  return             ["NORMAL",   "pill-n"];
}

function estadoMaisCritico(regiao) {
  const lista = daRegiao(regiao);
  if (!lista.length) return null;
  return lista.reduce((min, e) => e.umidade < min.umidade ? e : min, lista[0]);
}

/* ── RELÓGIO ── */
function horaBRT() {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utcMs - 3 * 3600000);
}
function fmtBRT(d) {
  const p = n => String(n).padStart(2, "0");
  return p(d.getDate())+"/"+p(d.getMonth()+1)+"/"+d.getFullYear()
        +" "+p(d.getHours())+":"+p(d.getMinutes())+":"+p(d.getSeconds())+" BRT";
}
function tickRelogio() {
  const el = document.getElementById("clock");
  if (el) el.textContent = fmtBRT(horaBRT());
}
setInterval(tickRelogio, 1000);

/* ── SELECT ── */
function popularSelect() {
  const sel = document.getElementById("selEstado");
  sel.innerHTML = "";
  const lista = daRegiao(REGIAO).sort((a,b) => a.umidade - b.umidade);
  lista.forEach(e => {
    const o = document.createElement("option");
    o.value = e.sigla;
    o.textContent = e.nome + " — " + e.umidade + "% UR";
    if (e.sigla === estadoAtual) o.selected = true;
    sel.appendChild(o);
  });
}

/* ── KPIs ── */
const VARS = {
  um:   { v:-2.1, d:"down" }, crit: { v:+1,   d:"up"   },
  risco:{ v:+2.1, d:"up"   }, int:  { v:+4.8, d:"up"   },
  hosp: { v:-0.3, d:"down" }
};

function renderKPIs() {
  const list   = daRegiao(REGIAO);
  const n      = list.length;
  const umMed  = list.reduce((s,e) => s + e.umidade, 0) / n;
  const crit   = list.filter(e => e.umidade < 20).length;
  const risco  = (100 - umMed).toFixed(1);
  const intTot = list.reduce((s,e) => s + e.internacoes, 0);
  const hospTot= list.reduce((s,e) => s + e.hospitais,   0);
  const relH   = (hospTot / (crit || 1)).toFixed(1);

  const kpis = [
    { lbl:"Umidade Média da Região",       val:umMed.toFixed(1), unit:"%" },
    { lbl:"Estados com Umidade < 20%",     val:((crit/n)*100).toFixed(0), unit:"%",
      c:crit>0?"#ef4444":"#22c55e", vr:VARS.crit, desc:crit+" de "+n+" estados em situação crítica" },
    { lbl:"Índice de Risco Climático",     val:risco, unit:"",
      c:parseFloat(risco)>75?"#ef4444":parseFloat(risco)>60?"#f97316":"#eab308",
      vr:VARS.risco, desc:"100 − Umidade Média" },
    { lbl:"Total de Internações",          val:intTot.toLocaleString("pt-BR"), unit:"",
      c:"#f97316", vr:VARS.int, desc:"Soma dos estados da região" },
    { lbl:"Hospitais / Estados Críticos",  val:relH, unit:"",
      c:parseFloat(relH)<200?"#ef4444":"#eab308", vr:VARS.hosp, desc:"Capacidade hospitalar vs risco" },
  ];

  document.getElementById("kpiGrid").innerHTML = kpis.map(k =>
    '<div class="kpi-card" style="--kc:'+k.c+'">'+
      '<div class="kpi-label">'+k.lbl+'</div>'+
      '<div class="kpi-val">'+k.val+'<span class="kpi-unit">'+k.unit+'</span></div>'+
      '<div class="kpi-var '+k.vr.d+'">'+
        (k.vr.d==="up"?"▲":"▼")+' '+
        (k.vr.d==="up"?"+":"")+k.vr.v+(k.unit||"%")+
        ' <span style="color:var(--muted);font-size:.58rem">vs semana ant.</span>'+
      '</div>'+
      '<div class="kpi-desc">'+k.desc+'</div>'+
    '</div>'
  ).join("");
}

/* ── BANNER ── */
function atualizarBanner(est) {
  const banner = document.getElementById("bannerCritico");
  const txt    = document.getElementById("bannerTxt");
  if (est.umidade < 25) {
    banner.classList.add("visivel");
    const [status] = pill(est.umidade);
    txt.innerHTML =
      '<strong>⚠ '+est.nome+' ('+est.sigla+')</strong> está em nível '+
      '<strong>'+status+'</strong> com <strong>'+est.umidade+'% de umidade</strong>. '+
      est.internacoes.toLocaleString("pt-BR")+" internações registradas. Ação imediata recomendada.";
  } else {
    banner.classList.remove("visivel");
  }
}

function atualizarNavBadge() {
  const n = daRegiao(REGIAO).filter(e => e.umidade < 20).length;
  const b = document.getElementById("alertaPill");
  if (n > 0) {
    b.style.display = "inline-block";
    b.textContent   = "⚠ " + n + " CRÍTICO(S) — " + REGIAO;
  } else {
    b.style.display = "none";
  }
}

/* ── STATUS BAR ── */
function renderStatusBar(est) {
  const c   = cor(est.umidade);
  const cls = esbCls(est.umidade);
  const [status] = pill(est.umidade);
  document.getElementById("estadoStatusBar").innerHTML =
    '<div class="estado-status-bar '+cls+'">'+
      '<div class="esb-dot" style="background:'+c+';color:'+c+'"></div>'+
      '<div>'+
        '<div class="esb-estado">'+est.nome+'</div>'+
        '<div class="esb-ibge">IBGE: '+est.ibge+' · '+REGIAO+'</div>'+
      '</div>'+
      '<span class="esb-umi" style="background:'+c+'18;color:'+c+';border:1px solid '+c+'44">'+
        est.umidade+'% UR · '+status+
      '</span>'+
      '<span class="esb-hora" id="barraHora">'+fmtBRT(horaBRT())+'</span>'+
    '</div>';
  setInterval(() => {
    const el = document.getElementById("barraHora");
    if (el) el.textContent = fmtBRT(horaBRT());
  }, 1000);
}

/* ── MAPA DE CALOR ── */
function renderMapa(siglaAtiva) {
  const lista = daRegiao(REGIAO).sort((a, b) => a.umidade - b.umidade);
  const wrap  = document.getElementById("mapaCards");
  wrap.innerHTML = lista.map(e => {
    const c      = cor(e.umidade);
    const bg     = fillBg(e.umidade);
    const ativo  = e.sigla === siglaAtiva;
    const [st, pc] = pill(e.umidade);
    return '<div class="heat-card'+(ativo?" ativo":"")+'" '+
                'style="--hc:'+c+';background:'+bg+';border-color:'+c+(ativo?';box-shadow:0 0 20px '+c+'33':'')+'" '+
                'onclick="selecionarEstado(\''+e.sigla+'\')">'+
              '<span class="hc-sigla">'+e.sigla+'</span>'+
              '<span class="hc-nome">'+e.nome+'</span>'+
              '<div class="hc-umi-val">'+e.umidade+'<span class="hc-umi-unit">%</span></div>'+
              '<div class="hc-bar-track">'+
                '<div class="hc-bar-fill" style="width:'+e.umidade+'%"></div>'+
              '</div>'+
              '<span class="hc-pill '+pc+'" style="margin-top:2px">'+st+'</span>'+
              '<span class="hc-sub">'+e.internacoes.toLocaleString("pt-BR")+'&nbsp;intern.</span>'+
            '</div>';
  }).join("");
}

function selecionarEstado(sig) {
  if (!DB[sig] || DB[sig].regiao !== REGIAO) return;
  estadoAtual = sig;
  document.getElementById("selEstado").value = sig;
  renderTudo();
}

/* ── GRÁFICOS ── */
Chart.defaults.color       = "#4a6080";
Chart.defaults.borderColor = "#172030";
Chart.defaults.font.family = "DM Mono, monospace";
Chart.defaults.font.size   = 10;

function renderLinha(sig) {
  const ctx = document.getElementById("lineChart").getContext("2d");
  if (lineChart) lineChart.destroy();
  const e = DB[sig], c = cor(e.umidade);
  lineChart = new Chart(ctx, {
    type:"line",
    data:{
      labels: SERIE.labels,
      datasets:[{
        label: "Umidade — "+e.nome,
        data: SERIE[sig] || Array(6).fill(e.umidade),
        borderColor:c, backgroundColor:c+"20", fill:true,
        borderWidth:2.5, pointRadius:5, pointHoverRadius:7, tension:.4
      }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{legend:{display:false}, tooltip:{callbacks:{label: ctx => " "+ctx.raw+"% UR"}}},
      scales:{
        y:{min:0,max:100, ticks:{callback:v=>v+"%"}, grid:{color:"#172030"}},
        x:{grid:{color:"#172030"}}
      }
    }
  });
}

function renderBarras() {
  const ctx   = document.getElementById("barChart").getContext("2d");
  if (barChart) barChart.destroy();
  const lista = daRegiao(REGIAO).sort((a,b) => a.umidade - b.umidade);
  barChart = new Chart(ctx, {
    type:"bar",
    data:{
      labels: lista.map(e => e.sigla),
      datasets:[{
        label:"Umidade (%)",
        data: lista.map(e => e.umidade),
        backgroundColor: lista.map(e => cor(e.umidade)),
        borderRadius:6, borderSkipped:false
      }]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{legend:{display:false}, tooltip:{callbacks:{label: ctx => " "+ctx.raw+"% UR"}}},
      scales:{
        y:{min:0,max:100, ticks:{callback:v=>v+"%"}, grid:{color:"#172030"}},
        x:{grid:{display:false}}
      }
    }
  });
}

/* ── TABELA RANKING ── */
function renderTabela() {
  const critico = estadoMaisCritico(REGIAO);
  const lista   = daRegiao(REGIAO).sort((a,b) => a.umidade - b.umidade);
  document.getElementById("rankBody").innerHTML = lista.map((e, i) => {
    const c  = cor(e.umidade);
    const [st, pc] = pill(e.umidade);
    const eh = e.sigla === critico?.sigla;
    return '<tr'+(eh?' class="linha-critica"':'')+'>'+
      '<td style="color:var(--muted)">'+(i+1)+'</td>'+
      '<td class="td-nm">'+e.nome+'</td>'+
      '<td style="color:'+c+';font-weight:700">'+e.umidade+'%</td>'+
      '<td><div class="bar-r"><div class="bar-t">'+
        '<div class="bar-f" style="width:'+e.umidade+'%;background:'+c+'"></div>'+
      '</div></div></td>'+
      '<td>'+e.internacoes.toLocaleString("pt-BR")+'</td>'+
      '<td>'+e.hospitais.toLocaleString("pt-BR")+'</td>'+
      '<td><span class="pill '+pc+'">'+st+'</span></td>'+
      '<td style="color:var(--muted);font-size:.65rem">'+e.ibge+'</td>'+
    '</tr>';
  }).join("");
}

/* ── RENDER GERAL ── */
function renderTudo() {
  const est = DB[estadoAtual];
  if (!est) return;
  renderKPIs();
  renderStatusBar(est);
  renderMapa(estadoAtual);
  atualizarBanner(est);
  atualizarNavBadge();
  renderLinha(estadoAtual);
  renderBarras();
  renderTabela();
}

/* ── MODAL ── */
function abrirModal() {
  document.getElementById("modalRegiaoInfo").textContent = REGIAO;
  document.getElementById("modalOv").classList.add("open");
}
function fecharModal() {
  document.getElementById("modalOv").classList.remove("open");
  ["fNome","fSigla","fIbge"].forEach(id => { document.getElementById(id).value = ""; });
}
function salvarEstado() {
  const nome = document.getElementById("fNome").value.trim();
  const sig  = document.getElementById("fSigla").value.trim().toUpperCase();
  const ibge = document.getElementById("fIbge").value.trim();
  if (!nome || !sig || sig.length > 3 || !ibge) { alert("Preencha todos os campos."); return; }
  if (DB[sig]) { alert("Já existe um estado com a sigla "+sig+"."); return; }

  const lista   = daRegiao(REGIAO);
  const umiMed  = Math.round(lista.reduce((s,e)=>s+e.umidade,0)/lista.length);
  const intMed  = Math.round(lista.reduce((s,e)=>s+e.internacoes,0)/lista.length);
  const hospMed = Math.round(lista.reduce((s,e)=>s+e.hospitais,0)/lista.length);
  const variacao = n => Math.max(1, Math.round(n * (0.85 + Math.random() * 0.3)));

  DB[sig] = { nome, sigla:sig, ibge, regiao:REGIAO,
    umidade:Math.min(100, variacao(umiMed)),
    internacoes:variacao(intMed), hospitais:variacao(hospMed) };

  const umiBase = DB[sig].umidade;
  const hist = [];
  for (let i = 5; i >= 0; i--) hist.push(Math.min(100, umiBase + i * 2));
  SERIE[sig] = hist;

  fecharModal(); popularSelect(); renderTudo();
  toast('"'+nome+'" adicionado à região '+REGIAO+'!');
}

/* ── TOAST ── */
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = "✓ " + msg;
  t.style.display = "block";
  setTimeout(() => { t.style.display = "none"; }, 3500);
}

/* ── INIT ── */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("nomeGestor").textContent   = GESTOR;
  document.getElementById("regiaoGestor").textContent = REGIAO;

  const lblReg = document.getElementById("secRegiaoLabel");
  const lblTag = document.getElementById("mapaFocoTag");
  if (lblReg) lblReg.textContent = REGIAO;
  if (lblTag) lblTag.textContent = REGIAO.toUpperCase();

  const critico = estadoMaisCritico(REGIAO);
  estadoAtual   = critico ? critico.sigla : Object.keys(DB)[0];

  tickRelogio();
  popularSelect();
  renderTudo();

  document.getElementById("selEstado").addEventListener("change", function() {
    selecionarEstado(this.value);
  });
  document.getElementById("btnAdmin").addEventListener("click", abrirModal);
  document.getElementById("modalOv").addEventListener("click", function(e) {
    if (e.target === this) fecharModal();
  });
  document.getElementById("btnCancelar").addEventListener("click", fecharModal);
  document.getElementById("btnSalvar").addEventListener("click",   salvarEstado);
  document.getElementById("bannerAction").addEventListener("click", () => {
    document.getElementById("mapaSection").scrollIntoView({ behavior:"smooth" });
  });
});