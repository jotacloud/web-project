import { useState } from 'react';
import { Header } from './components/Header';
import { AttendeeList } from './pages/Attendee-list';
import AuthForm from './components/AuthForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (email: string, password: string) => {
    console.log("Login com:", email, password);
    // Aqui você pode adicionar a lógica de autenticação
    // Se o login for bem-sucedido, atualizar o estado para true
    setIsAuthenticated(true);
  };

  const handleRegister = (email: string, password: string) => {
    console.log("Cadastro com:", email, password);
    // Aqui você pode adicionar a lógica de registro
    // Se o registro for bem-sucedido, atualizar o estado para true
    setIsAuthenticated(true);
  };

  return (
    <div className="max-w-[1216px] mx-auto py-5 flex flex-col gap-5">
      {!isAuthenticated ? (
        <AuthForm onLogin={handleLogin} onRegister={handleRegister} />
      ) : (
        <>
          <Header />
          <AttendeeList />
        </>
      )}
    </div>
  );
}

export default App;
