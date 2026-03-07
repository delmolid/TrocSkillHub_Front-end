/**
 * App.tsx
 * Exemple d'utilisation du composant ProfileMain
 */

import React from "react";
import ProfileMain from "./components/ProfilePageComponents/ProfileMain";
import "./App.css";
import { AuthentificationPage } from "./pages/AuthenticationPage";
import { Route, Routes } from "react-router";

const App: React.FC = () => {
  // ID de l'utilisateur à afficher
  // - L'authentification (utilisateur connecté)
  const userId = 3; // Affiche Ada lovelace

  return (
    <Routes>
      <Route path="/" element={<ProfileMain userId={userId} />} />
      <Route path="/login" element={<AuthentificationPage />} />
    </Routes>
  );
};

export default App;
