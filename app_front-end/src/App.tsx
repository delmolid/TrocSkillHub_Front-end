import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ProfilPage from "./pages/ProfilPage";
import { AuthentificationPage } from "./pages/AuthenticationPage";
import "./App.css";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProfilPage />} />
      <Route path="/login" element={<AuthentificationPage />} />
      <Route path="/profile" element={<ProfilPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;