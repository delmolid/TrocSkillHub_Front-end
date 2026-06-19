import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup } from "vitest-browser-react";
import { page } from "vitest/browser";
import { MemoryRouter } from "react-router-dom";
import { Header } from "../components/commons/Header";

beforeEach(() => {
  cleanup();
});

const renderHeader = (initialPath = "/") => {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Header />
    </MemoryRouter>,
  );
};

describe("Header", () => {
  it("renders the title", async () => {
    renderHeader();
    await expect.element(page.getByText("TROCSKILL-HUB")).toBeInTheDocument();
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

  it("toggles the menu open and closed", async () => {
    renderHeader();
    const toggleButton = page.getByRole("button", { name: "Menu" });

    await toggleButton.click();
    expect(document.querySelector(".nav-menu")?.classList.contains("active")).toBe(true);

    await toggleButton.click();
    expect(document.querySelector(".nav-menu")?.classList.contains("active")).toBe(false);
  });

  it("maske button Deconnexion in login page", async () => {
    renderHeader("/login");
    await expect.element(page.getByText("Dconnexion")).not.toBeInTheDocument();
  });

  it("hidden  button Deconnexion other pages", async () => {
    renderHeader("/profile");
    await expect.element(page.getByText("Déconnexion")).toBeInTheDocument();
  });
});
