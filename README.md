# Calçada Livre

Protótipo da Global Solution 2026.2 de Application Development (desafio CitizenTech).

**Integrantes:**

| Nome | RM |
|---|---|
| Pedro Luis Tofoli | 564441 |
| Raphael Talarico Nascimento Silva | 565219 |
| Nelson Troccoli Santos Neto | 562815 |

**Vídeo pitch:** _colar o link do YouTube aqui_

## Problema

Buracos, falta de rampa, piso tátil quebrado, obstáculos e semáforos sem sinal sonoro
tornam as calçadas perigosas ou intransponíveis para quem usa cadeira de rodas, tem
deficiência visual ou mobilidade reduzida. Essas barreiras não são registradas de forma
organizada, então os reparos não seguem um critério de urgência.

**Público-alvo:** pessoas com deficiência, idosos e pessoas com mobilidade reduzida (que se
beneficiam); moradores que registram as barreiras; gestores públicos e subprefeituras que
usam os dados para decidir onde agir primeiro.

**Objetivo:** registrar barreiras de acessibilidade com local, categoria e gravidade,
classificar cada uma por prioridade e mostrar quais problemas e bairros mais se repetem.

## ODS relacionados

- **ODS 11: Cidades e comunidades sustentáveis**, metas 11.2 (transporte acessível) e 11.7
  (espaços públicos seguros, inclusivos e acessíveis).
- **ODS 10: Redução das desigualdades**, meta 10.2 (inclusão de todas as pessoas).

## Tecnologias

HTML, CSS, JavaScript, Node.js, Express e MongoDB (com Mongoose).

## Como executar

Pré-requisitos: Node.js 18 ou superior e MongoDB rodando em `mongodb://127.0.0.1:27017`.

```bash
npm install
```

```bash
npm start
```

Abra http://localhost:3000.

Para carregar 10 ocorrências de exemplo antes da demonstração (apaga as que já existem):

```bash
npm run seed
```

Para usar outro endereço do MongoDB (por exemplo, MongoDB Atlas), defina a variável
`MONGODB_URI` antes de iniciar. No PowerShell: `$env:MONGODB_URI="mongodb+srv://..."; npm start`.

## Rotas

| Método | Rota | O que faz |
|---|---|---|
| GET | `/` | Introdução (problema, público, objetivo, ODS) e formulário de cadastro |
| POST | `/ocorrencias` | Recebe o formulário, valida os campos, calcula a prioridade e salva no MongoDB |
| GET | `/ocorrencias` | Indicadores e lista dos registros; aceita filtros `?categoria=` e `?prioridade=` |
| GET | `/api/ocorrencias` | Mesmos registros em JSON |
| GET | `/api/indicadores` | Indicadores em JSON |
| qualquer outra | | Página 404 |

Mensagens: depois de salvar, o sistema mostra uma confirmação com a prioridade calculada.
Se algum campo for inválido, mostra a lista de erros (status 400) e um botão para voltar
ao formulário com os dados preenchidos.

## Campos de cada registro (coleção `ocorrencias`)

`categoria`, `descricao`, `endereco`, `bairro`, `gravidade`, `publicoAfetado`,
`localSensivel` (perto de escola, hospital, UBS ou ponto de ônibus), mais os campos
calculados `pontuacao`, `prioridade` e as datas `createdAt` / `updatedAt`.

## Indicadores

1. **Total de ocorrências:** `countDocuments()` na coleção.
2. **Resumo por categoria:** `$group` por `categoria`, com quantidade e percentual de cada uma.
   Mostra qual tipo de barreira é mais comum.
3. **Resumo por prioridade:** `$group` por `prioridade`. A prioridade é calculada pela regra abaixo.
4. **Bairros com mais barreiras:** top 5 bairros por quantidade, para orientar onde agir.
5. **Barreiras perto de locais sensíveis:** quantidade e percentual com `localSensivel = true`.

### Regra de prioridade

O servidor soma pontos (arquivo `src/utils/prioridade.js`):

- gravidade **leve = 1**, **moderada = 2**, **grave = 4**
- **+2** se a barreira fica perto de escola, hospital, UBS ou ponto de ônibus

| Pontuação | Prioridade |
|---|---|
| 4 ou mais | Alta |
| 2 a 3 | Média |
| 1 | Baixa |

Toda barreira grave já é prioridade alta, e uma barreira moderada sobe para alta quando
está num local com muita circulação de pessoas vulneráveis.

## Estrutura

```
server.js                  inicia o Express, 404 e tratamento de erros
public/index.html          introdução + formulário
public/css/style.css       estilos
src/db.js                  conexão com o MongoDB
src/models/Ocorrencia.js   schema da coleção "ocorrencias"
src/routes/ocorrencias.js  rotas GET e POST
src/utils/validacao.js     validação dos campos do formulário
src/utils/prioridade.js    regra de classificação
src/utils/indicadores.js   consultas de agregação dos indicadores
src/views/                 HTML gerado no servidor (lista, erros, 404)
scripts/seed.js            dados de exemplo
```

## Entrega

Gere o .zip **sem** a pasta `node_modules`. No PowerShell, dentro da pasta do projeto:

```powershell
Compress-Archive -Path server.js,package.json,package-lock.json,README.md,public,src,scripts -DestinationPath calcada-livre.zip -Force
```
