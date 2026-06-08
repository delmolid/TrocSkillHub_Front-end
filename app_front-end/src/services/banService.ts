import { BAN_API_URL } from "../constantes";
import type {
  BanCommuneSuggestion,
  BanFeature,
  BanSearchResponse,
} from "../types/ban.types";

const normalizeCity = (value: string): string =>
  value
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const toSuggestion = (feature: BanFeature): BanCommuneSuggestion | null => {
  const props = feature.properties;
  if (!props) return null;

  const cityRaw = props.city?.trim() || props.name?.trim() || "";
  if (!cityRaw) return null;

  const city = normalizeCity(cityRaw);
  const postalCode = props.postcode?.trim() ?? "";
  const citycode = props.citycode?.trim() ?? "";
  const label =
    props.label?.trim() ||
    (postalCode ? `${city} (${postalCode})` : city);

  return {
    code: citycode ? `${citycode}-${postalCode}` : `${city}-${postalCode}`,
    city,
    postalCode,
    label,
  };
};

const dedupeSuggestions = (
  suggestions: BanCommuneSuggestion[],
): BanCommuneSuggestion[] => {
  const seen = new Set<string>();
  return suggestions.filter((item) => {
    const key = `${item.city}|${item.postalCode}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

/** French National Address API (BAN). @see https://adresse.data.gouv.fr/api-doc/adresse */
export const searchBanCommunes = async (
  query: string,
  limit = 12,
): Promise<BanCommuneSuggestion[]> => {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return [];
  }

  const url = new URL(BAN_API_URL);
  url.searchParams.set("q", trimmed);
  url.searchParams.set("type", "municipality");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("autocomplete", "1");

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `Erreur API BAN (${response.status}). Réessayez plus tard.`,
    );
  }

  const payload = (await response.json()) as BanSearchResponse;
  const suggestions = (payload.features ?? [])
    .map(toSuggestion)
    .filter((item): item is BanCommuneSuggestion => item !== null);

  return dedupeSuggestions(suggestions).slice(0, limit);
};
