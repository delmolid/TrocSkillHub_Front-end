import "../../styles/Header.css";
import reactLogo from "../../assets/Ada_Lovelace.jpg";
import { useState } from "react";

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <ul className="nav-left">
        <li>
          <h1 className="font-heading text-xl font-bold max-md:text-base max-sm:text-sm">
            TROCSKILL-HUB
          </h1>
        </li>
      </ul>

      {/* Bouton hamburger (visible uniquement en mobile) */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Menu déroulant */}
      <div className={`nav-menu ${menuOpen ? "active" : ""}`}>
        <ul className="nav-center">
          <li>
            <a href="">Tableau de bord</a>
          </li>
          <li>
            <a href="">Offres</a>
          </li>
          <li>
            <a href="">Mon Profil</a>
          </li>
        </ul>
        <ul className="nav-right">
          <li>
            <button>Déconnexion</button>
          </li>
          <li>
            <img src={reactLogo} alt="Profil" className="nav-avatar" />
          </li>
        </ul>
      </div>
    </nav>
  );
};
