// Listas fixas usadas no formulário, na validação e nos indicadores.
// Manter tudo em um só lugar evita divergência entre front e back.

const CATEGORIAS = {
  'calcada-danificada': 'Calçada danificada ou esburacada',
  'falta-rampa': 'Falta de rampa de acesso',
  'piso-tatil': 'Piso tátil ausente ou danificado',
  'obstaculo': 'Obstáculo na calçada',
  'semaforo': 'Semáforo sem sinal sonoro',
  'transporte': 'Ponto de ônibus / transporte inacessível',
  'outro': 'Outro'
};

const GRAVIDADES = {
  leve: 'Leve (dificulta a passagem)',
  moderada: 'Moderada (exige desvio)',
  grave: 'Grave (impede a passagem / risco de queda)'
};

const PUBLICOS = {
  'cadeirantes': 'Pessoas em cadeira de rodas',
  'deficiencia-visual': 'Pessoas com deficiência visual',
  'idosos': 'Pessoas idosas',
  'mobilidade-reduzida': 'Mobilidade reduzida (gestantes, carrinhos, muletas)',
  'todos': 'Todos os pedestres'
};

const PRIORIDADES = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa'
};

module.exports = { CATEGORIAS, GRAVIDADES, PUBLICOS, PRIORIDADES };
