const errorMessages = {
    missingName: {
      statusCode: 422,
      message: 'O nome é obrigatório!',
    },
    missingEmail: {
      statusCode: 422,
      message: 'O e-mail é obrigatório!',
    },
    invalidEmail: {
      statusCode: 422,
      message: 'O e-mail não é válido!',
    },
    missingPassword: {
      statusCode: 422,
      message: 'A senha é obrigatória!',
    },
    missingConfirmPassword: {
      statusCode: 422,
      message: 'A confirmação da senha é obrigatória!',
    },
    invalidPassword: {
      statusCode: 422,
      message: 'Senha inválida!',
    },
    notSamePassword: {
      statusCode: 422,
      message: 'As senhas precisam ser idênticas!',
    },
    userExists: {
      statusCode: 422,
      message: 'Já existe um usuário cadastrado com esse e-mail!',
    },
    userNotFound: {
      statusCode: 422,
      message: 'Usuário Não encontrado!',
    },
    userNotExists: {
      statusCode: 422,
      message: 'Não há usuário cadastrado com esse e-mail!',
    },
    deniedPermission: {
      statusCode: 401,
      message: 'Permissão negada!',
    },
    invalidToken: {
      statusCode: 400,
      message: 'Token inválido!',
    },
    notCreateUser: {
      statusCode: 500,
      message: 'Não foi possivel criar o usuário!',
    },
    notUpdateUser: {
      statusCode: 500,
      message: 'Não foi possivel criar o usuário!',
    },
  };
  
  module.exports = errorMessages;