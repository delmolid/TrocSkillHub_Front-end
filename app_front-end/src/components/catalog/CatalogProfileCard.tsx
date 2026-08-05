import { Card } from "primereact/card";
import type {
  needs,
  PublicUserProfile,
  skills,
} from "../../types/UserProfile.types";

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

export function CatalogProfileCard({ user }: { user: PublicUserProfile }) {
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const location = [user.city, user.country].filter(Boolean).join(", ");

  return (
    <Card
      className="h-full shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      pt={{
        root: { className: "rounded-2xl border border-primary-border/10" },
        body: { className: "flex flex-1 flex-col p-5" },
        content: { className: "flex flex-1 flex-col gap-5 p-0" },
      }}
    >
      <div className="flex items-center gap-4">
        <div
          aria-label={`Photo de profil non renseignée pour ${fullName}`}
          className="h-20 w-20 rounded-full border-4 border-dashed border-primary-border/20 bg-page-bg"
        />
        <div>
          <h2 className="text-xl font-bold text-text">{fullName}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {location || "Ville non renseignée"}
          </p>
        </div>
      </div>

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
    </Card>
  );
}
