const getToken = require("../helpers/getToken");
const sendError = require("../helpers/errorHelper");
const getUserByToken = require("../helpers/getUserByToken");
const isValidEmail = require("../helpers/isValidEmail");
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
          attendeesAmount: event._count.participants,
        },
      });
    } catch (error) {
      console.error("Erro ao buscar evento:", error);
      return res
        .status(500)
        .json({ error: "Erro ao buscar o evento", details: error.message });
    }
  }
  static async getEventAttendees(req, res) {
    const { eventId } = req.params;
    const { pageIndex = 0, query } = req.query;
    try {
      const [attendees, total] = await Promise.all([
        prisma.prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            checkIn: {
              select: {
                createdAt: true,
              },
            },
          },
          where: {
            participatedEvents: {
              some: {
                id: eventId,
              },
            },
            ...(query
              ? {
                  name: {
                    contains: query,
                  },
                }
              : {}),
          },
          take: 10,
          skip: pageIndex * 10,
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.prisma.user.count({
          where: {
            participatedEvents: {
              some: {
                id: eventId, // Filtra pelos eventos que o usuário participou
              },
            },
            ...(query
              ? {
                  name: {
                    contains: query,
                  },
                }
              : {}),
          },
        }),
      ]);

      return res.status(200).json({
        attendees: attendees.map((attendee) => ({
          id: attendee.id,
          name: attendee.name,
          email: attendee.email,
          createdAt: attendee.createdAt,
          checkedInAt: attendee.checkIn?.createdAt ?? null,
        })),
        total,
      });
    } catch (error) {
      console.error("Erro ao buscar participantes:", error);
      return res.status(500).json({
        error: "Erro ao buscar participantes",
        details: error.message,
      });
    }
  }
  static async registerForEvent(req, res) {
    const { eventId } = req.params;
    const { name, email } = req.body;

    try {
      const user = await prisma.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(422).json({ error: "Usuário não cadstrado" });
      }

      console.log(user);

      const existingRegistration = await prisma.prisma.event.findFirst({
        where: {
          id: eventId,
          participants: {
            some: {
              id: user.id,
            },
          },
        },
      });

      if (existingRegistration) {
        return res.status(400).json({
          error: "Este e-mail já está registrado para este evento.",
        });
      }

      const [event, totalAttendees] = await Promise.all([
        prisma.prisma.event.findUnique({
          where: { id: eventId },
        }),
        prisma.prisma.user.count({
          where: {
            participatedEvents: {
              some: {
                id: eventId,
              },
            },
          },
        }),
      ]);

      if (!event) {
        return res.status(404).json({ error: "Evento não encontrado." });
      }

      if (event.maximumAttendees && totalAttendees >= event.maximumAttendees) {
        return res.status(400).json({
          error:
            "O número máximo de participantes para este evento foi atingido.",
        });
      }

      await prisma.prisma.event.update({
        where: { id: eventId },
        data: {
          participants: {
            connect: { id: user.id },
          },
        },
      });

      console.log("Evento atualizado:", updateEvent);

      return res.status(201).json({ attendeeId: user.id });
    } catch (error) {
      console.error("Erro ao cadastrar participante:", error);
      return res.status(500).json({
        error: "Erro ao cadastrar participante.",
        details: error.message,
      });
    }
  }
  static async checkIn(req, res) {
    const { userId } = req.params;

    const userCheckIn = await prisma.prisma.checkIn.findUnique({
      where: {
        userId:parseInt(userId,10),
      },
    });

    if(userCheckIn !== null) {
      return res.status(422).json({ error: "Usuário já fez check-in" }); 
    }

    await prisma.prisma.checkIn.create({
      data:{
        userId: parseInt(userId,10),
      }
    })

    return res.status(201).send()
  }
};
