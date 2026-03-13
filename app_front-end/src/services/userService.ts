/**
 * services/userService.ts
 * Service pour gérer les appels API liés aux utilisateurs
 */

import { ApiUser } from '../types/UserProfile.types';

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Récupère tous les utilisateurs
 * @returns Promise<ApiUser[]>
 */
export const getAllUsers = async (): Promise<ApiUser[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data: ApiUser[] = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw error;
  }
};

/**
 * Récupère un utilisateur par son ID
 * @param userId - L'ID de l'utilisateur
 * @returns Promise<ApiUser>
 */
export const getUserById = async (userId: number): Promise<ApiUser> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data: ApiUser = await response.json();
    return data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur ${userId}:`, error);
    throw error;
  }
};