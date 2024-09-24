// define as propriedades que o componente de formulário de autenticação deve receber

import { useState, Dispatch, SetStateAction } from 'react';

interface AuthFormProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string) => void;
  isLoginView: boolean; 
  setIsLoginView: Dispatch<SetStateAction<boolean>>;
}

const AuthForm: React.FC<AuthFormProps> = ({
  onLogin,
  onRegister,
  isLoginView,
  setIsLoginView,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginView) {
      onLogin(email, password);
    } else {
      if (password !== confirmPassword) {
        alert('As senhas não coincidem');
        return;
      }
      onRegister(email, password);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {isLoginView ? 'Login' : 'Cadastro'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLoginView && (
            <div>
              <label className="block text-gray-400 mb-2" htmlFor="name">
                Nome
              </label>
              <input
                id="name"
                type="text"
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLoginView && (
            <div>
              <label className="block text-gray-400 mb-2" htmlFor="confirmPassword">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            {isLoginView ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-400">
            {isLoginView ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
            <button
              type="button"
              className="text-emerald-400 hover:text-emerald-300 font-bold underline"
              onClick={() => setIsLoginView(!isLoginView)}
            >
              {isLoginView ? 'Cadastre-se' : 'Faça login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
