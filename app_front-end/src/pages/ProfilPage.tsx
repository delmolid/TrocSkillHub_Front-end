import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileMain from "../components/ProfilePageComponents/ProfileMain";
import { getCurrentUser } from "../services/authService";
import "../App.css";
import { Header } from "../components/commons/Header";

const ProfilPage: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserId(user.id);
      } catch (error) {
        // Si pas connecté, redirige vers login
        console.error("Utilisateur non connecté:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh" 
      }}>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!userId) {
    return null; // Redirection en cours
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