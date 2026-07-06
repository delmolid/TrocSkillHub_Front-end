import { useMutation } from "@tanstack/react-query";
import {
  requestPasswordReset,
  resetPassword,
  verifyPasswordResetCode,
} from "../services/passwordResetService";
import type {
  PasswordResetPayload,
  PasswordResetRequestPayload,
  PasswordResetVerifyPayload,
} from "../types/auth.types";

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (data: PasswordResetRequestPayload) => requestPasswordReset(data),
  });
}

export function useVerifyPasswordResetCode() {
  return useMutation({
    mutationFn: (data: PasswordResetVerifyPayload) => verifyPasswordResetCode(data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: PasswordResetPayload) => resetPassword(data),
  });
}
