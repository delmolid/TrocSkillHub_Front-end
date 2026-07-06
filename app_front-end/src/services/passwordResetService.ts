import { API_PASSWORD_RESET_URL } from "../constantes";
import type {
  PasswordResetPayload,
  PasswordResetRequestPayload,
  PasswordResetVerifyPayload,
} from "../types/auth.types";

const DEFAULT_ERROR_MESSAGE = "Une erreur est survenue. Veuillez réessayer.";

async function postPasswordReset(path: string, body: unknown): Promise<string> {
  const response = await fetch(`${API_PASSWORD_RESET_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const result: string = await response.text();

  if (!response.ok) {
    throw new Error(result || DEFAULT_ERROR_MESSAGE);
  }

  return result;
}

export const requestPasswordReset = async (
  data: PasswordResetRequestPayload,
): Promise<string> => {
  try {
    return await postPasswordReset("/request", data);
  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation:", error);
    throw error;
  }
};

export const verifyPasswordResetCode = async (
  data: PasswordResetVerifyPayload,
): Promise<string> => {
  try {
    return await postPasswordReset("/verify", data);
  } catch (error) {
    console.error("Erreur lors de la vérification du code:", error);
    throw error;
  }
};

export const resetPassword = async (
  data: PasswordResetPayload,
): Promise<string> => {
  try {
    return await postPasswordReset("/reset", data);
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe:", error);
    throw error;
  }
};
