import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./errors/badRequests";

export async function getEvento(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .get('/events/:eventId', {
        schema: {
          summary: 'Get an event',
          tags: ['events'],
          params: z.object({
            eventoId: z.string().uuid(),
          }),
          response: {
            200: z.object({
              evento: z.object({
                id: z.string().uuid(),
                titulo: z.string(),
                slug: z.string(),
                detalhes: z.string().nullable(),
                maxParticipantes: z.number().int().nullable(),
                qtdParticipantes: z.number().int(),
              })
            }),
          },
        }
      }, async (request, reply) => {
        const { eventoId } = request.params
  
        const evento = await prisma.evento.findUnique({
          select: {
            id: true,
            titulo: true,
            slug: true,
            detalhes: true,
            maxParticipantes: true,
            _count: {
              select: {
                participantes: true,
              }
            },
          },
          where: {
            id: eventoId,
          }
        })
  
        if (evento === null) {
          throw new BadRequest('Event not found.')
        }
  
        return reply.send({ 
          event: {
            id: evento.id,
            title: evento.titulo,
            slug: evento.slug,
            details: evento.detalhes,
            maximumAttendees: evento.maxParticipantes,
            attendeesAmount: evento._count.participantes,
          },
        })
      })
  }