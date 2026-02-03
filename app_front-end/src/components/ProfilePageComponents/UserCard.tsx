import React from 'react';
import './UserCard.css';
import { FaLinkedin, FaInstagram, FaMapMarkerAlt } from 'react-icons/fa';
import { UserCardData } from '../../types/UserProfile.types';


/**
 * Composant UserCard - Affiche la carte profil utilisateur
 * @param props - Les propriétés du composant
 * @returns JSX.Element
 */
const UserCard: React.FC<UserCardData> = ({ 
  photo, 
  prenom,
  nom,
  ville, 
  linkedin, 
  instagram
}) => {
  // Création du nom complet pour l'affichage
  const nomComplet = `${prenom} ${nom}`;

  return (
    <div className="user-card">
      {/* Photo de profil */}
      <div className="user-card__photo-container">
        <img 
          src={photo} 
          alt={`Photo de profil de ${nomComplet}`}
          className="user-card__photo"
        />
      </div>

      {/* Nom complet de l'utilisateur */}
      <h2 className="user-card__name">{nomComplet}</h2>

      {/* Informations de contact */}
      <div className="user-card__contact-info">
        {/* Ville */}
        <div className="user-card__contact-item">
          <FaMapMarkerAlt className="user-card__icon" aria-hidden="true" />
          <span className="user-card__text">{ville}</span>
        </div>

        {/* LinkedIn */}
        {linkedin && (
          <a 
            href={linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            className="user-card__contact-item user-card__link"
            aria-label="Profil LinkedIn"
          >
            <FaLinkedin className="user-card__icon user-card__icon--linkedin" aria-hidden="true" />
            <span className="user-card__text">LinkedIn</span>
          </a>
        )}

        {/* Instagram */}
        {instagram && (
          <a 
            href={instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="user-card__contact-item user-card__link"
            aria-label="Profil Instagram"
          >
            <FaInstagram className="user-card__icon user-card__icon--instagram" aria-hidden="true" />
            <span className="user-card__text">Instagram</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default UserCard;
