const { layout, esc } = require('./layout');
const { CATEGORIAS, GRAVIDADES, PUBLICOS, PRIORIDADES } = require('../config/opcoes');

function formatarData(data) {
  return new Date(data).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function opcoes(mapa, selecionado) {
  return Object.entries(mapa)
    .map(([valor, rotulo]) => `<option value="${valor}"${valor === selecionado ? ' selected' : ''}>${esc(rotulo)}</option>`)
    .join('');
}

// Lista de barras horizontais feitas só com CSS
function graficoBarras(itens, classeExtra = '') {
  if (!itens.length) return '<p class="vazio">Sem dados ainda.</p>';
  const maior = Math.max(...itens.map((i) => i.quantidade), 1);
  return `<ul class="barras ${classeExtra}">
    ${itens.map((i) => `
      <li class="barras__item${i.chave ? ` barras__item--${i.chave}` : ''}">
        <span class="barras__rotulo">${esc(i.rotulo)}</span>
        <span class="barras__trilho"><span class="barras__valor" style="width:${Math.round((i.quantidade / maior) * 100)}%"></span></span>
        <span class="barras__numero">${i.quantidade} <small>(${i.percentual}%)</small></span>
      </li>`).join('')}
  </ul>`;
}

function paginaOcorrencias({ ocorrencias, indicadores, filtros, nova }) {
  const ind = indicadores;
  const filtrando = filtros.categoria || filtros.prioridade;

  const aviso = nova
    ? `<div class="alerta alerta--sucesso" role="status">
         <strong>Ocorrência registrada com sucesso!</strong>
         Pela regra de classificação ela recebeu <strong>${nova.pontuacao} ${nova.pontuacao === 1 ? 'ponto' : 'pontos'}</strong> e
         prioridade <span class="selo selo--${nova.prioridade}">${PRIORIDADES[nova.prioridade]}</span>.
       </div>`
    : '';

  const cartoes = ocorrencias.length
    ? ocorrencias.map((o) => `
      <article class="cartao${nova && String(nova._id) === String(o._id) ? ' cartao--nova' : ''}">
        <header class="cartao__topo">
          <span class="selo selo--${o.prioridade}">Prioridade ${PRIORIDADES[o.prioridade]}</span>
          <span class="cartao__categoria">${esc(CATEGORIAS[o.categoria])}</span>
        </header>
        <p class="cartao__descricao">${esc(o.descricao)}</p>
        <dl class="cartao__dados">
          <div><dt>Local</dt><dd>${esc(o.endereco)} · ${esc(o.bairro)}</dd></div>
          <div><dt>Gravidade</dt><dd>${esc(GRAVIDADES[o.gravidade].split(' (')[0])}</dd></div>
          <div><dt>Público afetado</dt><dd>${esc(PUBLICOS[o.publicoAfetado])}</dd></div>
          <div><dt>Perto de local sensível</dt><dd>${o.localSensivel ? 'Sim' : 'Não'}</dd></div>
        </dl>
        <footer class="cartao__rodape">Registrada em ${formatarData(o.createdAt)} · ${o.pontuacao} pts</footer>
      </article>`).join('')
    : `<p class="vazio">${filtrando ? 'Nenhuma ocorrência com esses filtros.' : 'Nenhuma ocorrência registrada ainda. <a href="/">Registre a primeira</a>.'}</p>`;

  const conteudo = `
    ${aviso}
    <section class="secao">
      <h1>Indicadores</h1>
      <p class="secao__intro">Dados processados a partir de todas as ocorrências salvas no MongoDB.</p>

      <div class="numeros">
        <div class="numero"><span class="numero__valor">${ind.total}</span><span class="numero__rotulo">ocorrências registradas</span></div>
        <div class="numero numero--alerta"><span class="numero__valor">${ind.altaPrioridade}</span><span class="numero__rotulo">com prioridade alta</span></div>
        <div class="numero"><span class="numero__valor">${ind.percentualLocalSensivel}%</span><span class="numero__rotulo">perto de escola, hospital, UBS ou ponto de ônibus (${ind.emLocalSensivel})</span></div>
      </div>

      <div class="paineis">
        <div class="painel">
          <h2>Por categoria</h2>
          ${graficoBarras(ind.categorias)}
        </div>
        <div class="painel">
          <h2>Por prioridade</h2>
          ${graficoBarras(ind.prioridades, 'barras--prioridade')}
          <h2 class="painel__subtitulo">Bairros com mais barreiras</h2>
          ${graficoBarras(ind.bairros)}
        </div>
      </div>
    </section>

    <section class="secao">
      <h2>Ocorrências cadastradas</h2>
      <form class="filtros" method="GET" action="/ocorrencias">
        <label>Categoria
          <select name="categoria"><option value="">Todas</option>${opcoes(CATEGORIAS, filtros.categoria)}</select>
        </label>
        <label>Prioridade
          <select name="prioridade"><option value="">Todas</option>${opcoes(PRIORIDADES, filtros.prioridade)}</select>
        </label>
        <button type="submit" class="botao botao--secundario">Filtrar</button>
        ${filtrando ? '<a class="link" href="/ocorrencias">Limpar filtros</a>' : ''}
      </form>
      <p class="contagem">Exibindo ${ocorrencias.length} de ${ind.total} ocorrência(s), mais recentes primeiro.</p>
      <div class="grade">${cartoes}</div>
    </section>`;

  return layout({ titulo: 'Ocorrências e indicadores', ativo: 'ocorrencias', conteudo });
}

function paginaErroValidacao(erros) {
  const conteudo = `
    <section class="secao secao--estreita">
      <div class="alerta alerta--erro" role="alert">
        <strong>Não foi possível registrar a ocorrência.</strong> Corrija os itens abaixo:
        <ul>${erros.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>
      </div>
      <a class="botao" href="/" onclick="history.back(); return false;">← Voltar e corrigir</a>
    </section>`;
  return layout({ titulo: 'Erro no cadastro', ativo: 'registrar', conteudo });
}

function paginaMensagem({ titulo, mensagem, codigo }) {
  const conteudo = `
    <section class="secao secao--estreita mensagem">
      ${codigo ? `<p class="mensagem__codigo">${codigo}</p>` : ''}
      <h1>${esc(titulo)}</h1>
      <p>${esc(mensagem)}</p>
      <p><a class="botao" href="/">Ir para o início</a> <a class="link" href="/ocorrencias">Ver ocorrências</a></p>
    </section>`;
  return layout({ titulo, conteudo });
}

module.exports = { paginaOcorrencias, paginaErroValidacao, paginaMensagem };
