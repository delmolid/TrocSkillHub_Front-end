import React, { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import ProfileMain from "../components/ProfilePageComponents/ProfileMain";
import { useAuth } from "../context/AuthContext";
import "../App.css";
import { Header } from "../components/commons/Header";
import { Footer } from "../components/commons/Footer";

const ProfilPage: React.FC = () => {
  const { user, isLoading, isError } = useAuth();
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

  if (!user) {
    return null;
  }

  return (
    <div className="app">
      <Header />
      <ProfileMain />

      <Footer />
    </div>
  );
};

export default ProfilPage;
