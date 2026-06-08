import { useQuery } from "@tanstack/react-query";
import { getKnowledges } from "../services/knowledgeService";

export function useKnowledgesQuery(enabled = true) {
  return useQuery({
    queryKey: ["knowledges"],
    queryFn: getKnowledges,
    enabled,
    staleTime: 5 * 60_000,
  });
}
