import { createRoute } from "@tanstack/react-router";
import { DashboardPage } from "../pages/DashboardPage";
import { rootRoute } from "./__root";

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});
