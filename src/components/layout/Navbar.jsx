import { NavLink } from "react-router-dom";
import {
  FiCompass,
  FiUser,
  FiBarChart2,
  FiAward,
  FiFilm,
} from "react-icons/fi";
import "./Navbar.css";

const LINKS = [
  { to: "/", label: "Descobrir", icon: FiCompass, end: true },
  { to: "/estatisticas", label: "Estatísticas", icon: FiBarChart2 },
  { to: "/conquistas", label: "Conquistas", icon: FiAward },
  { to: "/perfil", label: "Perfil", icon: FiUser },
];

export function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink
          to="/"
          className="navbar-brand"
          aria-label="Watchly - Ir para a página inicial"
        >
          <FiFilm size={22} aria-hidden="true" />
          <span>Watchly</span>
        </NavLink>

        <nav className="navbar-links" aria-label="Navegação principal">
          {LINKS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              aria-label={label}
              className={({ isActive }) =>
                `navbar-link${isActive ? " active" : ""}`
              }
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
