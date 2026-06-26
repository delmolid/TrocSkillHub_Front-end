import { createRootRoute, Navigate, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ToastProvider } from "../context/ToastContext";

function RootLayout() {
  return (
    <ToastProvider>
      <Outlet />
      {import.meta.env.DEV ? <TanStackRouterDevtools /> : null}
    </ToastProvider>
  );
}

export const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <Navigate to="/" />,
});
