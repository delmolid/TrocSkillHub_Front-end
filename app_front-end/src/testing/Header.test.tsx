import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup } from "vitest-browser-react";
import { page } from "vitest/browser";
import { Header } from "../components/commons/Header";

beforeEach(() => {
  cleanup();
});

describe("Header", () => {
  it("renders the title", async () => {
    render(<Header />);
    await expect.element(page.getByText("TROCSKILL-HUB")).toBeInTheDocument();
  });

  it("menu is closed by default", async () => {
    render(<Header />);
    await expect.element(page.getByRole("button", { name: "Menu" })).toBeInTheDocument();
    const navMenu = document.querySelector(".nav-menu");
    expect(navMenu?.classList.contains("active")).toBe(false);
  });

  it("opens the menu when clicking the toggle button", async () => {
    render(<Header />);
    const toggleButton = page.getByRole("button", { name: "Menu" });
    await toggleButton.click();
    const navMenu = document.querySelector(".nav-menu");
    expect(navMenu?.classList.contains("active")).toBe(true);
  });

  it("toggles the menu open and closed", async () => {
    render(<Header />);
    const toggleButton = page.getByRole("button", { name: "Menu" });

    await toggleButton.click();
    expect(document.querySelector(".nav-menu")?.classList.contains("active")).toBe(true);

    await toggleButton.click();
    expect(document.querySelector(".nav-menu")?.classList.contains("active")).toBe(false);
  });
});
