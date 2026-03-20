/**
 * App.tsx
 * Exemple d'utilisation du composant ProfileMain
 */

import React from "react";
import ProfilPage from "./pages/ProfilPage";
// import { ProfilPageProps } from "./types/UserProfile.types";
import "./App.css";
import { AuthentificationPage } from "./pages/AuthenticationPage";
import { Route, Routes } from "react-router";

const App: React.FC = () => {
  // ID de l'utilisateur à afficher
  // - L'authentification (utilisateur connecté)
  const userId = 3; // Affiche Ada lovelace

  return (
    <Routes>
      <Route path="/" element={<ProfilPage />} />
      <Route path="/login" element={<AuthentificationPage />} />
    </Routes>
  );
};

export default App;
