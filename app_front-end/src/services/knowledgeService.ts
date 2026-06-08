import type { Knowledge } from "../types/knowledge.types";

const API_BASE_URL = "http://localhost:8099/api";

export const getKnowledges = async (): Promise<Knowledge[]> => {
  const response = await fetch(`${API_BASE_URL}/knowledges`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP: ${response.status}`);
  }

  return response.json();
};
