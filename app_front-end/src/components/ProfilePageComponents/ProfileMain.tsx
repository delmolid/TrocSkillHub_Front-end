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

  // 🎭 DONNÉES RÉALISTES POUR ADA LOVELACE (inspirées de l'histoire)
  const demoData = {
    competences: [
      "Mathématiques avancées",
      "Logique algorithmique",
      "Programmation analytique",
      "Traduction scientifique",
      "Notation mathématique",
      "Pensée computationnelle"
    ],
    besoins: [
      "Collaboration avec ingénieurs mécaniques",
      "Accès à des machines de calcul",
      "Échange avec des mathématiciens",
      "Financement pour recherches",
      "Documentation de systèmes complexes",
      "Mentorat scientifique"
    ],
    formations: [
      {
        titre: "Études privées en Mathématiques",
        etablissement: "Tutorat avec Mary Somerville",
        periode: "1833 - 1835",
        description: "Formation approfondie en mathématiques et sciences avec Mary Somerville, l'une des premières femmes scientifiques reconnues en Grande-Bretagne."
      },
      {
        titre: "Études de la Logique",
        etablissement: "Tutorat avec Augustus De Morgan",
        periode: "1840 - 1841",
        description: "Études avancées en logique mathématique et calcul différentiel avec Augustus De Morgan, professeur de mathématiques à l'University College London."
      }
    ],
    experiences: [
      {
        poste: "Traductrice et Commentatrice Scientifique",
        entreprise: "Collaboration avec Charles Babbage",
        periode: "1842 - 1843",
        description: "Traduction de l'article de Luigi Menabrea sur la machine analytique de Babbage. Ajout de notes explicatives trois fois plus longues que l'article original, incluant le premier algorithme destiné à être exécuté par une machine."
      },
      {
        poste: "Chercheuse Indépendante",
        entreprise: "Recherches personnelles",
        periode: "1835 - 1852",
        description: "Recherches sur les applications potentielles des machines de calcul au-delà des simples calculs numériques, notamment en musique et en art génératif."
      }
    ],
    projets: [
      {
        nom: "Notes sur la Machine Analytique",
        description: "Publication de notes détaillées sur la machine analytique de Charles Babbage, incluant le premier algorithme informatique de l'histoire : un programme pour calculer les nombres de Bernoulli.",
        technologies: "Notation mathématique, Logique algorithmique, Diagrammes"
      },
      {
        nom: "Vision de la Programmation Créative",
        description: "Conceptualisation visionnaire de l'utilisation des machines de calcul pour créer de la musique et de l'art, anticipant l'informatique créative de plus d'un siècle.",
        technologies: "Théorie musicale, Mathématiques, Logique"
      },
      {
        nom: "Système de Notation pour Algorithmes",
        description: "Développement d'un système de notation permettant de décrire précisément les opérations à effectuer par une machine de calcul, précurseur des langages de programmation modernes.",
        technologies: "Notation symbolique, Algèbre, Logique séquentielle"
      }
    ]
  };

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

          {/* Compétences et Besoins */}
          <div className="competences-besoins-wrapper">
            {/* Section Compétences */}
            <div className="section-card">
              <h3 className="section-card__title">Mes Compétences & expertises</h3>
              <ul className="section-card__list">
                {demoData.competences.map((competence, index) => (
                  <li key={index}>{competence}</li>
                ))}
              </ul>
            </div>

            {/* Section Besoins */}
            <div className="section-card">
              <h3 className="section-card__title">Mes Besoins</h3>
              <ul className="section-card__list">
                {demoData.besoins.map((besoin, index) => (
                  <li key={index}>{besoin}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section Formations */}
          <div className="info-section">
            <h3 className="info-section__title">Formations</h3>
            <div className="info-section__content">
              {demoData.formations.map((formation, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '5px' }}>
                    {formation.titre}
                  </h4>
                  <p style={{ fontSize: '14px', color: '#008B8B', marginBottom: '5px', fontWeight: '500' }}>
                    {formation.etablissement} • {formation.periode}
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                    {formation.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section Expériences professionnelles */}
          <div className="info-section">
            <h3 className="info-section__title">Expériences professionnelles</h3>
            <div className="info-section__content">
              {demoData.experiences.map((experience, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '5px' }}>
                    {experience.poste}
                  </h4>
                  <p style={{ fontSize: '14px', color: '#008B8B', marginBottom: '5px', fontWeight: '500' }}>
                    {experience.entreprise} • {experience.periode}
                  </p>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>
                    {experience.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section Projets réalisés */}
          <div className="info-section">
            <h3 className="info-section__title">Projets réalisés</h3>
            <div className="info-section__content">
              {demoData.projets.map((projet, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '5px' }}>
                    {projet.nom}
                  </h4>
                  <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5', marginBottom: '5px' }}>
                    {projet.description}
                  </p>
                  <p style={{ fontSize: '13px', color: '#008B8B', fontWeight: '500' }}>
                    Technologies : {projet.technologies}
                  </p>
                </div>
              ))}
            </div>
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