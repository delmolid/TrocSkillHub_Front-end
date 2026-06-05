import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchBanCommunes } from "../services/banService";

export const useBanCommuneSearch = (query: string, enabled: boolean) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), 350);
    return () => window.clearTimeout(timer);
  }, [query]);

  const trimmed = debouncedQuery.trim();
  const canSearch = enabled && trimmed.length >= 2;

  return useQuery({
    queryKey: ["ban", "communes", trimmed],
    queryFn: () => searchBanCommunes(trimmed),
    enabled: canSearch,
    staleTime: 60_000,
  });
};
