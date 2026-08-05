import { useState, type FC } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useLogoutUser } from "@/hooks/useAuthQuery";
import { cn } from "@/lib/utils";

const navLinkClassName =
  "w-full rounded-md px-3 py-2 text-center text-sm font-medium text-text transition-colors hover:bg-primary/15 hover:text-accent md:w-auto md:text-left";

export const Header: FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAuthPage = pathname === "/" || pathname === "/login";
  const { mutate: logoutUser, isPending } = useLogoutUser();

  const handleLogout = () => {
    logoutUser();
  };

  const goToCatalog = () => {
    setMenuOpen(false);
    navigate({ to: "/catalog" });
  };

  const goToProfile = () => {
    setMenuOpen(false);
    navigate({ to: "/profile" });
  };

  return (
    <nav className="relative flex items-center justify-between px-4 py-3 text-text md:px-5 lg:px-8">
      <ul className="m-0 flex list-none items-center gap-5 p-0">
        <li className="flex items-center gap-3">
          <img
            src="/trocskillhub_logo.png"
            alt="Logo TrocSkillHub"
            className="h-20 w-20 object-contain max-sm:h-8 max-sm:w-8"
          />
          <h1 className="m-0 font-heading text-xl font-bold text-accent max-md:text-base max-sm:text-sm">
            TROCSKILLHUB
          </h1>
        </li>
      </ul>

      <button
        type="button"
        className="flex flex-col gap-1 border-0 bg-transparent p-1.5 md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
        aria-expanded={menuOpen}
      >
        <span className="block h-0.5 w-6 rounded-sm bg-text transition" />
        <span className="block h-0.5 w-6 rounded-sm bg-text transition" />
        <span className="block h-0.5 w-6 rounded-sm bg-text transition" />
      </button>

      <div
        className={cn(
          "nav-menu flex items-center gap-10",
          "max-md:absolute max-md:top-full max-md:right-4 max-md:z-50 max-md:min-w-[250px] max-md:flex-col max-md:gap-4 max-md:rounded-lg max-md:bg-white max-md:p-5 max-md:shadow-lg max-md:transition-all max-md:duration-300",
          "max-sm:inset-x-1.5 max-sm:right-auto max-sm:min-w-0 max-sm:w-[calc(100%-0.75rem)] max-sm:p-4",
          menuOpen
            ? "active max-md:visible max-md:opacity-100"
            : "max-md:invisible max-md:opacity-0",
        )}
      >
        <ul className="m-0 flex list-none items-center gap-10 p-0 max-md:w-full max-md:flex-col max-md:gap-3 md:gap-8 lg:gap-10">
          {!isAuthPage && (
            <li className="w-full md:w-auto">
              <button type="button" className={navLinkClassName} onClick={goToCatalog}>
                Catalogue
              </button>
            </li>
          )}
          {!isAuthPage && (
            <li className="w-full md:w-auto">
              <button type="button" className={navLinkClassName} onClick={goToProfile}>
                Mon Profil
              </button>
            </li>
          )}
        </ul>

        <ul
          className={cn(
            "m-0 flex list-none items-center gap-5 p-0",
            "max-md:w-full max-md:flex-col max-md:gap-3",
            !isAuthPage && "max-md:border-t max-md:border-text/15 max-md:pt-4",
          )}
        >
          {!isAuthPage && (
            <li className="w-full md:w-auto">
              <button
                type="button"
                className={cn(navLinkClassName, "hover:bg-accent/15")}
                onClick={handleLogout}
                disabled={isPending}
              >
                Déconnexion
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};
