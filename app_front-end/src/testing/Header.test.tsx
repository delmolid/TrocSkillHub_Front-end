import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup } from "vitest-browser-react";
import { page } from "vitest/browser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "../components/commons/Header";
import { ComponentTestRouter } from "./testRouter";

beforeEach(() => {
  cleanup();
});

const renderHeader = (initialPath = "/") => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <ComponentTestRouter component={Header} initialPath={initialPath} />
    </QueryClientProvider>,
  );
};

describe("Header", () => {
  it("affiche le titre", async () => {
    renderHeader();
    await expect.element(page.getByText("TROCSKILL-HUB")).toBeInTheDocument();
  });

  it("affiche le logo de l'application", async () => {
    renderHeader();
    const logo = page.getByRole("img", { name: "Logo TrocSkillHub" });
    await expect.element(logo).toBeInTheDocument();
    await expect.element(logo).toHaveAttribute("src", "/trocskillhub_logo.png");
  });

  it("menu fermé par défaut", async () => {
    renderHeader();
    await expect.element(page.getByRole("button", { name: "Menu" })).toBeInTheDocument();
    const navMenu = document.querySelector(".nav-menu");
    expect(navMenu?.classList.contains("active")).toBe(false);
  });

  it("ouvre le menu au clic sur le bouton toggle", async () => {
    renderHeader();
    const toggleButton = page.getByRole("button", { name: "Menu" });
    await toggleButton.click();
    const navMenu = document.querySelector(".nav-menu");
    expect(navMenu?.classList.contains("active")).toBe(true);
  });

  it("bascule le menu ouvert/fermé", async () => {
    renderHeader();
    const toggleButton = page.getByRole("button", { name: "Menu" });

    await toggleButton.click();
    expect(document.querySelector(".nav-menu")?.classList.contains("active")).toBe(true);

    await toggleButton.click();
    expect(document.querySelector(".nav-menu")?.classList.contains("active")).toBe(false);
  });

  it("masque le bouton Déconnexion sur la page login", async () => {
    renderHeader("/login");
    await expect
      .element(page.getByRole("button", { name: "Déconnexion" }))
      .not.toBeInTheDocument();
  });

  it("masque les liens de navigation sur la page login", async () => {
    renderHeader("/login");
    await expect.element(page.getByText("Tableau de bord")).not.toBeInTheDocument();
    await expect.element(page.getByText("Mon Profil")).not.toBeInTheDocument();
  });

  it("affiche les liens de navigation sur les autres pages", async () => {
    renderHeader("/profile");
    await expect.element(page.getByText("Tableau de bord")).toBeInTheDocument();
    await expect.element(page.getByText("Mon Profil")).toBeInTheDocument();
  });
});
