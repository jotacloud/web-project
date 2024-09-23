const getToken = (req) => {
  // Obtém o cabeçalho de autorização da requisição.
  const authHeader = req.headers.authorization;

  // Divide o cabeçalho em duas partes: o tipo de autenticação e o token JWT.
  const token = authHeader.split(" ")[1];

  // Retorna o token JWT.
  return token;
};

// Exporta a função getToken para uso em outros módulos.
module.exports = getToken;
