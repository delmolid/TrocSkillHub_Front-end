/**
 * pages/ProfilePage2.tsx
 * Page de profil pour les nouveaux utilisateurs
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileMain2 from "../components/ProfilePageComponents/ProfileMain2";
import { getCurrentUser } from "../services/authService";
import "../App.css";
import { Header } from "../components/commons/Header";

const ProfilePage2: React.FC = () => {
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
        minHeight: "100vh",
        backgroundColor: "#EEF5FF"
      }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner" style={{
            width: "50px",
            height: "50px",
            border: "4px solid #e0e0e0",
            borderTop: "4px solid #008B8B",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }}></div>
          <p style={{ color: "#666", fontSize: "16px" }}>Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return null; // Redirection en cours
  }

  return (
    <div className="app">
      <Header />
      <ProfileMain2 userId={userId} />

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

export default ProfilePage2;