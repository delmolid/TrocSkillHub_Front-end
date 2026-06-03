import React, {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, type CurrentUser } from "../services/authService";

interface AuthContextValue {
  user: CurrentUser | undefined;
  userId: number | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    retry: false,
  });

  const value: AuthContextValue = {
    user: data,
    userId: data?.id,
    isLoading,
    isError,
    error: error as Error | null,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

/** Hook d'accès au contexte auth (useContext) */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
