import { describe, expect, it } from "vitest";
import { tailwindPreset } from "./tailwind-preset";

describe("tailwindPreset", () => {
  it("defines the CrewMate accent color", () => {
    expect(tailwindPreset.theme?.extend?.colors).toMatchObject({
      accent: { DEFAULT: "#3fc9ff", strong: "#1a8fd4" },
    });
  });

  it("defines the title and body font families", () => {
    const fontFamily = tailwindPreset.theme?.extend?.fontFamily as Record<string, string[]>;
    expect(fontFamily.title[0]).toBe('"Press Start 2P"');
    expect(fontFamily.body[0]).toBe("Segoe UI");
  });
});
