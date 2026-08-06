import { API_KNOWLEDGES_URL } from "../constantes";
import type { Knowledge } from "../types/knowledge.types";
import { apiFetch } from "./apiFetch";

export const getKnowledges = async (): Promise<Knowledge[]> => {
  const response = await apiFetch(API_KNOWLEDGES_URL);

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json();
};
