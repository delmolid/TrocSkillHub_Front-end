import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import ReactDOM from "react-dom/client";
import { act } from "react";
import { Header } from "../components/commons/Header";

let container: HTMLDivElement;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

const render = (ui: React.ReactElement) => {
  act(() => {
    const root = ReactDOM.createRoot(container);
    root.render(ui);
  });
};

describe("Header", () => {
  it("renders the title", () => {
    render(<Header />);
    expect(document.body.textContent).toContain("TROCSKILL-HUB");
  });

  it("menu is closed by default", () => {
    render(<Header />);

    const menu = container.querySelector(".nav-menu");

    expect(menu?.classList.contains("active")).toBe(false);
  });

  it("opens the menu when clicking the toggle button", () => {
    render(<Header />);

    const button = container.querySelector("button.menu-toggle") as HTMLButtonElement;
    const menu = container.querySelector(".nav-menu") as HTMLElement;

    act(() => {
      button.click();
    });

    expect(menu.classList.contains("active")).toBe(true);
  });

  it("toggles the menu open and closed", () => {
    render(<Header />);

    const button = container.querySelector("button.menu-toggle") as HTMLButtonElement;
    const menu = container.querySelector(".nav-menu") as HTMLElement;

    act(() => {
      button.click();
    });

    expect(menu.classList.contains("active")).toBe(true);

    act(() => {
      button.click();
    });

    expect(menu.classList.contains("active")).toBe(false);
  });
});