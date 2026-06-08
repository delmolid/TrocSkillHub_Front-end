import type {
  EducationItem,
  ExperienceItem,
  needs,
  ProjectItem,
  skills,
} from "../types/UserProfile.types";
import type { Knowledge } from "../types/knowledge.types";

export function resolveKnowledgeIds<
  T extends { knowledgeId?: number; knowledgeName?: string },
>(items: T[], knowledges: Knowledge[]): T[] {
  return items.map((item) => {
    if (item.knowledgeId != null) return item;
    const matched = knowledges.find((k) => k.name === item.knowledgeName);
    if (!matched) return item;
    return { ...item, knowledgeId: matched.id, knowledgeName: matched.name };
  });
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function trimOptional(value?: string): string | undefined {
  const trimmed = value?.trim();
  return trimmed || undefined;
}

/** Normalizes an API date to the format expected by input[type=date] (YYYY-MM-DD). */
export function normalizeDateForInput(value?: string): string {
  if (!value?.trim()) return "";

  const trimmed = value.trim();
  if (ISO_DATE_PATTERN.test(trimmed)) return trimmed;

  const isoDateTime = /^(\d{4}-\d{2}-\d{2})T/.exec(trimmed);
  if (isoDateTime) return isoDateTime[1];

  const yearMonth = /^(\d{4})-(\d{2})$/.exec(trimmed);
  if (yearMonth) return `${yearMonth[1]}-${yearMonth[2]}-01`;

  const yearOnly = /^(\d{4})$/.exec(trimmed);
  if (yearOnly) return `${yearOnly[1]}-01-01`;

  return "";
}

function sanitizeDate(value?: string): string | undefined {
  const trimmed = trimOptional(value);
  if (!trimmed) return undefined;
  return ISO_DATE_PATTERN.test(trimmed) ? trimmed : undefined;
}

function hasValue(...values: Array<string | undefined>): boolean {
  return values.some((value) => Boolean(value?.trim()));
}

export function emptyEducationItem(): EducationItem {
  return {
    name: "",
    school: "",
    dateStart: "",
    dateEnd: "",
  };
}

export function emptyExperienceItem(): ExperienceItem {
  return {
    job: "",
    company: "",
    dateStart: "",
    dateEnd: "",
  };
}

export function emptyProjectItem(): ProjectItem {
  return {
    name: "",
    description: "",
    links: "",
    dateStart: "",
    dateEnd: "",
  };
}

export function educationItemsForEdit(items: EducationItem[]): EducationItem[] {
  if (!items.length) return [emptyEducationItem()];

  return items.map((item) => ({
    name: item.name ?? "",
    school: item.school ?? "",
    dateStart: normalizeDateForInput(item.dateStart),
    dateEnd: normalizeDateForInput(item.dateEnd),
  }));
}

export function experienceItemsForEdit(items: ExperienceItem[]): ExperienceItem[] {
  if (!items.length) return [emptyExperienceItem()];

  return items.map((item) => ({
    job: item.job ?? "",
    company: item.company ?? "",
    dateStart: normalizeDateForInput(item.dateStart),
    dateEnd: normalizeDateForInput(item.dateEnd),
  }));
}

export function projectItemsForEdit(items: ProjectItem[]): ProjectItem[] {
  if (!items.length) return [emptyProjectItem()];

  return items.map((item) => ({
    name: item.name ?? "",
    description: item.description ?? "",
    links: item.links ?? "",
    dateStart: normalizeDateForInput(item.dateStart),
    dateEnd: normalizeDateForInput(item.dateEnd),
  }));
}

export function sanitizeEducationItems(items: EducationItem[]): EducationItem[] {
  return items
    .filter((item) =>
      hasValue(item.name, item.school, item.dateStart, item.dateEnd),
    )
    .map((item) => ({
      name: trimOptional(item.name),
      school: trimOptional(item.school),
      dateStart: sanitizeDate(item.dateStart),
      dateEnd: sanitizeDate(item.dateEnd),
    }));
}

export function sanitizeExperienceItems(items: ExperienceItem[]): ExperienceItem[] {
  return items
    .filter((item) =>
      hasValue(item.job, item.company, item.dateStart, item.dateEnd),
    )
    .map((item) => ({
      job: trimOptional(item.job),
      company: trimOptional(item.company),
      dateStart: sanitizeDate(item.dateStart),
      dateEnd: sanitizeDate(item.dateEnd),
    }));
}

export function sanitizeProjectItems(items: ProjectItem[]): ProjectItem[] {
  return items
    .filter((item) =>
      hasValue(
        item.name,
        item.description,
        item.links,
        item.dateStart,
        item.dateEnd,
      ),
    )
    .map((item) => ({
      name: trimOptional(item.name),
      description: trimOptional(item.description),
      links: trimOptional(item.links),
      dateStart: sanitizeDate(item.dateStart),
      dateEnd: sanitizeDate(item.dateEnd),
    }));
}

export function knowledgeItemsForSave(
  items: Array<skills | needs>,
): Array<{ knowledgeId: number; knowledgeName: string }> {
  return items
    .filter((item) => item.knowledgeId != null && item.knowledgeName?.trim())
    .map((item) => ({
      knowledgeId: item.knowledgeId!,
      knowledgeName: item.knowledgeName!.trim(),
    }));
}

function splitBlocks(value: string): string[] {
  return value
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function formatPeriod(dateStart?: string, dateEnd?: string): string {
  if (dateStart && dateEnd) return `${dateStart} - ${dateEnd}`;
  return dateStart ?? dateEnd ?? "";
}

function parseMetaLine(line: string): {
  label?: string;
  dateStart?: string;
  dateEnd?: string;
} {
  const separatorIndex = line.indexOf("•");
  if (separatorIndex === -1) {
    const trimmed = line.trim();
    return trimmed ? { label: trimmed } : {};
  }

  const label = line.slice(0, separatorIndex).trim();
  const periodPart = line.slice(separatorIndex + 1).trim();
  const [dateStart, dateEnd] = periodPart.split(/\s*-\s*/);

  return {
    label: label || undefined,
    dateStart: dateStart?.trim() || undefined,
    dateEnd: dateEnd?.trim() || undefined,
  };
}

function blockToLines(block: string): string[] {
  return block
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line, index, lines) => {
      const trimmed = line.trim();
      if (trimmed) return true;
      return lines.slice(index + 1).some((next) => next.trim());
    });
}

