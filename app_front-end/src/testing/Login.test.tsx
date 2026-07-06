import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, cleanup } from "vitest-browser-react";
import { page } from "vitest/browser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginForm } from "../components/auth/LoginForm";
import { ToastProvider } from "../context/ToastContext";
import { ComponentTestRouter } from "./testRouter";

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
      <ToastProvider>
        <ComponentTestRouter component={LoginForm} initialPath="/login" />
      </ToastProvider>
    </QueryClientProvider>,
  );
};

describe("LoginForm", () => {
  test("shows validation errors when the form is empty", async () => {
    renderLoginForm();

    const submitButton = page.getByRole("button", { name: "Se connecter" });
    await submitButton.click();

    await expect.element(page.getByText("L'adresse email est requise")).toBeInTheDocument();
    await expect.element(page.getByText("Le mot de passe est requis")).toBeInTheDocument();
  });

  test("shows only the password error when the email is filled in", async () => {
    renderLoginForm();

    const emailInput = page.getByPlaceholder("Votre email");
    const submitButton = page.getByRole("button", { name: "Se connecter" });

    await emailInput.fill("test@example.com");
    await submitButton.click();

    await expect.element(page.getByText("L'adresse email est requise")).not.toBeInTheDocument();
    await expect.element(page.getByText("Le mot de passe est requis")).toBeInTheDocument();
  });

  test("calls the login API with the correct data on a valid submission", async () => {
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
