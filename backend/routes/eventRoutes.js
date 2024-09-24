const router = require("express").Router();

// Import do Controller dos usuários.
const eventController = require("../controllers/eventController");

//middlewares
const verifyToken = require("../middlewares/verifyToken");

router.post("/create", verifyToken, eventController.createEvent);
router.get("/listar/:eventId", eventController.getEvent);
router.get("/listar/:eventId/participantes", eventController.getEventAttendees);
router.post("/adicionar/:eventId/participantes", verifyToken, eventController.registerForEvent);

module.exports = router;
