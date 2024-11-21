const express = require('express');

const app = express();

// Essa linha faz o servidor disponibilizar o acesso às imagens via URL!
app.use(express.static('src/uploads'));

// Não remover esse end-point, ele é necessário para o avaliador
app.get('/', (request, response) => {
  response.send();
});
// Não remover esse end-point, ele é necessário para o avaliador

module.exports = app;
