import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import {
  deleteApplicationForm,
  deleteApplicationQuestion,
  getApplicationAnswers,
  getApplicationById,
  getApplicationForms,
  getApplicationQuestions,
  getUserApplication,
  listAllApplications,
  listApplicationForms,
  listUserApplications,
  reviewApplication,
  setApplicationFormEnabled,
  submitApplication,
  upsertApplicationForm,
  upsertApplicationQuestion,
} from "./applications";

describe("getApplicationForms", () => {
  it("selects only enabled forms ordered", async () => {
    const rows = [{ id: "1", role_name: "Helper", enabled: true }];
    const order = vi.fn().mockResolvedValue({ data: rows, error: null });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await getApplicationForms(client);

    expect(from).toHaveBeenCalledWith("application_forms");
    expect(eq).toHaveBeenCalledWith("enabled", true);
    expect(result).toEqual(rows);
  });
});

describe("getApplicationQuestions", () => {
  it("filters by form and orders questions", async () => {
    const rows = [{ id: "1", form_id: "form-1", label: "Età" }];
    const order = vi.fn().mockResolvedValue({ data: rows, error: null });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await getApplicationQuestions(client, "form-1");

    expect(eq).toHaveBeenCalledWith("form_id", "form-1");
    expect(result).toEqual(rows);
  });
});

function mockSubmitClient(options: {
  application: { id: string } | null;
  applicationError?: { message: string } | null;
  answersError?: { message: string } | null;
}) {
  const single = vi.fn().mockResolvedValue({ data: options.application, error: options.applicationError ?? null });
  const select = vi.fn().mockReturnValue({ single });
  const applicationInsert = vi.fn().mockReturnValue({ select });

  const answersInsert = vi.fn().mockResolvedValue({ error: options.answersError ?? null });

  const from = vi.fn((table: string) => {
    if (table === "applications") return { insert: applicationInsert };
    if (table === "application_answers") return { insert: answersInsert };
    throw new Error(`unexpected table ${table}`);
  });

  return { client: { from } as unknown as SupabaseClient<Database>, applicationInsert, answersInsert };
}

describe("submitApplication", () => {
  it("creates the application then its answers", async () => {
    const { client, applicationInsert, answersInsert } = mockSubmitClient({ application: { id: "app-1" } });

    const result = await submitApplication(client, "form-1", "user-1", [
      { questionId: "q-1", value: "18" },
    ]);

    expect(applicationInsert).toHaveBeenCalledWith({ form_id: "form-1", user_id: "user-1", status: "pending" });
    expect(answersInsert).toHaveBeenCalledWith([{ application_id: "app-1", question_id: "q-1", value: "18" }]);
    expect(result).toEqual({ id: "app-1" });
  });

  it("skips the answers insert when there are none", async () => {
    const { client, answersInsert } = mockSubmitClient({ application: { id: "app-1" } });

    await submitApplication(client, "form-1", "user-1", []);

    expect(answersInsert).not.toHaveBeenCalled();
  });

  it("throws when creating the application fails", async () => {
    const { client } = mockSubmitClient({ application: null, applicationError: { message: "boom" } });

    await expect(submitApplication(client, "form-1", "user-1", [])).rejects.toThrow(
      "submitApplication: boom"
    );
  });

  it("throws when inserting answers fails", async () => {
    const { client } = mockSubmitClient({ application: { id: "app-1" }, answersError: { message: "boom" } });

    await expect(
      submitApplication(client, "form-1", "user-1", [{ questionId: "q-1", value: "x" }])
    ).rejects.toThrow("submitApplication: boom");
  });
});

describe("getUserApplication", () => {
  it("returns the application for the given form and user", async () => {
    const row = { id: "app-1", form_id: "form-1", user_id: "user-1" };
    const maybeSingle = vi.fn().mockResolvedValue({ data: row, error: null });
    const eq2 = vi.fn().mockReturnValue({ maybeSingle });
    const eq1 = vi.fn().mockReturnValue({ eq: eq2 });
    const select = vi.fn().mockReturnValue({ eq: eq1 });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await getUserApplication(client, "form-1", "user-1");

    expect(eq1).toHaveBeenCalledWith("form_id", "form-1");
    expect(eq2).toHaveBeenCalledWith("user_id", "user-1");
    expect(result).toEqual(row);
  });
});

