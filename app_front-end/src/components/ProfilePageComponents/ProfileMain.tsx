/**
 * components/ProfilePage/ProfileMain.tsx
 * Composant principal de la page profil utilisateur
 */

import React from 'react';
import UserCard from './UserCard';
import { useUser } from '../../hooks/useUser';
import { mapApiUserToUserCard, getUserDescription } from '../../utils/userMapper';
import './ProfileMain.css';

interface ProfileMainProps {
  userId: number; // ID de l'utilisateur à afficher
}

const ProfileMain: React.FC<ProfileMainProps> = ({ userId }) => {
  // Utilisation du hook personnalisé pour récupérer les données
  const { user, loading, error, refetch } = useUser(userId);

  // État de chargement
  if (loading) {
    return (
      <main className="profile-main">
        <div className="profile-main__loading">
          <div className="spinner"></div>
          <p>Chargement du profil...</p>
        </div>
      </main>
    );
  }

  // Gestion des erreurs
  if (error) {
    return (
      <main className="profile-main">
        <div className="profile-main__error">
          <p className="error-message">❌ {error}</p>
          <button onClick={refetch} className="retry-button">
            Réessayer
          </button>
        </div>
      </main>
    );
  }

  // Si aucun utilisateur n'est trouvé
  if (!user) {
    return (
      <main className="profile-main">
        <div className="profile-main__empty">
          <p>Aucun utilisateur trouvé</p>
        </div>
      </main>
    );
  }

  // Conversion des données API vers le format UserCard
  const userCardData = mapApiUserToUserCard(user);
  const description = getUserDescription(user);

  return (
    <main className="profile-main">
      <div className="profile-main__container">
        {/* Section gauche : Carte utilisateur */}
        <aside className="profile-main__sidebar">
          <UserCard {...userCardData} />
        </aside>

        {/* Section droite : Contenu principal */}
        <section className="profile-main__content">
          {/* Section "À propos de moi" */}
          <div className="about-section">
            <h2 className="section-title">À propos de moi</h2>
            <p className="about-text">{description}</p>
          </div>

          {/* Sections à venir : Compétences, Besoins, etc. */}
          <div className="competences-besoins-wrapper">
            {/* Section Compétences */}
            <div className="section-card">
              <h3 className="section-card__title">Mes Compétences & expertises</h3>
              <ul className="section-card__list">
                <li>Items</li>
                <li>Items</li>
                <li>Items</li>
              </ul>
            </div>

            {/* Section Besoins */}
            <div className="section-card">
              <h3 className="section-card__title">Mes Besoins</h3>
              <ul className="section-card__list">
                <li>Items</li>
                <li>Items</li>
                <li>Items</li>
              </ul>
            </div>
          </div>

          {/* Section Formations */}
          <div className="info-section">
            <h3 className="info-section__title">Formations</h3>
            <p className="info-section__content">
              Informations sur les formations de l'utilisateur
            </p>
          </div>

          {/* Section Expériences professionnelles */}
          <div className="info-section">
            <h3 className="info-section__title">Expériences professionnelles</h3>
            <p className="info-section__content">
              Informations sur l'expériences professionnelles
            </p>
          </div>

          {/* Section Projets réalisés */}
          <div className="info-section">
            <h3 className="info-section__title">Projets réalisés</h3>
            <p className="info-section__content">
              Informations sur l'expériences professionnelles
            </p>
          </div>
        </section>
      </div>

      {/* Bouton pour recharger les données (optionnel - pour debug) */}
      {process.env.NODE_ENV === 'development' && (
        <button onClick={refetch} className="debug-reload">
          🔄 Recharger
        </button>
      )}
    </main>
  );
};

export default ProfileMain;
