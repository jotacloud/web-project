import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { generateSlug } from "../utils/generateSlug"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { BadRequest } from "../routes/errors/badRequests"

// Definindo o esquema de validação com Zod
const eventSchema = z.object({
  title: z.string().min(4),
  details: z.string().nullable(),
  maximumAttendees: z.number().int().positive().nullable(),
});


type EventBody = z.infer<typeof eventSchema>;

export async function createEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events', {
      schema: {
        summary: 'Create an event',
        tags: ['events'],
        body: eventSchema,
        response: {
          201: z.object({
            eventId: z.string().uuid(),
          }),
        },
      },
    }, async (request, reply) => {
      // Especificando o tipo do request.body
      const { title, details, maximumAttendees } = request.body as EventBody;

      const slug = generateSlug(title);

      const eventWithSameSlug = await prisma.event.findUnique({
        where: {
          slug,
        },
      });

      if (eventWithSameSlug !== null) {
        throw new BadRequest('Titulo já utilizado por outro evento!.');
      }

      const event = await prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug,
        },
      });

      return reply.status(201).send({ eventId: event.id });
    });
}
