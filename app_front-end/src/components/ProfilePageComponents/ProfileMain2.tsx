/**
 * components/ProfilePage/ProfileMain2.tsx
 * Composant pour les nouveaux utilisateurs - profil minimal à compléter
 */

import React from 'react';
import UserCard from './UserCard';
import { useUser } from '../../hooks/useUser';
import { mapApiUserToUserCard, getUserDescription } from '../../utils/userMapper';
import './ProfileMain2.css';

interface ProfileMain2Props {
  userId: number; // ID de l'utilisateur à afficher
}

const ProfileMain2: React.FC<ProfileMain2Props> = ({ userId }) => {
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

  // Conversion des données API vers le format UserCard (sans photo)
  const userCardData = {
    ...mapApiUserToUserCard(user),
    profilePicture: undefined // Pas de photo pour les nouveaux utilisateurs
  };
  
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
          {/* Bannière de bienvenue */}
          <div className="welcome-banner">
            <h2 className="welcome-banner__title">🎉 Bienvenue sur Troc-SkillHub !</h2>
            <p className="welcome-banner__text">
              Votre compte a été créé avec succès. Complétez votre profil pour profiter pleinement de la plateforme 
              et commencer à échanger vos compétences avec la communauté.
            </p>
          </div>

          {/* Section "À propos de moi" */}
          <div className="about-section incomplete-section">
            <h2 className="section-title">À propos de moi</h2>
            {description && description.trim() !== '' ? (
              <p className="about-text">{description}</p>
            ) : (
              <div className="empty-state">
                <span className="empty-state__icon">📝</span>
                <p className="empty-state__text">
                  Présentez-vous ! Parlez de votre parcours, vos passions et ce qui vous motive.
                </p>
                <button className="complete-button">
                  Compléter ma présentation
                </button>
              </div>
            )}
          </div>

          {/* Compétences et Besoins */}
          <div className="competences-besoins-wrapper">
            {/* Section Compétences */}
            <div className="section-card incomplete-section">
              <h3 className="section-card__title">Mes Compétences & expertises</h3>
              <div className="empty-state">
                <span className="empty-state__icon">💡</span>
                <p className="empty-state__text">
                  Listez vos compétences et expertises que vous souhaitez partager avec la communauté.
                </p>
                <button className="complete-button complete-button--small">
                  Ajouter mes compétences
                </button>
              </div>
            </div>

            {/* Section Besoins */}
            <div className="section-card incomplete-section">
              <h3 className="section-card__title">Mes Besoins</h3>
              <div className="empty-state">
                <span className="empty-state__icon">🎯</span>
                <p className="empty-state__text">
                  Indiquez les compétences que vous recherchez ou les domaines dans lesquels vous souhaitez progresser.
                </p>
                <button className="complete-button complete-button--small">
                  Ajouter mes besoins
                </button>
              </div>
            </div>
          </div>

          {/* Section Formations */}
          <div className="info-section incomplete-section">
            <h3 className="info-section__title">Formations</h3>
            <div className="empty-state">
              <span className="empty-state__icon">🎓</span>
              <p className="empty-state__text">
                Ajoutez vos formations académiques, certifications et parcours éducatifs pour valoriser votre profil.
              </p>
              <button className="complete-button complete-button--small">
                Ajouter mes formations
              </button>
            </div>
          </div>

          {/* Section Expériences professionnelles */}
          <div className="info-section incomplete-section">
            <h3 className="info-section__title">Expériences professionnelles</h3>
            <div className="empty-state">
              <span className="empty-state__icon">💼</span>
              <p className="empty-state__text">
                Partagez votre parcours professionnel, vos postes et responsabilités pour inspirer confiance.
              </p>
              <button className="complete-button complete-button--small">
                Ajouter mes expériences
              </button>
            </div>
          </div>

          {/* Section Projets réalisés */}
          <div className="info-section incomplete-section">
            <h3 className="info-section__title">Projets réalisés</h3>
            <div className="empty-state">
              <span className="empty-state__icon">🚀</span>
              <p className="empty-state__text">
                Mettez en avant vos réalisations et projets marquants pour démontrer vos compétences en action.
              </p>
              <button className="complete-button complete-button--small">
                Ajouter mes projets
              </button>
            </div>
          </div>

          {/* Indicateur de progression du profil */}
          <div className="profile-completion">
            <div className="profile-completion__header">
              <h4 className="profile-completion__title">Complétude du profil</h4>
              <span className="profile-completion__percentage">15%</span>
            </div>
            <div className="profile-completion__bar">
              <div className="profile-completion__progress" style={{ width: '15%' }}></div>
            </div>
            <p className="profile-completion__hint">
              💡 Un profil complet attire plus d'opportunités d'échange !
            </p>
          </div>
        </section>
      </div>
      
    </main>
  );
};

export default ProfileMain2;