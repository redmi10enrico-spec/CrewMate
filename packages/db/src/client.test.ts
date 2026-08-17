import { describe, expect, it } from "vitest";
import { createSupabaseClient } from "./client";

describe("createSupabaseClient", () => {
  it("creates a client when url and anonKey are provided", () => {
    const client = createSupabaseClient({
      url: "https://example.supabase.co",
      anonKey: "anon-key",
    });
    expect(client).toBeTruthy();
    expect(typeof client.from).toBe("function");
  });

  it("throws when url is missing", () => {
    expect(() => createSupabaseClient({ url: "", anonKey: "anon-key" })).toThrow(
      "createSupabaseClient: url e anonKey sono obbligatori"
    );
  });

  it("throws when anonKey is missing", () => {
    expect(() =>
      createSupabaseClient({ url: "https://example.supabase.co", anonKey: "" })
    ).toThrow("createSupabaseClient: url e anonKey sono obbligatori");
  });
});
