import React from "react";
import { FaLinkedin, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";
import { UserCardData } from "../../types/UserProfile.types";
import { VscAccount } from "react-icons/vsc";

const UserCard: React.FC<UserCardData> = ({
  prenom,
  nom,
  ville,
  linkedin,
  instagram,
}) => {
  const nomComplet = `${prenom} ${nom}`;

  return (
    <div className="flex w-full flex-col items-start bg-white p-5">
      <div className="mb-5 h-[120px] w-[120px] overflow-hidden rounded-full border-4 border-primary-border shadow-md">
      <VscAccount />
      </div>

      <h2 className="mb-4 text-left text-lg font-semibold text-text">
        {nomComplet}
      </h2>

      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center gap-2.5 py-2 text-text">
          <FaMapMarkerAlt className="shrink-0 text-xl text-text" aria-hidden />
          <span className="text-sm">{ville}</span>
        </div>

        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 py-2 text-text transition hover:translate-x-0.5 hover:text-primary"
            aria-label="Profil LinkedIn"
          >
            <FaLinkedin className="shrink-0 text-xl text-[#0077B5]" aria-hidden />
            <span className="text-sm">LinkedIn</span>
          </a>
        )}

        {instagram && (
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 py-2 text-text transition hover:translate-x-0.5 hover:text-primary"
            aria-label="Profil Instagram"
          >
            <FaInstagram className="shrink-0 text-xl text-[#E4405F]" aria-hidden />
            <span className="text-sm">Instagram</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default UserCard;
