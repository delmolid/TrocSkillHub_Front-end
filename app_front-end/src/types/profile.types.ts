import type { ReactNode } from "react";
import type { Knowledge } from "./knowledge.types";
import type {
  EducationItem,
  ExperienceItem,
  needs,
  ProjectItem,
  skills,
} from "./UserProfile.types";

export type FieldType = "text" | "textarea" | "date";

export type ProfileItemField<T> = {
  key: keyof T;
  label: string;
  type?: FieldType;
  placeholder?: string;
  halfWidth?: boolean;
};

export interface ProfileItemsEditorProps<T extends object> {
  id: string;
  label: string;
  items: T[];
  fields: ProfileItemField<T>[];
  createEmpty: () => T;
  itemTitle: (index: number) => string;
  onChange: (items: T[]) => void;
}

export type ProfileSectionKey =
  | "identity"
  | "about"
  | "skills"
  | "needs"
  | "education"
  | "experience"
  | "projects";

export type IdentityForm = {
  firstName: string;
  lastName: string;
  city: string;
  country: string;
};

export type SectionEditState =
  | { section: "identity"; data: IdentityForm }
  | { section: "about"; data: string }
  | { section: "skills"; data: skills[] }
  | { section: "needs"; data: needs[] }
  | { section: "education"; data: EducationItem[] }
  | { section: "experience"; data: ExperienceItem[] }
  | { section: "projects"; data: ProjectItem[] };

export interface EditableProfileCardProps {
  isEditing: boolean;
  isActive: boolean;
  onEditClick: () => void;
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
  editLabel?: string;
  className?: string;
  bordered?: boolean;
  editContent: ReactNode;
  children: ReactNode;
}

export interface KnowledgeListEditorProps {
  id: string;
  label: string;
  items: skills[];
  knowledges: Knowledge[];
  isLoading?: boolean;
  isError?: boolean;
  onChange: (items: skills[]) => void;
}

export interface SectionCardProps {
  title: string;
  emptyMessage: string;
  isEmpty: boolean;
  isEditing: boolean;
  isActive: boolean;
  onEditClick: () => void;
  onCancel: () => void;
  onSave: () => void;
  isSaving: boolean;
  editLabel: string;
  editContent: ReactNode;
  children: ReactNode;
}
