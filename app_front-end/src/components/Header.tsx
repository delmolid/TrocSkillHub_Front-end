import "../styles/Header.css";
import reactLogo from "../assets/Ada_Lovelace.jpg";

export const Header: React.FC = () => {
  return (
    <nav className="navbar">
      <ul className="nav-left">
        <li>
          <h1>TROCSKILL-HUB</h1>
        </li>
      </ul>

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
    </nav>
  );
};
