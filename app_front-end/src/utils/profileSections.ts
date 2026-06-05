import type {
  EducationItem,
  ExperienceItem,
  ProfileSectionData,
  ProjectItem,
} from "../types/UserProfile.types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Normalise education | experience | project (null, objet, tableau ou texte) en liste */
export function toSectionItems<T extends Record<string, unknown>>(
  data: ProfileSectionData,
): T[] {
  if (data == null) return [];
  if (typeof data === "string") {
    const trimmed = data.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      return toSectionItems<T>(parsed as ProfileSectionData);
    } catch {
      return [{ description: trimmed } as T];
    }
  }
  if (Array.isArray(data)) {
    return data.filter(isRecord) as T[];
  }
  if (isRecord(data)) {
    return [data as T];
  }
  return [];
}

export function getEducationTitle(item: EducationItem): string {
  return item.name ?? item.name ?? "Formation";
}

export function getEducationSubtitle(item: EducationItem): string | null {
  const place = item.school ?? item.school ?? item.school;
  const period = item.dateStart ?? item.dateStart;
  if (place && period) return `${place} • ${period}`;
  return place ?? period ?? null;
}

export function getExperienceTitle(item: ExperienceItem): string {
  return item.job ?? "Expérience";
}

export function getExperienceSubtitle(item: ExperienceItem): string | null {
  const org = item.company;
  const period = item.dateStart ?? item.dateEnd;
  if (org && period) return `${org} • ${period}`;
  return org ?? period ?? null;
}

export function getProjectTitle(item: ProjectItem): string {
  return item.name ?? "Projet";
}
