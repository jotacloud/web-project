import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'

//Import de rotas
import { getEvent } from "../src/routes/getEvento";
import { createEvent } from "../src/routes/createEvento";

const app = fastify().withTypeProvider<ZodTypeProvider>();

//CORS deve ser ajustado na hora do deploy.
app.register(fastifyCors, {
    origin: '*',
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

//Rota da sorte
app.get('/hello', async (request, reply) => {
    return { message: 'Hello, World!' };
});

//Rotas
app.register(getEvent)
app.register(createEvent)

//Init da api
app.listen({ port: 5000 }, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('Servidor está executando na porta 5000');
});
