const Ocorrencia = require('../models/Ocorrencia');
const { CATEGORIAS, PRIORIDADES } = require('../config/opcoes');

// Converte o resultado de um $group em lista ordenada com rótulo e percentual,
// incluindo as opções que ainda não têm registros (quantidade 0).
function montarResumo(grupos, rotulos, total) {
  const contagem = Object.fromEntries(grupos.map((g) => [g._id, g.quantidade]));
  return Object.entries(rotulos)
    .map(([chave, rotulo]) => {
      const quantidade = contagem[chave] || 0;
      return {
        chave,
        rotulo,
        quantidade,
        percentual: total ? Math.round((quantidade / total) * 100) : 0
      };
    })
    .sort((a, b) => b.quantidade - a.quantidade);
}

async function calcularIndicadores() {
  const [total, porCategoria, porPrioridade, porBairro, emLocalSensivel] = await Promise.all([
    // Indicador 1: quantidade total de registros
    Ocorrencia.countDocuments(),

    // Indicador 2: resumo por categoria
    Ocorrencia.aggregate([{ $group: { _id: '$categoria', quantidade: { $sum: 1 } } }]),

    // Indicador 3: resumo por prioridade (calculada pela regra da equipe)
    Ocorrencia.aggregate([{ $group: { _id: '$prioridade', quantidade: { $sum: 1 } } }]),

    // Indicador 4: bairros com mais barreiras (top 5)
    Ocorrencia.aggregate([
      { $group: { _id: { $toLower: '$bairro' }, nome: { $first: '$bairro' }, quantidade: { $sum: 1 } } },
      { $sort: { quantidade: -1, nome: 1 } },
      { $limit: 5 }
    ]),

    // Indicador 5: barreiras perto de escola, hospital, UBS ou ponto de ônibus
    Ocorrencia.countDocuments({ localSensivel: true })
  ]);

  const prioridades = montarResumo(porPrioridade, PRIORIDADES, total);
  // Para prioridade, a ordem fixa (alta > média > baixa) é mais legível que por quantidade
  prioridades.sort((a, b) => Object.keys(PRIORIDADES).indexOf(a.chave) - Object.keys(PRIORIDADES).indexOf(b.chave));

  return {
    total,
    altaPrioridade: prioridades.find((p) => p.chave === 'alta').quantidade,
    emLocalSensivel,
    percentualLocalSensivel: total ? Math.round((emLocalSensivel / total) * 100) : 0,
    categorias: montarResumo(porCategoria, CATEGORIAS, total),
    prioridades,
    bairros: porBairro.map((b) => ({
      rotulo: b.nome,
      quantidade: b.quantidade,
      percentual: total ? Math.round((b.quantidade / total) * 100) : 0
    }))
  };
}

module.exports = { calcularIndicadores };
