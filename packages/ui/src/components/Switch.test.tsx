import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Switch } from "./Switch";

describe("Switch", () => {
  it("exposes its state via role=switch and aria-checked", () => {
    render(<Switch checked label="Abilitato" />);
    const el = screen.getByRole("switch", { name: "Abilitato" });
    expect(el).toHaveAttribute("aria-checked", "true");
  });

  it("reflects the unchecked state", () => {
    render(<Switch checked={false} label="Abilitato" />);
    expect(screen.getByRole("switch", { name: "Abilitato" })).toHaveAttribute("aria-checked", "false");
  });
});
