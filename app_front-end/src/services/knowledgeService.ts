import { API_KNOWLEDGES_URL } from "../constantes";
import type { Knowledge } from "../types/knowledge.types";

export const getKnowledges = async (): Promise<Knowledge[]> => {
  const response = await fetch(API_KNOWLEDGES_URL, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json();
};
