import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform, ZodTypeProvider } from 'fastify-type-provider-zod'
const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
    origin: '*',
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

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
