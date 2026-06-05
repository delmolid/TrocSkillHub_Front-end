import React from "react";
import UserCard from "./UserCard";
import { useUserQuery } from "../../hooks/useUserQuery";
import { mapApiUserToUserCard, getUserDescription } from "../../utils/userMapper";
import {
  toSectionItems,
  getEducationTitle,
  getEducationSubtitle,
  getExperienceTitle,
  getExperienceSubtitle,
  getProjectTitle,
} from "../../utils/profileSections";
import type {
  EducationItem,
  ExperienceItem,
  ProjectItem,
} from "../../types/UserProfile.types";
import { data } from "react-router";

interface ProfileMainProps {
  userId: number;
}

function SectionCard({
  title,
  emptyMessage,
  isEmpty,
  children,
}: {
  title: string;
  emptyMessage: string;
  isEmpty: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 border-b-2 border-gray-100 pb-2 text-base font-semibold text-gray-800">
        {title}
      </h3>
      {isEmpty ? (
        <p className="text-sm italic text-gray-400">{emptyMessage}</p>
      ) : (
        children
      )}
    </div>
  );
}

const ProfileMain: React.FC<ProfileMainProps> = ({ userId }) => {
  const { data: user, isLoading, isError, error, refetch } = useUserQuery(userId);

  if (isLoading) {
    return (
      <main className="mx-auto min-h-[400px] max-w-[1400px] bg-page-bg px-5 py-8">
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-5">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
          <p className="text-base text-gray-600">Chargement du profil...</p>
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
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
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
        <p className="py-16 text-center text-lg text-gray-500">
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

  return (
    <main className="mx-auto min-h-screen max-w-[1400px] bg-page-bg px-5 py-8">
      <div className="flex flex-col items-start gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:sticky lg:top-5 lg:w-[250px]">
          <UserCard {...userCardData} />
        </aside>

        <section className="flex flex-1 flex-col gap-5">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 border-b-2 border-gray-100 pb-2 text-lg font-semibold text-gray-800">
              À propos de moi
            </h2>
            <p className="text-sm leading-relaxed text-gray-600">
              {description || "Aucune description disponible."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-base font-semibold text-gray-800">
                Mes Compétences & expertises
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                {skills.length > 0 ? (
                  skills.map((skill) => <li key={skill}>{skill.knowledgeName}</li>)
                ) : (
                  <li className="list-none pl-0 italic text-gray-400">
                    Aucune compétence renseignée
                  </li>
                )}
              </ul>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-base font-semibold text-gray-800">
                Mes Besoins
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                {needs.length > 0 ? (
                  needs.map((need) => <li key={need}>{need.knowledgeName}</li>)
                ) : (
                  <li className="list-none pl-0 italic text-gray-400">
                    Aucun besoin renseigné
                  </li>
                )}
              </ul>
            </div>
          </div>

           <SectionCard
            title="Formations"
            emptyMessage="Aucune formation renseignée"
            isEmpty={educations.length === 0}
          >
            {educations.length > 0 && (
              <div className="space-y-5">
                {educations.map((item, index) => {
                  const subtitle = getEducationSubtitle(item);
                  return (
                    <div key={`edu-${index}`} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <h4 className="text-base font-semibold text-gray-800">
                        {getEducationTitle(item)}
                      </h4>
                      {subtitle && (
                        <p className="mt-1 text-sm font-medium text-primary">
                          {subtitle}
                        </p>
                      )}
                      {item.description && (
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                          {item.description}
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
          >
            {experiences.length > 0 && (
              <div className="space-y-5">
                {experiences.map((item, index) => {
                  const subtitle = getExperienceSubtitle(item);
                  return (
                    <div key={`exp-${index}`} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <h4 className="text-base font-semibold text-gray-800">
                        {getExperienceTitle(item)}
                      </h4>
                      {subtitle && (
                        <p className="mt-1 text-sm font-medium text-primary">
                          {subtitle}
                        </p>
                      )}
                      {item.description && (
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                          {item.description}
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
          >
            {projects.length > 0 && (
              <div className="space-y-5 m-4">
                {projects.map((item, index) => (
                  <div key={`proj-${index}`} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <h4 className="text-base font-semibold text-gray-800">
                      {getProjectTitle(item)}
                    </h4>
                    {item.description && (
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">
                        {item.description}
                      </p>
                    )}
                    {item.technologies && (
                      <p className="mt-2 text-sm font-medium text-primary">
                        Technologies : {item.technologies}
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
