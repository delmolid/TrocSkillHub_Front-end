/**
 * services/authService.ts
 * Service pour gérer l'authentification (inscription, connexion, déconnexion)
 */

const API_BASE_URL = 'http://localhost:8080/api/auth';

export interface CurrentUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  country: string;
}

/**
 * Inscrit un nouvel utilisateur
 * @param data - Données d'inscription
 * @returns Promise avec le message de confirmation
 */
export const register = async (data: {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  city: string;
  country: string;
}): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erreur lors de l\'inscription');
    }

    return result;
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    throw error;
  }
};

/**
 * Connecte un utilisateur
 * @param data - Email et mot de passe
 * @returns Promise avec le message de confirmation
 */
export const login = async (data: {
  email: string;
  password: string;
}): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // IMPORTANT : pour envoyer/recevoir les cookies
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Erreur de connexion');
    }

    return result;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};

/**
 * Déconnecte l'utilisateur
 * @returns Promise avec le message de confirmation
 */
export const logout = async (): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      credentials: 'include', // IMPORTANT : pour envoyer le cookie JWT
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error('Erreur lors de la déconnexion');
    }

    return result;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    throw error;
  }
};

/**
 * Récupère les informations de l'utilisateur connecté
 * @returns Promise avec les infos de l'utilisateur
 */
export const getCurrentUser = async (): Promise<CurrentUser> => {
  try {
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      credentials: 'include', // IMPORTANT : envoie le cookie JWT
    });

    if (!response.ok) {
      throw new Error('Non authentifié');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    throw error;
  }
};