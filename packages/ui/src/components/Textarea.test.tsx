import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders and passes through props", () => {
    render(<Textarea placeholder="Descrizione" name="description" />);
    const textarea = screen.getByPlaceholderText("Descrizione");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("name", "description");
  });

  it("applies invalid styling when invalid", () => {
    render(<Textarea placeholder="Descrizione" invalid />);
    expect(screen.getByPlaceholderText("Descrizione")).toHaveAttribute("aria-invalid", "true");
  });
});
