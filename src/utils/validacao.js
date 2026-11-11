const { CATEGORIAS, GRAVIDADES, PUBLICOS } = require('../config/opcoes');

function texto(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

// Recebe o req.body do formulário e devolve { dados, erros }.
// "dados" já vem limpo (trim, checkbox convertido em booleano).
function validarOcorrencia(body = {}) {
  const dados = {
    categoria: texto(body.categoria),
    descricao: texto(body.descricao),
    endereco: texto(body.endereco),
    bairro: texto(body.bairro),
    gravidade: texto(body.gravidade),
    publicoAfetado: texto(body.publicoAfetado),
    localSensivel: body.localSensivel === 'on' || body.localSensivel === 'true' || body.localSensivel === true
  };

  const erros = [];

  if (!CATEGORIAS[dados.categoria]) erros.push('Selecione uma categoria válida.');

  if (dados.descricao.length < 10) erros.push('A descrição precisa ter pelo menos 10 caracteres.');
  else if (dados.descricao.length > 500) erros.push('A descrição pode ter no máximo 500 caracteres.');

  if (dados.endereco.length < 5) erros.push('Informe o endereço ou ponto de referência (mínimo 5 caracteres).');
  else if (dados.endereco.length > 150) erros.push('O endereço pode ter no máximo 150 caracteres.');

  if (dados.bairro.length < 2) erros.push('Informe o bairro.');
  else if (dados.bairro.length > 60) erros.push('O bairro pode ter no máximo 60 caracteres.');

  if (!GRAVIDADES[dados.gravidade]) erros.push('Selecione a gravidade da barreira.');
  if (!PUBLICOS[dados.publicoAfetado]) erros.push('Selecione o público mais afetado.');

  return { dados, erros };
}

module.exports = { validarOcorrencia };
