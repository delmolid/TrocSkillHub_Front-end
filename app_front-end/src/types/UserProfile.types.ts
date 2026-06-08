

/** Corps partiel accepté par PATCH /users/:id */
export type UpdateProfilUserPayload = Partial<ApiUser>;

export interface EducationItem {
  name?: string;
  school?: string;
  dateStart?: Date;
  dateEnd?: Date;
}

export interface ExperienceItem {
  job?: string;
  company?: string;
  dateStart?: Date;
  dateEnd?: Date;
}

export interface ProjectItem {
  name?: string;
  description?: string;
  links?: string;
  dateStart?: Date;
  dateEnd?: Date;
}

export type ProfileSectionData =
  | string
  | EducationItem
  | ExperienceItem
  | ProjectItem
  | EducationItem[]
  | ExperienceItem[]
  | ProjectItem[]
  | null;

export interface ApiUser {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  address?: string | null;
  city: string;
  country: string;
  phoneNumber: string | null;
  description: string | null;
  skills: skills[];
  needs: needs[];
  education: ProfileSectionData;
  experience: ProfileSectionData;
  project: ProfileSectionData;
}

export interface skills {
  knowledgeId?: number;
  knowledgeName?: string;
  level?: string;
  type?: string;
}

export interface needs {
  knowledgeId?: number;
  knowledgeName?: string;
  level?: string;
  type?: string;
}

export interface UserCardData {
  photo: string;
  prenom: string;
  nom: string;
  ville: string;
  linkedin?: string;
  instagram?: string;
}

export interface UserProfile extends UserCardData {
  about: string;
  competences: string[];
  besoins: string[];
  formations: string;
  experiences: string;
  projets: string;
}

export interface ProfilPageProps {
  userID: number;
}
