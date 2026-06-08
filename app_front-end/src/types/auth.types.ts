import type { ReactNode } from "react";
import type { UpdateProfilUserPayload } from "./UserProfile.types";

export interface CurrentUser {
  id: number;
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
  userId: number | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export interface UpdateProfilUserVariables {
  userId: number;
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
