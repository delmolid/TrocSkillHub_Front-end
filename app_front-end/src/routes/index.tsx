import { createRoute } from "@tanstack/react-router";
import { AuthentificationPage } from "../pages/AuthenticationPage";
import { rootRoute } from "./__root";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: AuthentificationPage,
});
