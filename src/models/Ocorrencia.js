const mongoose = require('mongoose');
const { CATEGORIAS, GRAVIDADES, PUBLICOS, PRIORIDADES } = require('../config/opcoes');

// Coleção "ocorrencias": cada documento é uma barreira de acessibilidade relatada.
const ocorrenciaSchema = new mongoose.Schema(
  {
    categoria: { type: String, required: true, enum: Object.keys(CATEGORIAS) },
    descricao: { type: String, required: true, trim: true, minlength: 10, maxlength: 500 },
    endereco: { type: String, required: true, trim: true, minlength: 5, maxlength: 150 },
    bairro: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    gravidade: { type: String, required: true, enum: Object.keys(GRAVIDADES) },
    publicoAfetado: { type: String, required: true, enum: Object.keys(PUBLICOS) },
    localSensivel: { type: Boolean, default: false }, // perto de escola, hospital, UBS ou ponto de ônibus

    // Campos calculados pelo servidor (regra em utils/prioridade.js)
    pontuacao: { type: Number, required: true },
    prioridade: { type: String, required: true, enum: Object.keys(PRIORIDADES) }
  },
  { timestamps: true } // cria createdAt e updatedAt
);

module.exports = mongoose.model('Ocorrencia', ocorrenciaSchema, 'ocorrencias');
