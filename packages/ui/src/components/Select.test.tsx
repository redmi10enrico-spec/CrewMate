import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Select } from "./Select";

describe("Select", () => {
  it("renders the given options", () => {
    render(
      <Select defaultValue="b" aria-label="Scegli">
        <option value="a">A</option>
        <option value="b">B</option>
      </Select>
    );
    const select = screen.getByRole("combobox", { name: "Scegli" });
    expect(select).toHaveValue("b");
  });
});
