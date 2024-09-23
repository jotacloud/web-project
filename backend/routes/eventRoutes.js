const router = require('express').Router();

// Import do Controller dos usuários.
const eventController = require('../controllers/eventController');

//middlewares
const verifyToken = require('../middlewares/verifyToken');

router.post('/events', verifyToken, eventController.createEvent);

module.exports = router;