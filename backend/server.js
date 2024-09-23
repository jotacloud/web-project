const express = require('express');
const http = require('http');
const app = express();

// Configuração para o retorno de JSON.
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');

//Rotas
app.use('/users', userRoutes);
app.use('/events', eventRoutes);

const start = async () => {

    //Inicialização do servidor http.
    const server = http.createServer(app);

    server.listen(5000, () => {
        console.log('Escutando na porta 5000!');
      });
}

start()