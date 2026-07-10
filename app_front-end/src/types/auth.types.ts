import type { ReactNode } from "react";
import type { UpdateProfilUserPayload } from "./UserProfile.types";

export interface CurrentUser {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  country: string;
}

export interface RegisterPayload {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  city: string;
  country: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginFields {
  email: string;
  password: string;
}

export interface RegisterFields {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  confirmPassword: string;
  city: string;
}

export interface AuthContextValue {
  user: CurrentUser | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export interface UpdateProfilUserVariables {
  data: UpdateProfilUserPayload;
}

export type FranceCityAutocompleteProps = {
  value: string;
  onChange: (city: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
};

export type AuthMessageVariant = "error" | "success";

export interface AuthMessageProps {
  variant: AuthMessageVariant;
  children: ReactNode;
}

export type PasswordResetStep = "email" | "code" | "newPassword" | "success";

export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetVerifyPayload {
  email: string;
  code: string;
}

export interface PasswordResetPayload {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordResetEmailFields {
  email: string;
}

export interface PasswordResetCodeFields {
  code: string;
}

export interface PasswordResetNewPasswordFields {
  newPassword: string;
  confirmPassword: string;
}
