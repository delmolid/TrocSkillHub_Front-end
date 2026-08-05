import { createRoute } from "@tanstack/react-router";
import { CatalogPage } from "../pages/CatalogPage";
import { rootRoute } from "./__root";

export const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalog",
  component: CatalogPage,
});
