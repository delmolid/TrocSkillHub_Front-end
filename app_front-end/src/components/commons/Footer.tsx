import React, { useState } from "react";
import { LegalNoticeModal } from "./LegalNoticeModal";

export const Footer: React.FC = () => {
  const [isLegalNoticeOpen, setIsLegalNoticeOpen] = useState(false);

  return (
    <>
      <footer className="mt-auto bg-secondary px-5 py-8 text-white">
        <div className="mx-auto w-full max-w-7xl text-center">
          <div className="mb-4 flex flex-wrap justify-center gap-8 max-md:flex-col max-md:gap-2.5">
            <button
              type="button"
              className="cursor-pointer border-0 bg-transparent p-0 font-inherit text-sm text-white transition-opacity hover:opacity-70 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white max-md:text-[13px]"
              onClick={() => setIsLegalNoticeOpen(true)}
            >
              Mentions légales
            </button>
          </div>
          <p className="m-0 text-[13px] text-white/70 max-md:text-xs">
            ©2026 Trocskillhub. Tous droits réservés
          </p>
        </div>
      </footer>

      <LegalNoticeModal
        visible={isLegalNoticeOpen}
        onHide={() => setIsLegalNoticeOpen(false)}
      />
    </>
  );
};
