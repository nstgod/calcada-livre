// Popula o banco com ocorrências de exemplo para a demonstração.
// Uso: npm run seed   (apaga os registros atuais da coleção "ocorrencias")

const mongoose = require('mongoose');
const { conectar } = require('../src/db');
const Ocorrencia = require('../src/models/Ocorrencia');
const { calcularPrioridade } = require('../src/utils/prioridade');

const exemplos = [
  { categoria: 'calcada-danificada', descricao: 'Buraco grande na calçada em frente à escola, cadeirantes precisam descer para a rua.', endereco: 'Rua Vergueiro, 1500', bairro: 'Vila Mariana', gravidade: 'grave', publicoAfetado: 'cadeirantes', localSensivel: true },
  { categoria: 'falta-rampa', descricao: 'Esquina sem rebaixamento de guia nos dois lados da faixa de pedestres.', endereco: 'Av. Paulista x Rua Pamplona', bairro: 'Bela Vista', gravidade: 'moderada', publicoAfetado: 'cadeirantes', localSensivel: false },
  { categoria: 'piso-tatil', descricao: 'Piso tátil arrancado em trecho de 20 metros perto da estação.', endereco: 'Rua Domingos de Morais, 300', bairro: 'Vila Mariana', gravidade: 'moderada', publicoAfetado: 'deficiencia-visual', localSensivel: true },
  { categoria: 'obstaculo', descricao: 'Carros estacionados sobre a calçada todos os dias no horário comercial.', endereco: 'Rua Augusta, 900', bairro: 'Consolação', gravidade: 'moderada', publicoAfetado: 'todos', localSensivel: false },
  { categoria: 'semaforo', descricao: 'Semáforo de pedestres sem sinal sonoro em cruzamento movimentado.', endereco: 'Av. Rebouças x Av. Brasil', bairro: 'Pinheiros', gravidade: 'grave', publicoAfetado: 'deficiencia-visual', localSensivel: false },
  { categoria: 'transporte', descricao: 'Ponto de ônibus sem abrigo e com degrau alto, idosos têm dificuldade para embarcar.', endereco: 'Rua Teodoro Sampaio, 2000', bairro: 'Pinheiros', gravidade: 'leve', publicoAfetado: 'idosos', localSensivel: true },
  { categoria: 'calcada-danificada', descricao: 'Raízes de árvore levantaram o piso, há desníveis de 10 cm.', endereco: 'Rua Cardeal Arcoverde, 450', bairro: 'Pinheiros', gravidade: 'leve', publicoAfetado: 'mobilidade-reduzida', localSensivel: false },
  { categoria: 'obstaculo', descricao: 'Lixeira e poste no meio da calçada estreita deixam menos de 60 cm livres.', endereco: 'Rua da Consolação, 1200', bairro: 'Consolação', gravidade: 'moderada', publicoAfetado: 'cadeirantes', localSensivel: true },
  { categoria: 'falta-rampa', descricao: 'Entrada da UBS só tem escada, sem rampa ou elevador.', endereco: 'Rua Loefgren, 2000', bairro: 'Vila Mariana', gravidade: 'grave', publicoAfetado: 'cadeirantes', localSensivel: true },
  { categoria: 'outro', descricao: 'Calçada sem iluminação à noite, pessoas idosas evitam passar pelo trecho.', endereco: 'Rua Bela Cintra, 100', bairro: 'Consolação', gravidade: 'leve', publicoAfetado: 'idosos', localSensivel: false }
];

async function main() {
  await conectar();
  await Ocorrencia.deleteMany({});
  const docs = exemplos.map((e) => ({ ...e, ...calcularPrioridade(e.gravidade, e.localSensivel) }));
  await Ocorrencia.insertMany(docs);
  console.log(`${docs.length} ocorrências de exemplo inseridas.`);
  await mongoose.disconnect();
}

main().catch((erro) => {
  console.error('Erro ao popular o banco:', erro.message);
  process.exit(1);
});
