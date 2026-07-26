import React, { useState } from "react";
import UserCard from "./UserCard";
import EditableProfileCard from "./EditableProfileCard";
import KnowledgeListEditor from "./KnowledgeListEditor";
import ProfileItemsEditor from "./ProfileItemsEditor";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useKnowledgesQuery } from "../../hooks/useKnowledgesQuery";
import {
  useExportProfileDocument,
  useUpdateProfilUser,
  useUserQuery,
} from "../../hooks/useUserQuery";
import { mapApiUserToUserCard, getUserDescription } from "../../utils/userMapper";
import 'primeicons/primeicons.css';
import {
  toSectionItems,
  getEducationTitle,
  getEducationSubtitle,
  getExperienceTitle,
  getExperienceSubtitle,
  getProjectTitle,
} from "../../utils/profileSections";
import {
  educationItemsForEdit,
  emptyEducationItem,
  emptyExperienceItem,
  emptyProjectItem,
  experienceItemsForEdit,
  knowledgeItemsForSave,
  projectItemsForEdit,
  resolveKnowledgeIds,
  sanitizeEducationItems,
  sanitizeExperienceItems,
  sanitizeProjectItems,
} from "../../utils/profileEditHelpers";
import {
  EDUCATION_FIELDS,
  EXPERIENCE_FIELDS,
  PROJECT_FIELDS,
} from "../../constantes";
import type {
  EducationItem,
  ExperienceItem,
  ProjectItem,
} from "../../types/UserProfile.types";
import type {
  ProfileSectionKey,
  SectionCardProps,
  SectionEditState,
} from "../../types/profile.types";
import { ProfileDeleteModal } from "./ProfileDeleteModal.component";

function SectionCard({
  title,
  emptyMessage,
  isEmpty,
  isEditing,
  isActive,
  onEditClick,
  onCancel,
  onSave,
  isSaving,
  editLabel,
  editContent,
  children,
}: SectionCardProps) {
  return (
    <EditableProfileCard
      isEditing={isEditing}
      isActive={isActive}
      onEditClick={onEditClick}
      onCancel={onCancel}
      onSave={onSave}
      isSaving={isSaving}
      editLabel={editLabel}
      editContent={editContent}
    >
      <h3 className="mb-4 border-b-2 border-gray-100 pb-2 text-base font-semibold text-text">
        {title}
      </h3>
      {isEmpty ? (
        <p className="text-sm text-text italic">{emptyMessage}</p>
      ) : (
        children
      )}
    </EditableProfileCard>
  );
}

const TOOLTIP_OPTIONS = {
  position: "bottom" as const,
  showDelay: 300,
  className: [
    "[&_.p-tooltip-text]:bg-page-bg",
    "[&_.p-tooltip-text]:text-text",
    "[&_.p-tooltip-text]:font-body",
    "[&_.p-tooltip-text]:text-sm",
    "[&_.p-tooltip-text]:font-medium",
    "[&_.p-tooltip-text]:rounded-lg",
    "[&_.p-tooltip-text]:px-3",
    "[&_.p-tooltip-text]:py-1.5",
    "[&_.p-tooltip-text]:border",
    "[&_.p-tooltip-text]:border-primary-border/30",
    "[&_.p-tooltip-text]:shadow-md",
    "[&_.p-tooltip-arrow]:!border-b-page-bg",
  ].join(" "),
};

