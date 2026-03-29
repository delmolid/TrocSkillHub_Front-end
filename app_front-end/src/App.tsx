/**
 * App.tsx
 * Routes principales de l'application
 */

import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ProfilPage from "./pages/ProfilPage";
import { AuthentificationPage } from "./pages/AuthenticationPage";
import "./App.css";
import ProfilePage2 from "./pages/ProfilePage2";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProfilPage />} />
      <Route path="/login" element={<AuthentificationPage />} />
      <Route path="/profile" element={<ProfilPage />} />
      <Route path="/profile-2" element={<ProfilePage2 />} />
      
      {/* Redirection par défaut si route inconnue */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;