import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Header } from "../components/commons/Header";
import { DashboardProfileCard } from "../components/dashboard/DashboardProfileCard";
import { useAuth } from "../context/AuthContext";
import { useUsersQuery } from "../hooks/useUserQuery";
import "../App.css";

const DashboardState = ({ message }: { message: string }) => (
  <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-primary-border/10 bg-white p-8 text-center shadow-sm">
    <p className="text-base font-semibold text-text">{message}</p>
  </div>
);

export function DashboardPage() {
  const { userId, isLoading: authLoading, isError: authError } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = Boolean(userId);

  const {
    data: users = [],
    isPending: usersLoading,
    isError: usersError,
    error,
  } = useUsersQuery(isAuthenticated);

  useEffect(() => {
    if (!authLoading && (authError || !isAuthenticated)) {
      navigate({ to: "/login" });
    }
  }, [authError, authLoading, isAuthenticated, navigate]);

  const renderContent = () => {
    if (authLoading || usersLoading) {
      return <DashboardState message="Chargement des profils..." />;
    }

    if (usersError) {
      return (
        <DashboardState
          message={
            error instanceof Error
              ? error.message
              : "Impossible de récupérer les profils."
          }
        />
      );
    }

    if (users.length === 0) {
      return <DashboardState message="Aucun profil disponible pour le moment." />;
    }

    return (
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {users.map((user) => (
          <DashboardProfileCard
            key={user.id ?? `${user.email}-${user.firstName}-${user.lastName}`}
            user={user}
          />
        ))}
      </div>
    );
  };

  if (!authLoading && !isAuthenticated) {
    return null;
  }

  return (
    <div className="app">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-5 py-8 sm:px-8 lg:py-12">
        <header className="max-w-3xl">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-primary-border">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold text-text">
            Découvrez les membres de TrocSkillHub
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Parcourez les profils, compétences et besoins des utilisateurs pour
            trouver de nouvelles opportunités d&apos;échange.
          </p>
        </header>

        {renderContent()}
      </main>

      <footer className="app-footer">
        <div className="app-footer__content">
          <p className="footer-copyright">
            ©2026 Troc-SkillHub. Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  );
}
