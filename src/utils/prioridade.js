// Regra de classificação definida pela equipe:
//
//   pontos da gravidade:  leve = 1 | moderada = 2 | grave = 4
//   + 2 pontos se a barreira está perto de escola, hospital, UBS ou ponto de ônibus
//
//   pontuação >= 4  -> prioridade ALTA
//   pontuação 2 a 3 -> prioridade MÉDIA
//   pontuação 1     -> prioridade BAIXA
//
// Assim, toda barreira grave já é alta, e uma moderada vira alta quando
// fica num local de grande circulação de pessoas vulneráveis.

const PESO_GRAVIDADE = { leve: 1, moderada: 2, grave: 4 };
const BONUS_LOCAL_SENSIVEL = 2;

function calcularPrioridade(gravidade, localSensivel) {
  const pontuacao = (PESO_GRAVIDADE[gravidade] || 0) + (localSensivel ? BONUS_LOCAL_SENSIVEL : 0);

  let prioridade = 'baixa';
  if (pontuacao >= 4) prioridade = 'alta';
  else if (pontuacao >= 2) prioridade = 'media';

  return { pontuacao, prioridade };
}

module.exports = { calcularPrioridade, PESO_GRAVIDADE, BONUS_LOCAL_SENSIVEL };
