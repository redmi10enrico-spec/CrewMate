import { describe, expect, it } from "vitest";
import { tailwindPreset } from "./tailwind-preset";

describe("tailwindPreset", () => {
  it("defines the CrewMate accent color", () => {
    expect(tailwindPreset.theme?.extend?.colors).toMatchObject({
      accent: { DEFAULT: "#3fc9ff", active: "#1a8fd4" },
    });
  });

  it("defines the Inter font family", () => {
    const fontFamily = tailwindPreset.theme?.extend?.fontFamily as Record<string, string[]>;
    expect(fontFamily.sans[0]).toBe("Inter");
  });

  it("defines fade-in and scale-in animations", () => {
    const animation = tailwindPreset.theme?.extend?.animation as Record<string, string>;
    expect(animation["fade-in"]).toContain("fade-in");
    expect(animation["scale-in"]).toContain("scale-in");
  });
});
