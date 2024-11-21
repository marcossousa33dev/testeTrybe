const routes = require('./routes');
const app = require('./app');
const express = require('express');

app.use(express.json());
app.use('/', routes);

const PORT = 3000;

app.listen(PORT, () => console.log(`conectado na porta ${PORT}`));
