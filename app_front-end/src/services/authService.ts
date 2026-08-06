import { API_AUTH_URL } from "../constantes";
import type { CurrentUser, LoginPayload, RegisterPayload } from "../types/auth.types";
import { apiFetch } from "./apiFetch";

export const register = async (
  data: RegisterPayload,
): Promise<{ message: string }> => {
  try {
    const response = await apiFetch(`${API_AUTH_URL}/register`, {
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

export const login = async (
  data: LoginPayload,
): Promise<{ message: string }> => {
  try {
    const response = await apiFetch(`${API_AUTH_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

export const logout = async (): Promise<{ message: string }> => {
  try {
    const response = await apiFetch(`${API_AUTH_URL}/logout`, {
      method: 'POST',
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

export const getCurrentUser = async (): Promise<CurrentUser> => {
  try {
    const response = await apiFetch(`${API_AUTH_URL}/me`, {
      method: 'GET',
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
