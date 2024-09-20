import { NavLink } from './Nav-link';

import logo from '../assets/logo.svg';

export function Header() {
  return (
    <div className="flex items-center gap-5 py-2">
      <img
        src={logo}
        alt="Imagem com a Logo do Projeto"
      />

      <nav className="flex items-center gap-5">
        <NavLink href="/eventos">Eventos</NavLink>
        <NavLink href="/participantes">Participantes</NavLink>
      </nav>
    </div>
  );
}