const ProfileMain: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [sectionEdit, setSectionEdit] = useState<SectionEditState | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const activeSection = sectionEdit?.section ?? null;

  const { data: user, isLoading, isError, error, refetch } = useUserQuery();
  const { mutate: updateProfil, isPending: isSaving } = useUpdateProfilUser();
  const {
    mutate: exportProfile,
    isPending: isExporting,
  } = useExportProfileDocument();
  const {
    data: knowledges = [],
    isLoading: knowledgesLoading,
    isError: knowledgesError,
  } = useKnowledgesQuery(isEditing);

  const closeEdit = () => {
    setSectionEdit(null);
    setSaveError(null);
  };
 
  const startEdit = (section: ProfileSectionKey) => {
    if (!user) return;
    setSaveError(null);

    switch (section) {
      case "identity":
        setSectionEdit({
          section: "identity",
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            city: user.city,
            country: user.country,
          },
        });
        break;
      case "about":
        setSectionEdit({ section: "about", data: user.description ?? "" });
        break;
      case "skills":
        setSectionEdit({
          section: "skills",
          data: resolveKnowledgeIds(
            user.skills?.length ? [...user.skills] : [{ knowledgeName: "" }],
            knowledges,
          ),
        });
        break;
      case "needs":
        setSectionEdit({
          section: "needs",
          data: resolveKnowledgeIds(
            user.needs?.length ? [...user.needs] : [{ knowledgeName: "" }],
            knowledges,
          ),
        });
        break;
      case "education":
        setSectionEdit({
          section: "education",
          data: educationItemsForEdit(
            toSectionItems<EducationItem>(user.education),
          ),
        });
        break;
      case "experience":
        setSectionEdit({
          section: "experience",
          data: experienceItemsForEdit(
            toSectionItems<ExperienceItem>(user.experience),
          ),
        });
        break;
      case "projects":
        setSectionEdit({
          section: "projects",
          data: projectItemsForEdit(toSectionItems<ProjectItem>(user.project)),
        });
        break;
    }
  };

  const saveSection = (data: Parameters<typeof updateProfil>[0]["data"]) => {
    setSaveError(null);
    updateProfil(
      { data },
      {
        onSuccess: () => closeEdit(),
        onError: (err) => {
          setSaveError(
            err instanceof Error ? err.message : "Erreur lors de l'enregistrement",
          );
        },
      },
    );
  };

  if (isLoading) {
    return (
      <main className="mx-auto min-h-[400px] max-w-[1400px] bg-page-bg px-5 py-8">
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-5">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
          <p className="text-base text-text">Chargement du profil...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto min-h-[400px] max-w-[1400px] bg-page-bg px-5 py-8">
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-5">
          <p className="rounded-lg border-l-4 border-red-600 bg-red-50 px-5 py-4 text-red-700">
            {(error as Error).message}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-accent"
          >
            Réessayer
          </button>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-[1400px] bg-page-bg px-5 py-8">
        <p className="py-16 text-center text-lg text-text">
          Aucun utilisateur trouvé
        </p>
      </main>
    );
  }

  const userCardData = mapApiUserToUserCard(user);
  const description = getUserDescription(user);
  const skills = user.skills ?? [];
  const needs = user.needs ?? [];
  const educations = toSectionItems<EducationItem>(user.education);
  const experiences = toSectionItems<ExperienceItem>(user.experience);
  const projects = toSectionItems<ProjectItem>(user.project);

  const isSectionActive = (section: ProfileSectionKey) => activeSection === section;

  const errorBanner = saveError && activeSection ? (
    <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {saveError}
    </p>
  ) : null;

  return (
    <main className="flex w-full min-h-screen flex-col gap-y-4 bg-page-bg px-5 py-8">
      <div className="flex justify-end gap-x-2">
        <Button
          type="button"
          icon="pi pi-file-export"
          label="Exporter mon profil"
          className="ts-btn-profile ts-btn-secondary"
          tooltip="Recevoir mon profil en PDF par email"
          tooltipOptions={TOOLTIP_OPTIONS}
          loading={isExporting}
          disabled={isExporting}
          onClick={() => exportProfile()}
        />

        <Button
          type="button"
          icon="pi pi-user-edit"
          severity={isEditing ? "secondary" : undefined}
          outlined={isEditing}
          className="ts-btn-profile ts-btn-secondary"
          tooltip={isEditing ? "Terminer" : "modifier"}
          tooltipOptions={TOOLTIP_OPTIONS}
          onClick={() => {
            if (isEditing) {
              setSectionEdit(null);
              setSaveError(null);
            }
            setIsEditing(!isEditing);
          }}
        />

        <Button
          type="button"
          icon="pi pi-trash"
          severity="danger"
          outlined
          className="ts-btn-profile ts-btn-secondary"
          tooltip="Supprimer mon profil"
          tooltipOptions={TOOLTIP_OPTIONS}
          onClick={() => setDeleteModalVisible(true)}
        />
        <ProfileDeleteModal
          visible={deleteModalVisible}
          onHide={() => setDeleteModalVisible(false)}
        />
       
      </div>

      <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-start">
        <aside className="w-full shrink-0 lg:sticky lg:top-5 lg:w-64">
          <EditableProfileCard
            isEditing={isEditing}
            isActive={isSectionActive("identity")}
            onEditClick={() => startEdit("identity")}
            onCancel={closeEdit}
            onSave={() =>
              sectionEdit?.section === "identity" &&
              saveSection(sectionEdit.data)
            }
            isSaving={isSaving}
            editLabel="Modifier la carte identité"
            bordered={false}
            className="p-0 shadow-none"
            editContent={
              sectionEdit?.section === "identity" && (
                <div className="space-y-4 p-5">
                  {errorBanner}
                  <div className="profile-field space-y-2">
                    <label htmlFor="firstName" className="profile-field-label">
                      Prénom
                    </label>
                    <InputText
                      id="firstName"
                      value={sectionEdit.data.firstName}
                      onChange={(e) =>
                        setSectionEdit({
                          section: "identity",
                          data: {
                            ...sectionEdit.data,
                            firstName: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="profile-field space-y-2">
                    <label htmlFor="lastName" className="profile-field-label">
                      Nom
                    </label>
                    <InputText
                      id="lastName"
                      value={sectionEdit.data.lastName}
                      onChange={(e) =>
                        setSectionEdit({
                          section: "identity",
                          data: {
                            ...sectionEdit.data,
                            lastName: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="profile-field space-y-2">
                    <label htmlFor="city" className="profile-field-label">
                      Ville
                    </label>
                    <InputText
                      id="city"
                      value={sectionEdit.data.city}
                      onChange={(e) =>
                        setSectionEdit({
                          section: "identity",
                          data: { ...sectionEdit.data, city: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="profile-field space-y-2">
                    <label htmlFor="country" className="profile-field-label">
                      Pays
                    </label>
                    <InputText
                      id="country"
                      value={sectionEdit.data.country}
                      onChange={(e) =>
                        setSectionEdit({
                          section: "identity",
                          data: { ...sectionEdit.data, country: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              )
            }
          >
            <UserCard {...userCardData} />
          </EditableProfileCard>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col gap-5">
          <EditableProfileCard
            isEditing={isEditing}
            isActive={isSectionActive("about")}
            onEditClick={() => startEdit("about")}
            onCancel={closeEdit}
            onSave={() =>
              sectionEdit?.section === "about" &&
              saveSection({ description: sectionEdit.data })
            }
            isSaving={isSaving}
            editLabel="Modifier à propos de moi"
            editContent={
              sectionEdit?.section === "about" && (
                <div className="space-y-3">
                  {errorBanner}
                  <div className="profile-field space-y-2">
                  <label htmlFor="description" className="profile-field-label">
                    À propos de moi
                  </label>
                  <InputTextarea
                    id="description"
                    className="w-full"
                    value={sectionEdit.data}
                    onChange={(e) =>
                      setSectionEdit({ section: "about", data: e.target.value })
                    }
                    placeholder="Décrivez-vous en quelques lignes..."
                    rows={5}
                    autoResize
                  />
                  </div>
                </div>
              )
            }
          >
            <h2 className="mb-4 border-b-2 border-gray-100 pb-2 text-lg font-semibold text-text">
              À propos de moi
            </h2>
            <p className="text-sm leading-relaxed text-text">
              {description || "Aucune description disponible."}
            </p>
          </EditableProfileCard>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <EditableProfileCard
              isEditing={isEditing}
              isActive={isSectionActive("skills")}
              onEditClick={() => startEdit("skills")}
              onCancel={closeEdit}
              onSave={() =>
                sectionEdit?.section === "skills" &&
                saveSection({
                  skills: knowledgeItemsForSave(sectionEdit.data),
                })
              }
              isSaving={isSaving}
              editLabel="Modifier les compétences"
              editContent={
                sectionEdit?.section === "skills" && (
                  <div className="space-y-3">
                    {errorBanner}
                    <KnowledgeListEditor
                      id="skills"
                      label="Compétences"
                      items={sectionEdit.data}
                      knowledges={knowledges}
                      isLoading={knowledgesLoading}
                      isError={knowledgesError}
                      onChange={(data) =>
                        setSectionEdit({ section: "skills", data })
                      }
                    />
                  </div>
                )
              }
            >
              <h3 className="mb-4 text-base font-semibold text-text">
                Mes Compétences & expertises
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-text">
                {skills.length > 0 ? (
                  skills.map((skill, index) => (
                    <li key={`${skill.knowledgeName ?? "skill"}-${index}`}>
                      {skill.knowledgeName}
                    </li>
                  ))
                ) : (
                  <li className="list-none pl-0 text-text italic">
                    Aucune compétence renseignée
                  </li>
                )}
              </ul>
            </EditableProfileCard>

            <EditableProfileCard
              isEditing={isEditing}
              isActive={isSectionActive("needs")}
              onEditClick={() => startEdit("needs")}
              onCancel={closeEdit}
              onSave={() =>
                sectionEdit?.section === "needs" &&
                saveSection({
                  needs: knowledgeItemsForSave(sectionEdit.data),
                })
              }
              isSaving={isSaving}
              editLabel="Modifier les besoins"
              editContent={
                sectionEdit?.section === "needs" && (
                  <div className="space-y-3">
                    {errorBanner}
                    <KnowledgeListEditor
                      id="needs"
                      label="Besoins"
                      items={sectionEdit.data}
                      knowledges={knowledges}
                      isLoading={knowledgesLoading}
                      isError={knowledgesError}
                      onChange={(data) =>
                        setSectionEdit({ section: "needs", data })
                      }
                    />
                  </div>
                )
              }
            >
              <h3 className="mb-4 text-base font-semibold text-text">
                Mes Besoins
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-text">
                {needs.length > 0 ? (
                  needs.map((need, index) => (
                    <li key={`${need.knowledgeName ?? "need"}-${index}`}>
                      {need.knowledgeName}
                    </li>
                  ))
                ) : (
                  <li className="list-none pl-0 text-text italic">
                    Aucun besoin renseigné
                  </li>
                )}
              </ul>
            </EditableProfileCard>
          </div>

          <SectionCard
            title="Formations"
            emptyMessage="Aucune formation renseignée"
            isEmpty={educations.length === 0}
            isEditing={isEditing}
            isActive={isSectionActive("education")}
            onEditClick={() => startEdit("education")}
            onCancel={closeEdit}
            onSave={() =>
              sectionEdit?.section === "education" &&
              saveSection({
                education: sanitizeEducationItems(sectionEdit.data),
              })
            }
            isSaving={isSaving}
            editLabel="Modifier les formations"
            editContent={
              sectionEdit?.section === "education" && (
                <div className="space-y-3">
                  {errorBanner}
                  <ProfileItemsEditor
                    id="education"
                    label="Formations"
                    items={sectionEdit.data}
                    fields={EDUCATION_FIELDS}
                    createEmpty={emptyEducationItem}
                    itemTitle={(index) => `Formation ${index + 1}`}
                    onChange={(data) =>
                      setSectionEdit({ section: "education", data })
                    }
                  />
                </div>
              )
            }
          >
            {educations.length > 0 && (
              <div className="space-y-5">
                {educations.map((item, index) => {
                  const subtitle = getEducationSubtitle(item);
                  return (
                    <div
                      key={`edu-${index}`}
                      className="border-b border-primary-border pb-4 last:border-0 last:pb-0"
                    >
                      <h4 className="text-base font-semibold text-text">
                        {getEducationTitle(item)}
                      </h4>
                      {subtitle && (
                        <p className="mt-1 text-sm font-medium text-text">
                          {subtitle}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Expériences professionnelles"
            emptyMessage="Aucune expérience renseignée"
            isEmpty={experiences.length === 0}
            isEditing={isEditing}
            isActive={isSectionActive("experience")}
            onEditClick={() => startEdit("experience")}
            onCancel={closeEdit}
            onSave={() =>
              sectionEdit?.section === "experience" &&
              saveSection({
                experience: sanitizeExperienceItems(sectionEdit.data),
              })
            }
            isSaving={isSaving}
            editLabel="Modifier les expériences"
            editContent={
              sectionEdit?.section === "experience" && (
                <div className="space-y-3">
                  {errorBanner}
                  <ProfileItemsEditor
                    id="experience"
                    label="Expériences professionnelles"
                    items={sectionEdit.data}
                    fields={EXPERIENCE_FIELDS}
                    createEmpty={emptyExperienceItem}
                    itemTitle={(index) => `Expérience ${index + 1}`}
                    onChange={(data) =>
                      setSectionEdit({ section: "experience", data })
                    }
                  />
                </div>
              )
            }
          >
            {experiences.length > 0 && (
              <div className="space-y-5">
                {experiences.map((item, index) => {
                  const subtitle = getExperienceSubtitle(item);
                  return (
                    <div
                      key={`exp-${index}`}
                      className="border-b border-primary-border pb-4 last:border-0 last:pb-0"
                    >
                      <h4 className="text-base font-semibold text-text">
                        {getExperienceTitle(item)}
                      </h4>
                      {subtitle && (
                        <p className="mt-1 text-sm font-medium text-text">
                          {subtitle}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Projets réalisés"
            emptyMessage="Aucun projet renseigné"
            isEmpty={projects.length === 0}
            isEditing={isEditing}
            isActive={isSectionActive("projects")}
            onEditClick={() => startEdit("projects")}
            onCancel={closeEdit}
            onSave={() =>
              sectionEdit?.section === "projects" &&
              saveSection({
                project: sanitizeProjectItems(sectionEdit.data),
              })
            }
            isSaving={isSaving}
            editLabel="Modifier les projets"
            editContent={
              sectionEdit?.section === "projects" && (
                <div className="space-y-3">
                  {errorBanner}
                  <ProfileItemsEditor
                    id="projects"
                    label="Projets réalisés"
                    items={sectionEdit.data}
                    fields={PROJECT_FIELDS}
                    createEmpty={emptyProjectItem}
                    itemTitle={(index) => `Projet ${index + 1}`}
                    onChange={(data) =>
                      setSectionEdit({ section: "projects", data })
                    }
                  />
                </div>
              )
            }
          >
            {projects.length > 0 && (
              <div className="space-y-5">
                {projects.map((item, index) => (
                  <div
                    key={`proj-${index}`}
                    className="border-b border-primary-border pb-4 last:border-0 last:pb-0"
                  >
                    <h4 className="text-base font-semibold text-text">
                      {getProjectTitle(item)}
                    </h4>
                    {item.description && (
                      <p className="mt-2 text-sm leading-relaxed text-text">
                        {item.description}
                      </p>
                    )}
                    {item.links && (
                      <p className="mt-2 text-sm font-medium text-text">
                        Lien : {item.links}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </section>
      </div>
    </main>
  );
};

export default ProfileMain;
