const getToken = require("../helpers/getToken");
const sendError = require("../helpers/errorHelper");
const getUserByToken = require("../helpers/getUserByToken");
const prisma = require("../libs/prisma"); // Supondo que o prisma client seja inicializado aqui
const generateSlug = require('../utils/generateSlug');

module.exports = class eventController {
  static async createEvent(req, res) {
    const { title, details, maximumAttendees } = req.body;

    if (!title) {
      return res.status(422).json({ error: "O título é obrigatório" });
    }
    if (!details) {
      return res.status(422).json({ error: "A descrição é obrigatória" });
    }

    try {
      const token = getToken(req);
      const user = await getUserByToken(token);

      const slug = generateSlug(title);

      // Verificar se já existe um evento com o mesmo slug
      const eventWithSameSlug = await prisma.event.findUnique({
        where: {
          slug,
        },
      });

      if (eventWithSameSlug !== null) {
        return res.status(400).json({ error: "Outro evento com o mesmo título já existe." });
      }

      // Criar o evento
      const event = await prisma.prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug,
          createdById: user.id, // ID do usuário criador
          participants: {
            connect: { id: user.id }, // Relacionando o criador como participante também, se necessário
          },
        },
      });

      return res.status(201).json({ eventId: event.id }); // Retornar apenas o eventId
    } catch (error) {
      return res.status(500).json({ error: "Erro ao criar o evento" });
    }
  }
};
