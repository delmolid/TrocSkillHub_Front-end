import type { ReactElement } from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, cleanup } from "vitest-browser-react";
import { page } from "vitest/browser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginForm } from "../components/auth/LoginForm";
import { PasswordResetModal } from "../components/auth/PasswordResetModal";
import { ToastProvider } from "../context/ToastContext";
import { ComponentTestRouter } from "./testRouter";

beforeEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const jsonStringResponse = (value: string, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" },
  });

function renderWithProviders(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{ui}</ToastProvider>
    </QueryClientProvider>,
  );
}

async function fillOtpCode(code: string) {
  const inputs = page.getByRole("textbox");
  for (let i = 0; i < code.length; i += 1) {
    await inputs.nth(i).fill(code[i]);
  }
}

describe("LoginForm - triggering the flow", () => {
  test("Scenario 1 - clicking 'Mot de passe oublié ?' opens the modal at the email step", async () => {
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

    await page.getByRole("button", { name: "Mot de passe oublié ?" }).click();

    const dialog = page.getByRole("dialog");
    await expect
      .element(page.getByText("Mot de passe oublié", { exact: true }))
      .toBeInTheDocument();
    await expect.element(dialog.getByPlaceholder("Votre email")).toBeInTheDocument();
  });
});

describe("PasswordResetModal", () => {
  test("Scenario 3 - an invalid email shows a validation error without a network call", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    renderWithProviders(<PasswordResetModal visible onHide={() => {}} />);

    await page.getByPlaceholder("Votre email").fill("email-invalide");
    await page.getByRole("button", { name: "Envoyer le code" }).click();

    await expect.element(page.getByText("Email invalide")).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  test("Scenario 2 - submitting a valid email sends the request and moves to the code step", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      jsonStringResponse("If an account with that email exists, a reset code has been sent."),
    );

    renderWithProviders(<PasswordResetModal visible onHide={() => {}} />);

    await page.getByPlaceholder("Votre email").fill("test@example.com");
    await page.getByRole("button", { name: "Envoyer le code" }).click();

    await expect.element(page.getByText("Vérification du code")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/password-reset/request"),
      expect.objectContaining({ method: "POST" }),
    );
  });

  test("Scenario 5 - an invalid code shows an error and stays on the code step", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        jsonStringResponse("If an account with that email exists, a reset code has been sent."),
      )
      .mockResolvedValueOnce(jsonStringResponse("Invalid verification code or request.", 400));

    renderWithProviders(<PasswordResetModal visible onHide={() => {}} />);

    await page.getByPlaceholder("Votre email").fill("test@example.com");
    await page.getByRole("button", { name: "Envoyer le code" }).click();
    await expect.element(page.getByText("Vérification du code")).toBeInTheDocument();

    await fillOtpCode("0000");
    await page.getByRole("button", { name: "Vérifier le code" }).click();

    await expect
      .element(page.getByText("Invalid verification code or request."))
      .toBeInTheDocument();
    await expect.element(page.getByText("Vérification du code")).toBeInTheDocument();
  });

  test("Scenario 6 - mismatched passwords show an error without a network call", async () => {
    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        jsonStringResponse("If an account with that email exists, a reset code has been sent."),
      )
      .mockResolvedValueOnce(jsonStringResponse("1"));

    renderWithProviders(<PasswordResetModal visible onHide={() => {}} />);

    await page.getByPlaceholder("Votre email").fill("test@example.com");
    await page.getByRole("button", { name: "Envoyer le code" }).click();
    await expect.element(page.getByText("Vérification du code")).toBeInTheDocument();

    await fillOtpCode("1234");
    await page.getByRole("button", { name: "Vérifier le code" }).click();
    await expect.element(page.getByPlaceholder("Nouveau mot de passe")).toBeInTheDocument();

    await page.getByPlaceholder("Nouveau mot de passe").fill("Password123");
    await page.getByPlaceholder("Confirmer le mot de passe").fill("Different123");
    await page.getByRole("button", { name: "Réinitialiser le mot de passe" }).click();

    await expect
      .element(page.getByText("Les mots de passe ne correspondent pas"))
      .toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  test("Scenario 7 - a successful update shows the success confirmation", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        jsonStringResponse("If an account with that email exists, a reset code has been sent."),
      )
      .mockResolvedValueOnce(jsonStringResponse("1"))
      .mockResolvedValueOnce(jsonStringResponse("Password updated successfully."));

    renderWithProviders(<PasswordResetModal visible onHide={() => {}} />);

    await page.getByPlaceholder("Votre email").fill("test@example.com");
    await page.getByRole("button", { name: "Envoyer le code" }).click();
    await expect.element(page.getByText("Vérification du code")).toBeInTheDocument();

    await fillOtpCode("1234");
    await page.getByRole("button", { name: "Vérifier le code" }).click();
    await expect.element(page.getByPlaceholder("Nouveau mot de passe")).toBeInTheDocument();

    await page.getByPlaceholder("Nouveau mot de passe").fill("Password123");
    await page.getByPlaceholder("Confirmer le mot de passe").fill("Password123");
    await page.getByRole("button", { name: "Réinitialiser le mot de passe" }).click();

    await expect.element(page.getByText("Mot de passe modifié")).toBeInTheDocument();
    await expect
      .element(page.getByRole("button", { name: "Retour à la connexion" }))
      .toBeInTheDocument();
  });

  test("Scenario 8 - a backend error on reset shows a message without proceeding to success", async () => {
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        jsonStringResponse("If an account with that email exists, a reset code has been sent."),
      )
      .mockResolvedValueOnce(jsonStringResponse("1"))
      .mockResolvedValueOnce(jsonStringResponse("Unable to reset password.", 400));

    renderWithProviders(<PasswordResetModal visible onHide={() => {}} />);

    await page.getByPlaceholder("Votre email").fill("test@example.com");
    await page.getByRole("button", { name: "Envoyer le code" }).click();
    await expect.element(page.getByText("Vérification du code")).toBeInTheDocument();

    await fillOtpCode("1234");
    await page.getByRole("button", { name: "Vérifier le code" }).click();
    await expect.element(page.getByPlaceholder("Nouveau mot de passe")).toBeInTheDocument();

    await page.getByPlaceholder("Nouveau mot de passe").fill("Password123");
    await page.getByPlaceholder("Confirmer le mot de passe").fill("Password123");
    await page.getByRole("button", { name: "Réinitialiser le mot de passe" }).click();

    await expect.element(page.getByText("Unable to reset password.")).toBeInTheDocument();
    await expect.element(page.getByPlaceholder("Nouveau mot de passe")).toBeInTheDocument();
  });
});
