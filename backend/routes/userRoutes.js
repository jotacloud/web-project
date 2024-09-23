const router = require('express').Router();

// Import do Controller dos usuários.
const userController = require('../controllers/userController');

//middlewares
const verifyToken = require('../middlewares/verifyToken');

// Rota para registrar um usuário.
router.post('/register', userController.register);

// Rota para realizar o login de um usuário.
router.post('/login', userController.login);

// Rota para verificar se um usuário está autenticado.
router.get('/checkUser', userController.checkUser);

// Rota para retornar o usuario pelo id
router.get('/:id', userController.getUserById);

// Rota para atualização dos usuarios
router.patch('/edit/:id', verifyToken, userController.editUser);

// Exporta o router para uso em outros módulos.
module.exports = router;