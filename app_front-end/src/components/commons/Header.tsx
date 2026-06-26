import "../../styles/Header.css";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useLogoutUser } from "@/hooks/useAuthQuery";

export const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/login";
  const { mutate: logoutUser, isPending } = useLogoutUser();

  const handleLogout = () => {
    logoutUser();
  };
  return (
    <nav className="navbar">
      <ul className="nav-left">
    <li className="flex items-center gap-3">
      <img
        src="/trocskillhub_logo.png"
        alt="Logo TrocSkillHub"
        className="h-20 w-20 object-contain max-sm:h-8 max-sm:w-8"
      />
      <h1 className="font-heading text-xl font-bold text-[#70744f] max-md:text-base max-sm:text-sm">
        TROCSKILL-HUB
      </h1>
    </li>
  </ul>
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`nav-menu ${menuOpen ? "active" : ""}`}>
        <ul className="nav-center">
        {!isAuthPage && (
            <li>
              <button >Tableau de bord</button>
            </li>
          )}
          {!isAuthPage && (
            <li>
              <button>Mon Profil</button>
            </li>
          )}
        </ul>
        <ul className="nav-right">
          {!isAuthPage && (
            <li>
              <button onClick={handleLogout} disabled={isPending}>Déconnexion</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
};
