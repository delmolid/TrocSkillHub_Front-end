import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, cleanup } from "vitest-browser-react";
import { page } from "vitest/browser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginForm } from "../components/auth/LoginForm";
import { ToastProvider } from "../context/ToastContext";
import { clearCsrfTokenCache } from "../services/apiFetch";
import { ComponentTestRouter } from "./testRouter";

beforeEach(() => {
  cleanup();
  vi.restoreAllMocks();
  clearCsrfTokenCache();
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
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = String(input);

      if (url.includes("/auth/csrf")) {
        return new Response(
          JSON.stringify({
            token: "test-csrf-token",
            headerName: "X-XSRF-TOKEN",
            parameterName: "_csrf",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      if (url.includes("/auth/login")) {
        return new Response(JSON.stringify({ message: "Connexion réussie" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(null, { status: 404 });
    });

    renderLoginForm();

    const emailInput = page.getByPlaceholder("Votre email");
    const passwordInput = page.getByPlaceholder("Votre mot de passe");
    const submitButton = page.getByRole("button", { name: "Se connecter" });

    await emailInput.fill("test@example.com");
    await passwordInput.fill("TestPut1!");
    await submitButton.click();

    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/auth/csrf"),
        expect.objectContaining({ method: "GET", credentials: "include" }),
      );
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        expect.objectContaining({ method: "POST", credentials: "include" }),
      );
    });

    const loginCall = fetchMock.mock.calls.find(([url]) =>
      String(url).includes("/auth/login"),
    );
    expect(loginCall).toBeDefined();
    const loginHeaders = new Headers(loginCall?.[1]?.headers);
    expect(loginHeaders.get("X-XSRF-TOKEN")).toBe("test-csrf-token");
  });
});
