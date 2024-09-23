const getToken = require("../helpers/getToken");
const sendError = require("../helpers/errorHelper");
const getUserByToken = require("../helpers/getUserByToken");
const prisma = require("../libs/prisma");
const generateSlug = require("../utils/generateSlug");

module.exports = class eventController {
  static async createEvent(req, res) {
    const { title, details, maximumAttendees } = req.body;

    if (!title) {
      return res.status(422).json({ error: "O título é obrigatório" });
    }
    if (!details) {
      return res.status(422).json({ error: "A descrição é obrigatória" });
    }
    if (!maximumAttendees) {
      return res
        .status(422)
        .json({ error: "O número máximo de participantes é obrigatório" });
    }

    try {
      const token = getToken(req);
      const user = await getUserByToken(token);
      const slug = generateSlug(title);

      // Verificar se já existe um evento com o mesmo slug
      const eventWithSameSlug = await prisma.prisma.event.findUnique({
        where: {
          slug,
        },
      });

      if (eventWithSameSlug !== null) {
        return res
          .status(400)
          .json({ error: "Outro evento com o mesmo título já existe." });
      }

      // Criar o evento
      const event = await prisma.prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug,
          createdById: user.id, 
          participants: {
            connect: { id: user.id }, 
          },
        },
      });

      return res.status(201).json({ eventId: event.id, slug: event.slug }); // Retornar apenas o eventId
    } catch (error) {
      console.error("Erro ao criar evento:", error); // Logando o erro no console
      return res
        .status(500)
        .json({ error: "Erro ao criar o evento", details: error.message });
    }
  }
  static async getEvent(req, res) {
    const { eventId } = req.params;
    try {
      const event = await prisma.prisma.event.findUnique({
        select: {
          id: true,
          title: true,
          slug: true,
          details: true,
          maximumAttendees: true,
          _count: {
            select: {
              participants: true,
            },
          },
        },
        where: {
          id: eventId,
        },
      });

      if (event === null) {
        return res.status(400).json({ error: "Evento não encontrado." });
      }

      return res.status(200).json({
        event: {
          id: event.id,
          title: event.title,
          slug: event.slug,
          details: event.details,
          maximumAttendees: event.maximumAttendees,
          attendeesAmount: event._count.attendees,
        },
      });
    } catch (error) {
      console.error("Erro ao buscar evento:", error);
      return res
        .status(500)
        .json({ error: "Erro ao buscar o evento", details: error.message });
    }
  }
};