export function educationsToText(items: EducationItem[]): string {
  return items
    .map((item) => {
      const lines: string[] = [];
      if (item.name?.trim()) lines.push(item.name.trim());

      const period = formatPeriod(item.dateStart, item.dateEnd);
      if (item.school?.trim() && period) {
        lines.push(`${item.school.trim()} • ${period}`);
      } else if (item.school?.trim()) {
        lines.push(item.school.trim());
      } else if (period) {
        lines.push(period);
      }

      return lines.join("\n");
    })
    .filter(Boolean)
    .join("\n\n");
}

export function textToEducations(value: string): EducationItem[] {
  return splitBlocks(value).map((block) => {
    const lines = blockToLines(block);
    if (lines.length === 0) return null;

    const item: EducationItem = { name: lines[0].trim() };

    if (lines.length > 1) {
      const meta = parseMetaLine(lines[1]);
      if (meta.label || meta.dateStart || meta.dateEnd) {
        item.school = meta.label;
        item.dateStart = meta.dateStart;
        item.dateEnd = meta.dateEnd;
      }
    }

    return item;
  }).filter((item): item is EducationItem => item !== null);
}

export function experiencesToText(items: ExperienceItem[]): string {
  return items
    .map((item) => {
      const lines: string[] = [];
      if (item.job?.trim()) lines.push(item.job.trim());

      const period = formatPeriod(item.dateStart, item.dateEnd);
      if (item.company?.trim() && period) {
        lines.push(`${item.company.trim()} • ${period}`);
      } else if (item.company?.trim()) {
        lines.push(item.company.trim());
      } else if (period) {
        lines.push(period);
      }

      return lines.join("\n");
    })
    .filter(Boolean)
    .join("\n\n");
}

export function textToExperiences(value: string): ExperienceItem[] {
  return splitBlocks(value).map((block) => {
    const lines = blockToLines(block);
    if (lines.length === 0) return null;

    const item: ExperienceItem = { job: lines[0].trim() };

    if (lines.length > 1) {
      const meta = parseMetaLine(lines[1]);
      if (meta.label || meta.dateStart || meta.dateEnd) {
        item.company = meta.label;
        item.dateStart = meta.dateStart;
        item.dateEnd = meta.dateEnd;
      }
    }

    return item;
  }).filter((item): item is ExperienceItem => item !== null);
}

const LINK_PREFIX = /^lien\s*:\s*/i;

export function projectsToText(items: ProjectItem[]): string {
  return items
    .map((item) => {
      const lines: string[] = [];
      if (item.name?.trim()) lines.push(item.name.trim());

      const period = formatPeriod(item.dateStart, item.dateEnd);
      if (period) lines.push(period);

      if (item.description?.trim()) lines.push(item.description.trim());
      if (item.links?.trim()) lines.push(`Lien : ${item.links.trim()}`);
      return lines.join("\n");
    })
    .filter(Boolean)
    .join("\n\n");
}

export function textToProjects(value: string): ProjectItem[] {
  return splitBlocks(value).map((block) => {
    const lines = blockToLines(block);
    if (lines.length === 0) return null;

    const item: ProjectItem = { name: lines[0].trim() };
    const bodyLines: string[] = [];

    for (let i = 1; i < lines.length; i += 1) {
      const line = lines[i].trim();
      if (!line) continue;

      if (LINK_PREFIX.test(line)) {
        item.links = line.replace(LINK_PREFIX, "").trim();
        continue;
      }

      if (i === 1 && !line.includes("•") && /^\d{4}(\s*-\s*\d{4})?$/.test(line)) {
        const [dateStart, dateEnd] = line.split(/\s*-\s*/);
        item.dateStart = dateStart?.trim();
        item.dateEnd = dateEnd?.trim();
        continue;
      }

      bodyLines.push(line);
    }

    if (bodyLines.length > 0) {
      item.description = bodyLines.join("\n");
    }

    return item;
  }).filter((item): item is ProjectItem => item !== null);
}
