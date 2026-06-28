import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { DeleteProfilUser, getUserById, updateProfilUser } from "../services/userService";
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

export function useUserQuery(userId: number) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: userId > 0,
  });
}

export function useUpdateProfilUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: UpdateProfilUserVariables) =>
      updateProfilUser(userId, data),
    onSuccess: (updatedUser, { userId }) => {
      queryClient.setQueryData(["user", userId], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}

export function useDeleteProfilUser() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ userId }: { userId: number }) =>
      DeleteProfilUser(userId),
    onSuccess: (_response, { userId }) => {
      queryClient.removeQueries({ queryKey: ["user", userId] });
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
