import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  DeleteProfilUser,
  exportProfileDocument,
  getAllUsers,
  getUserById,
  updateProfilUser,
} from "../services/userService";
import type { UpdateProfilUserVariables } from "../types/auth.types";
import { useToast, TOAST_SEVERITY } from "../context/ToastContext";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function useUserQuery() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: () => getUserById(),
  });
}

export function useUsersQuery(enabled = true) {
  return useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    enabled,
  });
}

export function useUpdateProfilUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: UpdateProfilUserVariables) =>
      updateProfilUser(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user", "me"], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useDeleteProfilUser() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => DeleteProfilUser(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user", "me"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      showToast({
        severity: "success",
        detail: "La suppression de votre compte a bien été prise en compte",
        life: 3000,
        className: TOAST_SEVERITY.success,
        contentClassName: "flex items-center gap-3 px-3.5 py-3",
      });
      setTimeout(() => navigate({ to: "/login" }), 3000);
    },
    onError: (error: Error) => {
      showToast({
        severity: "error",
        summary: "Erreur",
        detail: error.message ?? "Une erreur est survenue.",
        life: 4000,
        className: TOAST_SEVERITY.error,
        contentClassName: "flex items-center gap-3 px-3.5 py-3",
      });
    },
  });
}

export function useExportProfileDocument() {
  const { showToast } = useToast();

  return useMutation({
    mutationFn: () => exportProfileDocument(),
    onSuccess: (message) => {
      showToast({
        severity: "success",
        summary: "Export réussi",
        detail: message,
        life: 4000,
        className: TOAST_SEVERITY.success,
        contentClassName: "flex items-center gap-3 px-3.5 py-3",
      });
    },
    onError: (error: Error) => {
      showToast({
        severity: "error",
        summary: "Erreur d'export",
        detail:
          error.message ??
          "Impossible d'exporter votre profil. Veuillez réessayer.",
        life: 5000,
        className: TOAST_SEVERITY.error,
        contentClassName: "flex items-center gap-3 px-3.5 py-3",
      });
    },
  });
}
