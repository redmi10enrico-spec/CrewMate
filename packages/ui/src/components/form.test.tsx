import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormField } from "./FormField";
import { Input } from "./Input";

describe("Input", () => {
  it("renders as a text input and passes through props", () => {
    render(<Input placeholder="Email" name="email" />);
    const input = screen.getByPlaceholderText("Email");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("name", "email");
  });
});

describe("FormField", () => {
  it("renders label, children and error", () => {
    render(
      <FormField label="Email" htmlFor="email" error="Campo obbligatorio">
        <Input id="email" />
      </FormField>
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Campo obbligatorio")).toBeInTheDocument();
  });

  it("omits the error paragraph when no error is given", () => {
    render(
      <FormField label="Email" htmlFor="email">
        <Input id="email" />
      </FormField>
    );
    expect(screen.queryByText("Campo obbligatorio")).not.toBeInTheDocument();
  });
});
