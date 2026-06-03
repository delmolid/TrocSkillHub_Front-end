import { QueryClient, useQuery } from "@tanstack/react-query";
import { getUserById } from "../services/userService";

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
    queryKey: ["users", "detail", userId],
    queryFn: () => getUserById(userId),
    enabled: userId > 0,
  });
}
