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


export const getUserById = async (): Promise<ApiUser> => {
  const response = await fetch(`${API_USERS_URL}/me`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  const data: ApiUser = await response.json();
  return normalizeUser(data);
};

export const updateProfilUser = async (
  payload: UpdateProfilUserPayload,
): Promise<ApiUser> => {
  const response = await fetch(`${API_USERS_URL}/me`, {
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

export const DeleteProfilUser = async (): Promise<void> => {
  const response = await fetch(`${API_USERS_URL}/me`, {
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

const readErrorMessage = async (response: Response): Promise<string> => {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const errorBody = (await response.json().catch(() => null)) as
      | { error?: string; message?: string }
      | null;
    return (
      errorBody?.error ??
      errorBody?.message ??
      `Erreur HTTP: ${response.status}`
    );
  }
  const text = await response.text().catch(() => "");
  const cleaned = text.replace(/^Erreur:\s*/i, "").trim();
  return cleaned || `Erreur HTTP: ${response.status}`;
};

export type ProfileDocumentResponse = {
  status: "SENT" | "FAILED" | string;
  recipient?: string | null;
  documentName?: string | null;
  message: string;
};

export const exportProfileDocument = async (): Promise<string> => {
  const response = await fetch(`${API_USERS_URL}/me/profile-document`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const data = (await response.json().catch(() => null)) as
    | ProfileDocumentResponse
    | null;

  return (
    data?.message?.trim() ||
    "Le CV PDF a été envoyé par email"
  );
};
