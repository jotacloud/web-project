const express = require('express');
const http = require('http');
const mongoose = require('./database/connection')
const app = express();

app.use(express.json());

const start = async () => {
    await mongoose.connection;
    const server = http.createServer(app);

    server.listen(5000, () => {
        console.log('Escutando na porta 5000!');
      });
}

start()