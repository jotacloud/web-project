const router = require("express").Router();

// Import do Controller dos usuários.
const eventController = require("../controllers/eventController");

//middlewares
const verifyToken = require("../middlewares/verifyToken");

router.post("/create", verifyToken, eventController.createEvent);
router.get("/list/:eventId", eventController.getEvent);

module.exports = router;
