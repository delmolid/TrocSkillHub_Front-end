import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, cleanup } from "vitest-browser-react";
import { page } from "vitest/browser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";

beforeEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const renderLoginForm = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("LoginForm", () => {
  test("affiche les erreurs de validation si le formulaire est vide", async () => {
    renderLoginForm();

    const submitButton = page.getByRole("button", { name: "Se connecter" });
    await submitButton.click();

    await expect.element(page.getByText("L'adresse email est requise")).toBeInTheDocument();
    await expect.element(page.getByText("Le mot de passe est requis")).toBeInTheDocument();
  });

  test("affiche uniquement l'erreur mot de passe si l'email est rempli", async () => {
    renderLoginForm();

    const emailInput = page.getByPlaceholder("Votre email");
    const submitButton = page.getByRole("button", { name: "Se connecter" });

    await emailInput.fill("test@example.com");
    await submitButton.click();

    await expect.element(page.getByText("L'adresse email est requise")).not.toBeInTheDocument();
    await expect.element(page.getByText("Le mot de passe est requis")).toBeInTheDocument();
  });

  test("appelle l'API login avec les bonnes données lors d'une soumission valide", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Connexion réussie" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    renderLoginForm();

    const emailInput = page.getByPlaceholder("Votre email");
    const passwordInput = page.getByPlaceholder("Votre mot de passe");
    const submitButton = page.getByRole("button", { name: "Se connecter" });

    await emailInput.fill("test@example.com");
    await passwordInput.fill("TestPut1!");
    await submitButton.click();

    await vi.waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        expect.objectContaining({ method: "POST" }),
      );
    });
  });
});
