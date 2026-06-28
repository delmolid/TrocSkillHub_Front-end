import { createRoute } from "@tanstack/react-router";
import { AuthentificationPage } from "../pages/AuthenticationPage";
import { rootRoute } from "./__root";

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: AuthentificationPage,
});
