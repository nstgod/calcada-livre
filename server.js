const path = require('path');
const express = require('express');
const { conectar, MONGODB_URI } = require('./src/db');
const rotasOcorrencias = require('./src/routes/ocorrencias');
const { paginaMensagem } = require('./src/views/paginas');

const app = express();
const PORT = process.env.PORT || 3000;

// Lê os campos enviados por formulários HTML (application/x-www-form-urlencoded) e JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// GET / -> public/index.html (introdução + formulário) e arquivos de CSS
app.use(express.static(path.join(__dirname, 'public')));

// GET e POST /ocorrencias, GET /api/...
app.use(rotasOcorrencias);

// 404: nenhuma rota acima respondeu
app.use((req, res) => {
  res.status(404).send(paginaMensagem({
    codigo: 404,
    titulo: 'Página não encontrada',
    mensagem: `O endereço "${req.originalUrl}" não existe neste sistema.`
  }));
});

// 500: erro inesperado (ex.: banco fora do ar)
app.use((erro, req, res, next) => {
  console.error(erro);
  res.status(500).send(paginaMensagem({
    codigo: 500,
    titulo: 'Erro no servidor',
    mensagem: 'Algo deu errado ao processar sua solicitação. Tente novamente em instantes.'
  }));
});

conectar()
  .then(() => {
    app.listen(PORT, () => console.log(`Calçada Livre rodando em http://localhost:${PORT}`));
  })
  .catch((erro) => {
    console.error(`Não foi possível conectar ao MongoDB em ${MONGODB_URI}.`);
    console.error('Verifique se o MongoDB está em execução (serviço "MongoDB" no Windows ou "mongod").');
    console.error(erro.message);
    process.exit(1);
  });
