import { API_USERS_URL } from '../constantes';
import {
  ApiUser,
  type needs,
  type RawKnowledgeItem,
  type skills,
  type UpdateProfilUserPayload,
} from '../types/UserProfile.types';

const normalizeKnowledgeItem = (item: RawKnowledgeItem): skills | needs => ({
  knowledgeId: item.knowledgeId ?? item.id,
  knowledgeName: item.knowledgeName,
  level: item.level,
  type: item.type,
});

const normalizeUser = (user: ApiUser): ApiUser => ({
  ...user,
  skills: (user.skills ?? []).map(normalizeKnowledgeItem),
  needs: (user.needs ?? []).map(normalizeKnowledgeItem),
  education: user.education ?? null,
  experience: user.experience ?? null,
  project: user.project ?? null,
});

export const getAllUsers = async (): Promise<ApiUser[]> => {
  const response = await fetch(`${API_USERS_URL}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const data: ApiUser[] = await response.json();
  return data.map(normalizeUser);
};

export const getUserById = async (userId: number): Promise<ApiUser> => {
  const response = await fetch(`${API_USERS_URL}/${userId}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const data: ApiUser = await response.json();
  return normalizeUser(data);
};

export const updateProfilUser = async (
  userId: number,
  payload: UpdateProfilUserPayload,
): Promise<ApiUser> => {
  const response = await fetch(`${API_USERS_URL}/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const apiMessage = errorBody as { error?: string; message?: string } | null;
    const message =
      apiMessage?.error ??
      apiMessage?.message ??
      `Erreur HTTP: ${response.status}`;
    throw new Error(message);
  }

  const data: ApiUser = await response.json();
  return normalizeUser(data);
};

export const DeleteProfilUser = async (
  userId: number,
): Promise<void> => {
  const response = await fetch(`${API_USERS_URL}/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const apiMessage = errorBody as { error?: string; message?: string } | null;
    const message =
      apiMessage?.error ??
      apiMessage?.message ??
      `Erreur HTTP: ${response.status}`;
    throw new Error(message);
  }
};
