import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Gioca Ora</Button>);
    expect(screen.getByRole("button", { name: "Gioca Ora" })).toBeInTheDocument();
  });

  it("applies primary variant classes by default", () => {
    render(<Button>Default</Button>);
    expect(screen.getByRole("button", { name: "Default" }).className).toContain("bg-accent");
  });

  it("applies outline variant classes", () => {
    render(<Button variant="outline">Visita lo Shop</Button>);
    expect(screen.getByRole("button", { name: "Visita lo Shop" }).className).toContain(
      "border-accent"
    );
  });
});
