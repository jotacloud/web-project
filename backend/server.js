const express = require('express');
const http = require('http');
const mongoose = require('./database/connection')
const app = express();

// Configuração para o retorno de JSON.
app.use(express.json());

//const rotas = require('./routes/rotas');

//Rotas
//app.use('/rotas', rotas);

const start = async () => {

    //Inicialização do banco de dados.
    await mongoose.connection;

    //Inicialização do servidor http.
    const server = http.createServer(app);

    server.listen(5000, () => {
        console.log('Escutando na porta 5000!');
      });
}

start()