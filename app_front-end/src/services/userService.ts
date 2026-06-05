import { ApiUser } from '../types/UserProfile.types';

const API_BASE_URL = 'http://localhost:8080/api';

const normalizeUser = (user: ApiUser): ApiUser => ({
  ...user,
  skills: user.skills ?? [],
  needs: user.needs ?? [],
  education: user.education ?? null,
  experience: user.experience ?? null,
  project: user.project ?? null,
});

export const getAllUsers = async (): Promise<ApiUser[]> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const data: ApiUser[] = await response.json();
  return data.map(normalizeUser);
};

export const getUserById = async (userId: number): Promise<ApiUser> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const data: ApiUser = await response.json();
  return normalizeUser(data);
};
