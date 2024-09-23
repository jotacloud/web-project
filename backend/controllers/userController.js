const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const prisma = require('../libs/prisma');

const createUserToken = require('../helpers/createUserToken');
const getToken = require('../helpers/getToken');
const sendError = require('../helpers/errorHelper');
const getUserByToken = require('../helpers/getUserByToken');

const errorMessages = require('../utils/errorMessages');
const isValidEmail = require('../helpers/isValidEmail');

module.exports = class userController {
    static async register(req, res) {
        const { name, email, password, confirmpassword } = req.body;

        const eValid = isValidEmail(email);

        if (!name) {
            return sendError(
                res,
                errorMessages.missingName.statusCode,
                errorMessages.missingName.message
            );
        }

        if (!email) {
            return sendError(
                res,
                errorMessages.missingEmail.statusCode,
                errorMessages.missingEmail.message
            );
        }

        if (!eValid) {
            return sendError(
                res,
                errorMessages.invalidEmail.statusCode,
                errorMessages.invalidEmail.message
            );
        }

        if (!password) {
            return sendError(
                res,
                errorMessages.missingPassword.statusCode,
                errorMessages.missingPassword.message
            );
        }

        if (!confirmpassword) {
            return sendError(
                res,
                errorMessages.missingConfirmPassword.statusCode,
                errorMessages.missingConfirmPassword.message
            );
        }

        if (password !== confirmpassword) {
            return sendError(
                res,
                errorMessages.notSamePassword.statusCode,
                errorMessages.notSamePassword.message
            );
        }

        // Verifica se o usuário já existe utilizando Prisma.
        const userExists = await prisma.prisma.user.findUnique({
            where: { email: email },
        });

        if (userExists) {
            return sendError(
                res,
                errorMessages.userExists.statusCode,
                errorMessages.userExists.message
            );
        }

        // Criptografa a senha.
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // Cria um novo usuário utilizando Prisma.
        try {
            const newUser = await prisma.prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: passwordHash,
                },
            });

            await createUserToken(newUser, req, res);
        } catch (error) {
            console.log(error);
            return sendError(
                res,
                errorMessages.notCreateUser.statusCode,
                errorMessages.notCreateUser.message
            );
        }
    }

    static async login(req, res) {
        // Extração dos dados da requisição.
        const { email, password } = req.body;
    
        // Validação do e-mail utilizando email-validator.
        const eValid = isValidEmail(email);
    
        // Validações.
        if (!email) {
          return sendError(
            res,
            errorMessages.missingEmail.statusCode,
            errorMessages.missingEmail.message
          );
        }
    
        if (!eValid) {
          return sendError(
            res,
            errorMessages.invalidEmail.statusCode,
            errorMessages.invalidEmail.message
          );
        }
    
        if (!password) {
          return sendError(
            res,
            errorMessages.missingPassword.statusCode,
            errorMessages.missingPassword.message
          );
        }
        
        // Verifica se o usuário existe.
        const userExists = await prisma.prisma.user.findUnique({
            where: { email: email },
        });

        if (!userExists) {
          return sendError(
            res,
            errorMessages.userNotExists.statusCode,
            errorMessages.userNotExists.message
          );
        }
    
        // Verifica a senha.
        const checkPassword = await bcrypt.compare(password, userExists.password);
    
        if (!checkPassword) {
          return sendError(
            res,
            errorMessages.invalidPassword.statusCode,
            errorMessages.invalidPassword.message
          );
        }
        await createUserToken(userExists, req, res);
    }

    static async checkUser(req, res) {
        let currentUser;
    
        if (req.headers.authorization) {
            const token = getToken(req);
            const decoded = jwt.verify(token, bcryptSecret);
    
            // Busca o usuário pelo ID usando Prisma
            currentUser = await prisma.prisma.user.findUnique({
                where: {
                    id: decoded.id,  // O ID decodificado do token JWT
                },
            });
    
            // Remove a senha do objeto usuário
            if (currentUser) {
                currentUser.password = undefined;
            }
        } else {
            currentUser = null;
        }
    
        res.status(200).send(currentUser);
    }

    static async getUserById(req, res) {
        const id = req.params.id;
    
        // Busca o usuário pelo ID usando Prisma
        const user = await prisma.prisma.user.findUnique({
            where: {
                id: id,
            },
        });
    
        // Verifica se o usuário existe
        if (!user) {
            return sendError(
                res,
                errorMessages.userNotFound.statusCode,
                errorMessages.userNotFound.message
            );
        }
    
        // Remove a senha do objeto usuário
        user.password = undefined;
    
        res.status(200).json({
            user,
        });
    }

    static async editUser(req, res) {
        const id = req.params.id;
        const token = getToken(req);
        const user = await getUserByToken(token); // Supondo que `getUserByToken` retorna o usuário pelo token.
        const { name, email, password, confirmpassword } = req.body;
    
        // Validações
        const eValid = isValidEmail(email);
    
        if (!name) {
            return sendError(
                res,
                errorMessages.missingName.statusCode,
                errorMessages.missingName.message
            );
        }
        user.name = name;
    
        if (!email) {
            return sendError(
                res,
                errorMessages.missingEmail.statusCode,
                errorMessages.missingEmail.message
            );
        }
    
        // Verifica se o e-mail já está em uso por outro usuário
        const userExists = await prisma.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    
        if (user.email !== email && userExists) {
            return sendError(
                res,
                errorMessages.userNotFound.statusCode,
                errorMessages.userNotFound.message
            );
        }
    
        if (!eValid) {
            return sendError(
                res,
                errorMessages.invalidEmail.statusCode,
                errorMessages.invalidEmail.message
            );
        }
    
        user.email = email;
    
        // Verifica se as senhas são iguais antes de atualizar
        if (password !== confirmpassword) {
            return sendError(
                res,
                errorMessages.notSamePassword.statusCode,
                errorMessages.notSamePassword.message
            );
        } else if (password && confirmpassword) {
            // Criação de nova senha
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);
    
            user.password = passwordHash;
        }
    
        try {
            // Atualiza o usuário com Prisma
            await prisma.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    name: user.name,
                    email: user.email,
                    password: user.password,
                },
            });
    
            res.status(200).json({
                message: 'Usuário atualizado com sucesso!',
            });
        } catch (error) {
            console.log(error);
            return sendError(
                res,
                errorMessages.notUpdateUser.statusCode,
                errorMessages.notUpdateUser.message
            );
        }
    }    
};
