import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { PrimeReactProvider } from "primereact/api";
import { queryClient } from "./hooks/useUserQuery";
import { AuthProvider } from "./context/AuthContext";
import { router } from "./router";
import "primereact/resources/themes/lara-light-teal/theme.css";
import "primeicons/primeicons.css";
import "./styles/tailwind.css";
import "./styles/prime-overrides.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </PrimeReactProvider>
  </React.StrictMode>,
);
