const express = require('express');
const http = require('http');
const app = express();

// Configuração para o retorno de JSON.
app.use(express.json());

const userRoutes = require('./routes/userRoutes');

//Rotas
app.use('/users', userRoutes);

const start = async () => {

    //Inicialização do servidor http.
    const server = http.createServer(app);

    server.listen(5000, () => {
        console.log('Escutando na porta 5000!');
      });
}

start()