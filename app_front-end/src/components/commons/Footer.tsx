import React, { useState } from "react";
import { LegalNoticeModal } from "./LegalNoticeModal";

export const Footer: React.FC = () => {
  const [isLegalNoticeOpen, setIsLegalNoticeOpen] = useState(false);

  return (
    <>
      <footer className="app-footer">
        <div className="app-footer__content">
          <div className="footer-links">
            <button
              type="button"
              className="footer-link-button"
              onClick={() => setIsLegalNoticeOpen(true)}
            >
              Mentions légales
            </button>
          </div>
          <p className="footer-copyright">
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
