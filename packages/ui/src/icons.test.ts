import { describe, expect, it } from "vitest";
import { Pickaxe } from "lucide-react";
import { getIcon } from "./icons";

describe("getIcon", () => {
  it("returns the mapped icon for a known slug", () => {
    expect(getIcon("pickaxe")).toBe(Pickaxe);
  });

  it("falls back to HelpCircle for an unknown slug", () => {
    const HelpCircle = getIcon("does-not-exist");
    expect(getIcon("pickaxe")).not.toBe(HelpCircle);
  });

  it("falls back to HelpCircle when no name is given", () => {
    expect(getIcon(undefined)).toBe(getIcon(null));
  });
});
