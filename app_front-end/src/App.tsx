/**
 * App.tsx
 * Exemple d'utilisation du composant ProfileMain
 */

import React from "react";
import ProfileMain from "./components/ProfilePageComponents/ProfileMain";
import "./App.css";

const App: React.FC = () => {
  // ID de l'utilisateur à afficher
  // En production, cet ID viendrait probablement de:
  // - React Router (useParams)
  // - Un state global (Redux, Context)
  // - L'authentification (utilisateur connecté)
  const userId = 3; // Affiche Jean Martin

  return (
    <div className="app">
      {/* Header (à créer plus tard) */}
      <header className="app-header">
        <div className="app-header__content">
          <h1 className="app-logo">TROC-SKILLHUB</h1>
          <nav className="app-nav">
            <a href="#tableau">Tableau de bord</a>
            <a href="#offres">Offres</a>
            <a href="#profil">Mon profil</a>
          </nav>
          <button className="app-disconnect">Se Déconnecter</button>
        </div>
      </header>

      {/* Contenu principal */}
      <ProfileMain userId={userId} />

      {/* Footer (à créer plus tard) */}
      <footer className="app-footer">
        <div className="app-footer__content">
          <div className="footer-links">
            <a href="#about">À Propos de Nous</a>
            <a href="#contact">Contact</a>
            <a href="#faq">FAQ</a>
          </div>
          <p className="footer-copyright">
            ©2025 Troc-SkillHub. Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
