import React from "react";
import ProfileMain from "../components/ProfilePageComponents/ProfileMain";
import "../App.css";
import { Header } from "../components/commons/Header";

const ProfilPage: React.FC = () => {
  // ID de l'utilisateur à afficher
  // - L'authentification (utilisateur connecté)
  const userId = 3; // Affiche Ada lovelace

  return (
    <div className="app">
      <Header />
      {/*Contenu principal */}
      {<ProfileMain userId={userId} />}

      {/* Footer (à créer plus tard) */}
      <footer className="app-footer">
        <div className="app-footer__content">
          <div className="footer-links">
            <a href="#about">À Propos de Nous</a>
            <a href="#contact">Contact</a>
            <a href="#faq">FAQ</a>
          </div>
          <p className="footer-copyright">
            ©2026 Troc-SkillHub. Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProfilPage;
