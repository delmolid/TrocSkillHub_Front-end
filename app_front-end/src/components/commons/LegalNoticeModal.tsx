import React from "react";
import { Dialog } from "primereact/dialog";

interface LegalNoticeModalProps {
  visible: boolean;
  onHide: () => void;
}

const SECTIONS = [
  {
    id: "publisher",
    title: "Éditeur du site",
    content: (
      <>
        <p>Molid NOUR AWALEH</p>
        <p>
          Contact :{" "}
          <a
            href="mailto:service@trocskillhub.ovh"
            className="font-medium text-primary-border underline underline-offset-2 hover:opacity-80"
          >
            service@trocskillhub.ovh
          </a>
        </p>
      </>
    ),
  },
  {
    id: "hosting",
    title: "Hébergement",
    content: (
      <>
        <p>Le site est hébergé par OVH.</p>
        <p>Siège social : 2 rue Kellermann – 59100 Roubaix – France.</p>
      </>
    ),
  },
  {
    id: "data-processing",
    title: "Traitement des données",
    content: (
      <p>
        Les données personnelles collectées lors de l&apos;utilisation du site
        sont utilisées uniquement pour assurer le bon fonctionnement des
        services proposés.
      </p>
    ),
  },
  {
    id: "gdpr-rights",
    title: "Vos droits (RGPD)",
    content: (
      <>
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification,
          d&apos;effacement, d&apos;opposition et de limitation du traitement de
          vos données personnelles.
        </p>
        <p>
          Pour exercer ces droits :{" "}
          <a
            href="mailto:service@trocskillhub.ovh"
            className="font-medium text-primary-border underline underline-offset-2 hover:opacity-80"
          >
            service@trocskillhub.ovh
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    content: (
      <>
        <p>Aucun cookie n&apos;est stocké.</p>
        <p>
          Aucun outil de suivi ou d&apos;analyse tiers n&apos;est utilisé.
        </p>
      </>
    ),
  },
] as const;

export const LegalNoticeModal: React.FC<LegalNoticeModalProps> = ({
  visible,
  onHide,
}) => {
  return (
    <Dialog
      header="Mentions légales"
      visible={visible}
      onHide={onHide}
      modal
      dismissableMask
      closeOnEscape
      closable
      draggable={false}
      resizable={false}
      blockScroll
      closeAriaLabel="Fermer les mentions légales"
      style={{ width: "40rem" }}
      breakpoints={{ "960px": "92vw", "640px": "96vw" }}
      pt={{
        root: {
          className:
            "rounded-xl shadow-xl border border-[#176b87]/20 bg-[#fafbf9] font-sans",
        },
        header: {
          className:
            "flex items-center px-6 pt-5 pb-3 border-b border-[#176b87]/15",
        },
        headerTitle: {
          className: "text-base font-bold text-[#060605]",
        },
        content: {
          className:
            "px-6 py-5 max-h-[70vh] overflow-y-auto text-sm leading-relaxed text-[#060605]",
        },
        closeButton: {
          className:
            "ml-auto text-[#060605]/40 hover:text-[#060605] transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#176b87]",
        },
      }}
    >
      <div className="flex flex-col gap-5">
        <p className="m-0 text-text/80">
          Informations légales relatives à la publication du site TrocSkillHub,
          à l&apos;hébergement et au traitement des données personnelles.
        </p>

        {SECTIONS.map((section) => (
          <section
            key={section.id}
            aria-labelledby={`legal-section-${section.id}`}
            className="border-t border-primary-border/10 pt-4 first:border-t-0 first:pt-0"
          >
            <h3
              id={`legal-section-${section.id}`}
              className="mb-2 text-sm font-bold text-text"
            >
              {section.title}
            </h3>
            <div className="space-y-1.5 text-text/90 [&_p]:m-0">
              {section.content}
            </div>
          </section>
        ))}
      </div>
    </Dialog>
  );
};
