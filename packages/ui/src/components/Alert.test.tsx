import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders as an alert role with the given content", () => {
    render(<Alert tone="danger">Credenziali non valide</Alert>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Credenziali non valide");
    expect(alert.className).toContain("text-danger");
  });

  it("defaults to the info tone", () => {
    render(<Alert>Nota informativa</Alert>);
    expect(screen.getByRole("alert").className).toContain("text-accent");
  });
});
