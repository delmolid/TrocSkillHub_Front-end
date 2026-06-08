import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getUserById, updateProfilUser } from "../services/userService";
import type { UpdateProfilUserVariables } from "../types/auth.types";

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
