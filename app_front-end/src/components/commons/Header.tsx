import "../../styles/Header.css";
import { useState, type FC } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useLogoutUser } from "@/hooks/useAuthQuery";

export const Header: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAuthPage = pathname === "/" || pathname === "/login";
  const { mutate: logoutUser, isPending } = useLogoutUser();

  const handleLogout = () => {
    logoutUser();
  };

  const goToDashboard = () => {
    setMenuOpen(false);
    navigate({ to: "/dashboard" });
  };

  const goToProfile = () => {
    setMenuOpen(false);
    navigate({ to: "/profile" });
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
        TROCSKILLHUB
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
              <button onClick={goToDashboard}>Tableau de bord</button>
            </li>
          )}
          {!isAuthPage && (
            <li>
              <button onClick={goToProfile}>Mon Profil</button>
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
