import React, { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import ProfileMain from "../components/ProfilePageComponents/ProfileMain";
import { useAuth } from "../context/AuthContext";
import "../App.css";
import { Header } from "../components/commons/Header";

const ProfilPage: React.FC = () => {
  const { userId, isLoading, isError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isError) {
      navigate({ to: "/login" });
    }
  }, [isLoading, isError, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page-bg">
        <p className="text-text">Chargement...</p>
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  return (
    <div className="app">
      <Header />
      <ProfileMain userId={userId} />

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
