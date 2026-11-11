# Roteiro do vídeo pitch (2 a 3 minutos)

Antes de gravar: `npm run seed` e `npm start`, deixe abertos o navegador em
http://localhost:3000 e o VS Code com os arquivos citados abaixo.

## 1. Contexto (0:00 a 0:40) — tela: página inicial

> "Para quem usa cadeira de rodas ou tem deficiência visual, um buraco na calçada ou uma
> esquina sem rampa pode impedir o caminho até a escola, o posto de saúde ou o ponto de
> ônibus. Essas barreiras não são registradas de forma organizada, então os reparos não
> seguem nenhuma ordem de urgência.
>
> O Calçada Livre permite que qualquer morador registre essas barreiras e transforma os
> registros em indicadores para a prefeitura decidir onde agir primeiro. O público
> beneficiado são pessoas com deficiência, idosos e pessoas com mobilidade reduzida. O
> projeto se relaciona com o ODS 11, cidades sustentáveis e acessíveis, e com o ODS 10,
> redução das desigualdades."

## 2. Demonstração (0:40 a 1:50)

1. **Erro de validação (10 s):** preencha só a categoria, apague o `required` pelo
   DevTools ou envie com descrição curta e mostre a página de erros. Fale: "o servidor
   valida tudo de novo, mesmo que alguém burle o formulário." (Opcional: pode pular.)
2. **Cadastro (30 s):** registre "Calçada sem rampa em frente ao hospital", gravidade
   moderada, marque "perto de escola, hospital, UBS ou ponto de ônibus". Mostre a mensagem
   de confirmação: 2 + 2 = 4 pontos, prioridade **alta**, e o cartão destacado na lista.
3. **Indicadores (20 s):** mostre o total, quantas são de prioridade alta, o gráfico por
   categoria, por prioridade e os bairros com mais barreiras.
4. **Consulta (10 s):** filtre por prioridade "Alta" e depois por uma categoria.
5. **404 (5 s):** acesse http://localhost:3000/qualquer-coisa.

## 3. Código (1:50 a 2:50) — tela: VS Code

- `server.js`: "Express com `urlencoded` para ler o formulário, arquivos estáticos,
  as rotas e, no fim, o middleware de 404 e o de erro 500."
- `src/routes/ocorrencias.js`: "O POST valida, calcula a prioridade, salva com
  `Ocorrencia.create` e redireciona. O GET busca os registros com `find` e os indicadores."
- `src/utils/prioridade.js`: "Nossa regra: leve 1, moderada 2, grave 4, mais 2 pontos
  perto de locais sensíveis. Quatro ou mais é alta."
- `src/utils/indicadores.js`: "Os indicadores usam `countDocuments` e `aggregate` com
  `$group` por categoria, prioridade e bairro."
- `src/models/Ocorrencia.js`: "O schema do Mongoose define os campos e também valida."

## 4. Fechamento (2:50 a 3:00)

> "Com poucos dados, o Calçada Livre já mostra onde estão as barreiras mais urgentes.
> Obrigado!"
