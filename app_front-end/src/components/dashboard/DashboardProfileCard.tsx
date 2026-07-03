import type { ApiUser, needs, skills } from "../../types/UserProfile.types";

const getProfileImage = (user: ApiUser): string | null =>
  user.profilePictureUrl ??
  user.profilePicture ??
  user.avatarUrl ??
  user.photo ??
  null;

const getKnowledgeName = (item: skills | needs): string | null =>
  item.knowledgeName?.trim() || null;

const KnowledgeBadges = ({
  items,
  emptyLabel,
}: {
  items: (skills | needs)[];
  emptyLabel: string;
}) => {
  const names = items.map(getKnowledgeName).filter((name): name is string =>
    Boolean(name),
  );

  if (names.length === 0) {
    return <p className="text-sm italic text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {names.map((name) => (
        <span
          key={name}
          className="rounded-full border border-primary-border/20 bg-primary-border/10 px-3 py-1 text-xs font-semibold text-primary-border"
        >
          {name}
        </span>
      ))}
    </div>
  );
};

export function DashboardProfileCard({ user }: { user: ApiUser }) {
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const location = [user.city, user.country].filter(Boolean).join(", ");
  const profileImage = getProfileImage(user);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-primary-border/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-4">
        {profileImage ? (
          <img
            src={profileImage}
            alt={`Photo de profil de ${fullName}`}
            className="h-20 w-20 rounded-full border-4 border-primary-border/20 object-cover"
          />
        ) : (
          <div
            aria-label={`Photo de profil non renseignée pour ${fullName}`}
            className="h-20 w-20 rounded-full border-4 border-dashed border-primary-border/20 bg-page-bg"
          />
        )}
        <div>
          <h2 className="text-xl font-bold text-text">{fullName}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {location || "Ville non renseignée"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-1 flex-col gap-5">
        <section>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.08em] text-text">
            Compétences
          </h3>
          <KnowledgeBadges
            items={user.skills ?? []}
            emptyLabel="Aucune compétence renseignée"
          />
        </section>

        <section>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.08em] text-text">
            Besoins
          </h3>
          <KnowledgeBadges
            items={user.needs ?? []}
            emptyLabel="Aucun besoin renseigné"
          />
        </section>
      </div>
    </article>
  );
}
