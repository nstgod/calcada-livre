// Funções que geram HTML no servidor (sem template engine, só template strings).

// Escapa texto digitado pelo usuário antes de colocar no HTML (evita XSS).
function esc(valor) {
  return String(valor ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function layout({ titulo, ativo = '', conteudo }) {
  const link = (href, nome, chave) =>
    `<a href="${href}"${ativo === chave ? ' aria-current="page"' : ''}>${nome}</a>`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(titulo)} | Calçada Livre</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <header class="topo">
    <div class="container topo__conteudo">
      <a class="marca" href="/"><span class="marca__icone" aria-hidden="true">♿</span> Calçada Livre</a>
      <nav class="menu">
        ${link('/', 'Registrar', 'registrar')}
        ${link('/ocorrencias', 'Ocorrências e indicadores', 'ocorrencias')}
      </nav>
    </div>
  </header>
  <main class="container">
    ${conteudo}
  </main>
  <footer class="rodape">
    <div class="container">Calçada Livre · Global Solution 2026.2 · CitizenTech · ODS 11 e ODS 10<br>
      Pedro Luis Tofoli (RM 564441) · Raphael Talarico Nascimento Silva (RM 565219) · Nelson Troccoli Santos Neto (RM 562815)</div>
  </footer>
</body>
</html>`;
}

module.exports = { layout, esc };
