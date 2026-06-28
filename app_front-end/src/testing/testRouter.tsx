import type { FC } from "react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";

export function createComponentTestRouter(
  Component: FC,
  initialPath: string,
) {
  const rootRoute = createRootRoute({
    component: () => <Outlet />,
  });

  const routeTree = rootRoute.addChildren([
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: Component,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/login",
      component: Component,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/profile",
      component: Component,
    }),
  ]);

  return createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });
}

export function ComponentTestRouter({
  component: Component,
  initialPath,
}: {
  component: FC;
  initialPath: string;
}) {
  const router = createComponentTestRouter(Component, initialPath);
  return <RouterProvider router={router} />;
}
