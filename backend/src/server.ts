import fastify from "fastify";
import fastifyCors from "@fastify/cors";

const app = fastify();

app.register(fastifyCors, {
    origin: '*',
});

// Adicionando uma rota
app.get('/hello', async (request, reply) => {
    return { message: 'Hello, World!' };
});

app.listen({ port: 5000 }, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('Servidor está executando na porta 5000');
});
