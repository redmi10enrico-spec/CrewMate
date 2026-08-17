import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders a status role with an accessible label", () => {
    render(<Spinner label="Caricamento prodotti" />);
    expect(screen.getByRole("status", { name: "Caricamento prodotti" })).toBeInTheDocument();
  });
});
