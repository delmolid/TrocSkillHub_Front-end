/**
 * utils/userMapper.ts
 * Fonctions utilitaires pour convertir les données de l'API
 * au format attendu par les composants
 */

import { ApiUser, UserCardData } from '../types/UserProfile.types';
import defaultAvatar from '../assets/Ada_Lovelace.jpg';

/**
 * Convertit un ApiUser en UserCardData
 * @param apiUser - Données de l'utilisateur depuis l'API
 * @returns UserCardData - Données formatées pour le composant UserCard
 */
export const mapApiUserToUserCard = (apiUser: ApiUser): UserCardData => {
  // Construction de la ville complète (ville + pays)
  const ville = `${apiUser.city}, ${apiUser.country}`;
  
  // Photo par défaut (vous pouvez la remplacer par une vraie URL si disponible)
  const photo = defaultAvatar;
  
  return {
    photo: photo,
    prenom: apiUser.firstName,
    nom: apiUser.lastName,
    ville: ville,
    linkedin: undefined,
    instagram: undefined
  };
};

/**
 * Récupère la description de l'utilisateur
 * @param apiUser - Données de l'utilisateur depuis l'API
 * @returns string - Description de l'utilisateur
 */
export const getUserDescription = (apiUser: ApiUser): string => {
  return apiUser.description || '';
};

/**
 * Formate le numéro de téléphone (optionnel - si vous voulez l'afficher)
 * @param phoneNumber - Numéro de téléphone
 * @returns string - Numéro formaté
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  return phoneNumber;
};