const express = require('express');
const mongoose = require('mongoose');
const Ocorrencia = require('../models/Ocorrencia');
const { CATEGORIAS, PRIORIDADES } = require('../config/opcoes');
const { validarOcorrencia } = require('../utils/validacao');
const { calcularPrioridade } = require('../utils/prioridade');
const { calcularIndicadores } = require('../utils/indicadores');
const { paginaOcorrencias, paginaErroValidacao } = require('../views/paginas');

const router = express.Router();

// Monta o filtro do MongoDB a partir da query string (?categoria=...&prioridade=...)
function lerFiltros(query) {
  const filtros = {
    categoria: CATEGORIAS[query.categoria] ? query.categoria : '',
    prioridade: PRIORIDADES[query.prioridade] ? query.prioridade : ''
  };
  const consulta = {};
  if (filtros.categoria) consulta.categoria = filtros.categoria;
  if (filtros.prioridade) consulta.prioridade = filtros.prioridade;
  return { filtros, consulta };
}

// POST /ocorrencias -> recebe o formulário, valida, classifica e salva
router.post('/ocorrencias', async (req, res, next) => {
  try {
    const { dados, erros } = validarOcorrencia(req.body);
    if (erros.length) {
      return res.status(400).send(paginaErroValidacao(erros));
    }

    const { pontuacao, prioridade } = calcularPrioridade(dados.gravidade, dados.localSensivel);
    const nova = await Ocorrencia.create({ ...dados, pontuacao, prioridade });

    // Padrão Post/Redirect/Get: evita cadastro duplicado ao atualizar a página
    res.redirect(303, `/ocorrencias?nova=${nova._id}`);
  } catch (erro) {
    if (erro instanceof mongoose.Error.ValidationError) {
      return res.status(400).send(paginaErroValidacao(Object.values(erro.errors).map((e) => e.message)));
    }
    next(erro);
  }
});

// GET /ocorrencias -> lista os registros + indicadores
router.get('/ocorrencias', async (req, res, next) => {
  try {
    const { filtros, consulta } = lerFiltros(req.query);

    const [ocorrencias, indicadores, nova] = await Promise.all([
      Ocorrencia.find(consulta).sort({ createdAt: -1 }).lean(),
      calcularIndicadores(),
      mongoose.isValidObjectId(req.query.nova) ? Ocorrencia.findById(req.query.nova).lean() : null
    ]);

    res.send(paginaOcorrencias({ ocorrencias, indicadores, filtros, nova }));
  } catch (erro) {
    next(erro);
  }
});

// Versões em JSON (úteis para testar no navegador ou no Postman/Insomnia)
router.get('/api/ocorrencias', async (req, res, next) => {
  try {
    const { consulta } = lerFiltros(req.query);
    res.json(await Ocorrencia.find(consulta).sort({ createdAt: -1 }).lean());
  } catch (erro) {
    next(erro);
  }
});

router.get('/api/indicadores', async (req, res, next) => {
  try {
    res.json(await calcularIndicadores());
  } catch (erro) {
    next(erro);
  }
});

module.exports = router;
