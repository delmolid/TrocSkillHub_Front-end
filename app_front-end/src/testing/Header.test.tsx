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
  it("shows the title", async () => {
    renderHeader();
    await expect.element(page.getByText("TROCSKILLHUB")).toBeInTheDocument();
  });

  it("shows the application logo", async () => {
    renderHeader();
    const logo = page.getByRole("img", { name: "Logo TrocSkillHub" });
    await expect.element(logo).toBeInTheDocument();
    await expect.element(logo).toHaveAttribute("src", "/trocskillhub_logo.png");
  });

  it("menu is closed by default", async () => {
    renderHeader();
    await expect.element(page.getByRole("button", { name: "Menu" })).toBeInTheDocument();
    const navMenu = document.querySelector(".nav-menu");
    expect(navMenu?.classList.contains("active")).toBe(false);
  });

  it("opens the menu when clicking the toggle button", async () => {
    renderHeader();
    const toggleButton = page.getByRole("button", { name: "Menu" });
    await toggleButton.click();
    const navMenu = document.querySelector(".nav-menu");
    expect(navMenu?.classList.contains("active")).toBe(true);
  });

  it("toggles the menu open/closed", async () => {
    renderHeader();
    const toggleButton = page.getByRole("button", { name: "Menu" });

    await toggleButton.click();
    expect(document.querySelector(".nav-menu")?.classList.contains("active")).toBe(true);

    await toggleButton.click();
    expect(document.querySelector(".nav-menu")?.classList.contains("active")).toBe(false);
  });

  it("hides the Déconnexion button on the login page", async () => {
    renderHeader("/login");
    await expect
      .element(page.getByRole("button", { name: "Déconnexion" }))
      .not.toBeInTheDocument();
  });

  it("hides the navigation links on the login page", async () => {
    renderHeader("/login");
    await expect.element(page.getByText("Catalogue")).not.toBeInTheDocument();
    await expect.element(page.getByText("Mon Profil")).not.toBeInTheDocument();
  });

  it("shows the navigation links on other pages", async () => {
    renderHeader("/profile");
    await expect.element(page.getByText("Catalogue")).toBeInTheDocument();
    await expect.element(page.getByText("Mon Profil")).toBeInTheDocument();
  });
});