describe("listUserApplications", () => {
  it("joins the form and orders by created_at desc", async () => {
    const rows = [{ id: "app-1", application_forms: { role_name: "Helper" } }];
    const order = vi.fn().mockResolvedValue({ data: rows, error: null });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await listUserApplications(client, "user-1");

    expect(select).toHaveBeenCalledWith("*, application_forms(*)");
    expect(eq).toHaveBeenCalledWith("user_id", "user-1");
    expect(result).toEqual(rows);
  });
});

describe("admin CRUD for application_forms", () => {
  it("listApplicationForms orders by 'order' regardless of enabled", async () => {
    const rows = [{ id: "1", enabled: false }];
    const order = vi.fn().mockResolvedValue({ data: rows, error: null });
    const select = vi.fn().mockReturnValue({ order });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    expect(await listApplicationForms(client)).toEqual(rows);
  });

  it("upsertApplicationForm returns the saved row", async () => {
    const row = { id: "1", role_name: "Helper" };
    const single = vi.fn().mockResolvedValue({ data: row, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const upsert = vi.fn().mockReturnValue({ select });
    const from = vi.fn().mockReturnValue({ upsert });
    const client = { from } as unknown as SupabaseClient<Database>;

    expect(await upsertApplicationForm(client, { role_name: "Helper", slug: "helper" })).toEqual(row);
  });

  it("deleteApplicationForm deletes by id", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const del = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ delete: del });
    const client = { from } as unknown as SupabaseClient<Database>;

    await deleteApplicationForm(client, "form-1");
    expect(eq).toHaveBeenCalledWith("id", "form-1");
  });

  it("setApplicationFormEnabled updates only enabled", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ update });
    const client = { from } as unknown as SupabaseClient<Database>;

    await setApplicationFormEnabled(client, "form-1", false);
    expect(update).toHaveBeenCalledWith({ enabled: false });
  });
});

describe("admin CRUD for application_questions", () => {
  it("upsertApplicationQuestion returns the saved row", async () => {
    const row = { id: "1", form_id: "form-1", label: "Età" };
    const single = vi.fn().mockResolvedValue({ data: row, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const upsert = vi.fn().mockReturnValue({ select });
    const from = vi.fn().mockReturnValue({ upsert });
    const client = { from } as unknown as SupabaseClient<Database>;

    expect(await upsertApplicationQuestion(client, { form_id: "form-1", label: "Età" })).toEqual(row);
  });

  it("deleteApplicationQuestion deletes by id", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const del = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ delete: del });
    const client = { from } as unknown as SupabaseClient<Database>;

    await deleteApplicationQuestion(client, "q-1");
    expect(eq).toHaveBeenCalledWith("id", "q-1");
  });
});

describe("listAllApplications", () => {
  it("joins the form and orders by created_at desc", async () => {
    const rows = [{ id: "app-1", application_forms: { role_name: "Helper" } }];
    const order = vi.fn().mockResolvedValue({ data: rows, error: null });
    const select = vi.fn().mockReturnValue({ order });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    expect(await listAllApplications(client)).toEqual(rows);
  });
});

describe("getApplicationById", () => {
  it("returns the application when found", async () => {
    const row = { id: "app-1" };
    const maybeSingle = vi.fn().mockResolvedValue({ data: row, error: null });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    expect(await getApplicationById(client, "app-1")).toEqual(row);
  });
});

describe("getApplicationAnswers", () => {
  it("joins the question for each answer", async () => {
    const rows = [{ id: "1", application_questions: { label: "Età" } }];
    const eq = vi.fn().mockResolvedValue({ data: rows, error: null });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await getApplicationAnswers(client, "app-1");

    expect(select).toHaveBeenCalledWith("*, application_questions(*)");
    expect(eq).toHaveBeenCalledWith("application_id", "app-1");
    expect(result).toEqual(rows);
  });
});

describe("reviewApplication", () => {
  it("updates status, notes and reviewer with a timestamp", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ update });
    const client = { from } as unknown as SupabaseClient<Database>;

    await reviewApplication(client, "app-1", { status: "accepted", notes: "Ottimo", reviewedBy: "admin-1" });

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "accepted",
        notes: "Ottimo",
        reviewed_by: "admin-1",
        reviewed_at: expect.any(String),
      })
    );
    expect(eq).toHaveBeenCalledWith("id", "app-1");
  });

  it("throws when Supabase returns an error", async () => {
    const eq = vi.fn().mockResolvedValue({ error: { message: "boom" } });
    const update = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ update });
    const client = { from } as unknown as SupabaseClient<Database>;

    await expect(
      reviewApplication(client, "app-1", { status: "rejected", reviewedBy: "admin-1" })
    ).rejects.toThrow("reviewApplication: boom");
  });
});
