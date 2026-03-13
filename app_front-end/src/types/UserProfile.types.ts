/**
 * types/UserProfile.ts
 * Définition des types pour le profil utilisateur
 */

// Type correspondant à la structure de l'API backend
export interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  country: string;
  phoneNumber: string;
  description: string;
}

// Type pour le composant UserCard
export interface UserCardData {
  photo: string;
  prenom: string;
  nom: string;
  ville: string;
  linkedin?: string;
  instagram?: string;
}

// Type complet du profil utilisateur (pour extension future)
export interface UserProfile extends UserCardData {
  about: string;
  competences: string[];
  besoins: string[];
  formations: string;
  experiences: string;
  projets: string;
}