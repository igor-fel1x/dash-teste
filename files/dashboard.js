// ===== CONFIG =====
const GESTOR = "Cauã";
const REGIAO = "Sudeste";

// ===== DADOS =====
const DB = {
  ES:{ nome:"Espírito Santo", sigla:"ES", ibge:"32", regiao:"Sudeste", umidade:42, internacoes:1100, hospitais:340 },
  MG:{ nome:"Minas Gerais", sigla:"MG", ibge:"31", regiao:"Sudeste", umidade:22, internacoes:3700, hospitais:980 },
  RJ:{ nome:"Rio de Janeiro", sigla:"RJ", ibge:"33", regiao:"Sudeste", umidade:28, internacoes:3100, hospitais:820 },
  SP:{ nome:"São Paulo", sigla:"SP", ibge:"35", regiao:"Sudeste", umidade:18, internacoes:4820, hospitais:1250 },
};

const SERIE = {
  labels:["Sem 1","Sem 2","Sem 3","Sem 4","Sem 5","Atual"],
  ES:[48,46,45,44,43,42],
  MG:[30,28,26,24,23,22],
  RJ:[38,36,34,32,30,28],
  SP:[30,26,23,21,19,18],
};

let estadoAtual;
let lineChart, barChart;


// ===== FUNÇÕES =====
function listaEstados() {
  return Object.values(DB).filter(e => e.regiao === REGIAO);
}

function cor(u) {
  if (u < 15) return "#ef4444";
  if (u < 25) return "#f97316";
  if (u < 40) return "#eab308";
  return "#22c55e";
}

function status(u) {
  if (u < 15) return "CRÍTICO";
  if (u < 25) return "ALERTA";
  if (u < 40) return "ATENÇÃO";
  return "NORMAL";
}

function estadoCritico() {
  return listaEstados().reduce((menor, e) =>
    e.umidade < menor.umidade ? e : menor
  );
}


// ===== KPIs =====
function renderKPIs() {
  const lista = listaEstados();

  const media = lista.reduce((s,e)=>s+e.umidade,0) / lista.length;
  const criticos = lista.filter(e=>e.umidade < 20).length;
  const internacoes = lista.reduce((s,e)=>s+e.internacoes,0);

  document.getElementById("kpiGrid").innerHTML = `
    <div class="kpi-card">
      <div class="kpi-label">Umidade Média</div>
      <div class="kpi-val">${media.toFixed(1)}%</div>
    </div>

    <div class="kpi-card">
      <div class="kpi-label">Estados Críticos</div>
      <div class="kpi-val">${criticos}</div>
    </div>

    <div class="kpi-card">
      <div class="kpi-label">Internações</div>
      <div class="kpi-val">${internacoes}</div>
    </div>
  `;
}


// ===== MAPA =====
function renderMapa() {
  const lista = listaEstados();

  document.getElementById("mapaCards").innerHTML = lista.map(e => `
    <div class="heat-card ${e.sigla === estadoAtual ? "ativo":""}"
      style="--hc:${cor(e.umidade)}; border-color:${cor(e.umidade)}"
      onclick="selecionarEstado('${e.sigla}')">

      <span class="hc-sigla">${e.sigla}</span>
      <span class="hc-nome">${e.nome}</span>

      <div class="hc-umi-val">
        ${e.umidade}<span class="hc-umi-unit">%</span>
      </div>

      <div class="hc-bar-track">
        <div class="hc-bar-fill" style="width:${e.umidade}%; background:${cor(e.umidade)}"></div>
      </div>

      <span class="hc-pill">${status(e.umidade)}</span>
      <span class="hc-sub">${e.internacoes} intern.</span>
    </div>
  `).join("");
}


// ===== STATUS BAR =====
function renderStatus() {
  const e = DB[estadoAtual];

  document.getElementById("estadoStatusBar").innerHTML = `
    <div class="estado-status-bar">
      <div class="esb-estado">${e.nome}</div>
      <div class="esb-ibge">IBGE: ${e.ibge}</div>
      <span class="esb-umi">${e.umidade}% - ${status(e.umidade)}</span>
    </div>
  `;
}


// ===== GRÁFICOS =====
function renderLinha() {
  const ctx = document.getElementById("lineChart");

  if (lineChart) lineChart.destroy();

  const dados = SERIE[estadoAtual] || Array(6).fill(DB[estadoAtual].umidade);

  lineChart = new Chart(ctx, {
    type:"line",
    data:{
      labels: SERIE.labels,
      datasets:[{
        label: DB[estadoAtual].nome,
        data: dados,
        borderColor: cor(DB[estadoAtual].umidade)
      }]
    }
  });
}

function renderBarras() {
  const ctx = document.getElementById("barChart");

  if (barChart) barChart.destroy();

  const lista = listaEstados();

  barChart = new Chart(ctx, {
    type:"bar",
    data:{
      labels: lista.map(e=>e.sigla),
      datasets:[{
        label:"Umidade",
        data: lista.map(e=>e.umidade),
        backgroundColor: lista.map(e=>cor(e.umidade))
      }]
    }
  });
}


// ===== TABELA =====
function renderTabela() {
  const lista = listaEstados().sort((a,b)=>a.umidade - b.umidade);

  document.getElementById("rankBody").innerHTML =
    lista.map((e,i)=>`
      <tr>
        <td>${i+1}</td>
        <td class="td-nm">${e.nome}</td>
        <td>${e.umidade}%</td>
        <td>${e.internacoes}</td>
        <td>${e.hospitais}</td>
        <td>${status(e.umidade)}</td>
        <td>${e.ibge}</td>
      </tr>
    `).join("");
}


// ===== CONTROLE =====
function selecionarEstado(sigla) {
  estadoAtual = sigla;
  renderTudo();
}


// ===== RENDER =====
function renderTudo() {
  renderKPIs();
  renderStatus();
  renderMapa();
  renderLinha();
  renderBarras();
  renderTabela();
}


// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {

  document.getElementById("nomeGestor").textContent = GESTOR;
  document.getElementById("regiaoGestor").textContent = REGIAO;
  document.getElementById("secRegiaoLabel").textContent = REGIAO;
  document.getElementById("mapaFocoTag").textContent = REGIAO;

  estadoAtual = estadoCritico().sigla;

  renderTudo();

});