import { createRoute } from "@tanstack/react-router";
import ProfilPage from "../pages/ProfilPage";
import { rootRoute } from "./__root";

export const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: ProfilPage,
});
