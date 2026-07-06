import type {
  EducationItem,
  ExperienceItem,
  ProjectItem,
} from "./types/UserProfile.types";
import type { ProfileItemField } from "./types/profile.types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export const API_AUTH_URL = `${API_BASE_URL}/auth`;
export const API_USERS_URL = `${API_BASE_URL}/users`;
export const API_KNOWLEDGES_URL = `${API_BASE_URL}/knowledges`;
export const API_PASSWORD_RESET_URL = `${API_AUTH_URL}/password-reset`;

export const BAN_API_URL = "https://api-adresse.data.gouv.fr/search";

export const FRANCE = "France";

export const EDUCATION_FIELDS: ProfileItemField<EducationItem>[] = [
  {
    key: "name",
    label: "Titre de la formation",
    placeholder: "Licence Informatique",
  },
  {
    key: "school",
    label: "Établissement",
    placeholder: "Université Paris",
  },
  {
    key: "dateStart",
    label: "Date de début",
    type: "date",
    halfWidth: true,
  },
  {
    key: "dateEnd",
    label: "Date de fin",
    type: "date",
    halfWidth: true,
  },
];

export const EXPERIENCE_FIELDS: ProfileItemField<ExperienceItem>[] = [
  {
    key: "job",
    label: "Poste",
    placeholder: "Développeur Full Stack",
  },
  {
    key: "company",
    label: "Entreprise",
    placeholder: "ACME",
  },
  {
    key: "dateStart",
    label: "Date de début",
    type: "date",
    halfWidth: true,
  },
  {
    key: "dateEnd",
    label: "Date de fin",
    type: "date",
    halfWidth: true,
  },
];

export const PROJECT_FIELDS: ProfileItemField<ProjectItem>[] = [
  {
    key: "name",
    label: "Nom du projet",
    placeholder: "TrocSkillHub",
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Objectif et résumé du projet",
  },
  {
    key: "links",
    label: "Lien",
    placeholder: "https://example.com",
  },
  {
    key: "dateStart",
    label: "Date de début",
    type: "date",
    halfWidth: true,
  },
  {
    key: "dateEnd",
    label: "Date de fin",
    type: "date",
    halfWidth: true,
  },
];
