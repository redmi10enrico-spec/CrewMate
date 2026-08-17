import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export type ApplicationFormRow = Database["public"]["Tables"]["application_forms"]["Row"];
export type ApplicationFormInput = Database["public"]["Tables"]["application_forms"]["Insert"];
export type ApplicationQuestionRow = Database["public"]["Tables"]["application_questions"]["Row"];
export type ApplicationQuestionInput = Database["public"]["Tables"]["application_questions"]["Insert"];
export type ApplicationRow = Database["public"]["Tables"]["applications"]["Row"];
export type ApplicationAnswerRow = Database["public"]["Tables"]["application_answers"]["Row"];

export interface ApplicationWithForm extends ApplicationRow {
  application_forms: ApplicationFormRow | null;
}

export interface ApplicationAnswerWithQuestion extends ApplicationAnswerRow {
  application_questions: ApplicationQuestionRow | null;
}

// --- Lettura pubblica ---------------------------------------------------

export async function getApplicationForms(
  client: SupabaseClient<Database>
): Promise<ApplicationFormRow[]> {
  const { data, error } = await client
    .from("application_forms")
    .select("*")
    .eq("enabled", true)
    .order("order", { ascending: true });

  if (error) {
    throw new Error(`getApplicationForms: ${error.message}`);
  }

  return data ?? [];
}

export async function getApplicationQuestions(
  client: SupabaseClient<Database>,
  formId: string
): Promise<ApplicationQuestionRow[]> {
  const { data, error } = await client
    .from("application_questions")
    .select("*")
    .eq("form_id", formId)
    .order("order", { ascending: true });

  if (error) {
    throw new Error(`getApplicationQuestions: ${error.message}`);
  }

  return data ?? [];
}

// --- Invio candidatura (client dell'utente autenticato) -----------------

export interface AnswerInput {
  questionId: string;
  value: string;
}

/**
 * Crea una candidatura 'pending' con le sue risposte. Va chiamata con il
 * client dell'utente autenticato: la RLS permette solo di creare
 * candidature proprie in stato 'pending'.
 */
export async function submitApplication(
  client: SupabaseClient<Database>,
  formId: string,
  userId: string,
  answers: AnswerInput[]
): Promise<ApplicationRow> {
  const { data: application, error: applicationError } = await client
    .from("applications")
    .insert({ form_id: formId, user_id: userId, status: "pending" })
    .select()
    .single();

  if (applicationError) {
    throw new Error(`submitApplication: ${applicationError.message}`);
  }

  if (answers.length > 0) {
    const { error: answersError } = await client.from("application_answers").insert(
      answers.map((answer) => ({
        application_id: application.id,
        question_id: answer.questionId,
        value: answer.value,
      }))
    );

    if (answersError) {
      throw new Error(`submitApplication: ${answersError.message}`);
    }
  }

  return application;
}

export async function getUserApplication(
  client: SupabaseClient<Database>,
  formId: string,
  userId: string
): Promise<ApplicationRow | null> {
  const { data, error } = await client
    .from("applications")
    .select("*")
    .eq("form_id", formId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(`getUserApplication: ${error.message}`);
  }

  return data;
}

export async function listUserApplications(
  client: SupabaseClient<Database>,
  userId: string
): Promise<ApplicationWithForm[]> {
  const { data, error } = await client
    .from("applications")
    .select("*, application_forms(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`listUserApplications: ${error.message}`);
  }

  return (data ?? []) as unknown as ApplicationWithForm[];
}

// --- Pannello admin (client service-role) --------------------------------

export async function listApplicationForms(
  client: SupabaseClient<Database>
): Promise<ApplicationFormRow[]> {
  const { data, error } = await client
    .from("application_forms")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    throw new Error(`listApplicationForms: ${error.message}`);
  }

  return data ?? [];
}

export async function upsertApplicationForm(
  client: SupabaseClient<Database>,
  input: ApplicationFormInput
): Promise<ApplicationFormRow> {
  const { data, error } = await client.from("application_forms").upsert(input).select().single();

  if (error) {
    throw new Error(`upsertApplicationForm: ${error.message}`);
  }

  return data;
}

export async function deleteApplicationForm(client: SupabaseClient<Database>, id: string): Promise<void> {
  const { error } = await client.from("application_forms").delete().eq("id", id);

  if (error) {
    throw new Error(`deleteApplicationForm: ${error.message}`);
  }
}

export async function setApplicationFormEnabled(
  client: SupabaseClient<Database>,
  id: string,
  enabled: boolean
): Promise<void> {
  const { error } = await client.from("application_forms").update({ enabled }).eq("id", id);

  if (error) {
    throw new Error(`setApplicationFormEnabled: ${error.message}`);
  }
}

export async function upsertApplicationQuestion(
  client: SupabaseClient<Database>,
  input: ApplicationQuestionInput
): Promise<ApplicationQuestionRow> {
  const { data, error } = await client.from("application_questions").upsert(input).select().single();

  if (error) {
    throw new Error(`upsertApplicationQuestion: ${error.message}`);
  }

  return data;
}

export async function deleteApplicationQuestion(
  client: SupabaseClient<Database>,
  id: string
): Promise<void> {
  const { error } = await client.from("application_questions").delete().eq("id", id);

  if (error) {
    throw new Error(`deleteApplicationQuestion: ${error.message}`);
  }
}

export async function listAllApplications(
  client: SupabaseClient<Database>
): Promise<ApplicationWithForm[]> {
  const { data, error } = await client
    .from("applications")
    .select("*, application_forms(*)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`listAllApplications: ${error.message}`);
  }

  return (data ?? []) as unknown as ApplicationWithForm[];
}

export async function getApplicationById(
  client: SupabaseClient<Database>,
  id: string
): Promise<ApplicationRow | null> {
  const { data, error } = await client.from("applications").select("*").eq("id", id).maybeSingle();

  if (error) {
    throw new Error(`getApplicationById: ${error.message}`);
  }

  return data;
}

export async function getApplicationAnswers(
  client: SupabaseClient<Database>,
  applicationId: string
): Promise<ApplicationAnswerWithQuestion[]> {
  const { data, error } = await client
    .from("application_answers")
    .select("*, application_questions(*)")
    .eq("application_id", applicationId);

  if (error) {
    throw new Error(`getApplicationAnswers: ${error.message}`);
  }

  return (data ?? []) as unknown as ApplicationAnswerWithQuestion[];
}

export interface ReviewApplicationInput {
  status: Database["public"]["Tables"]["applications"]["Row"]["status"];
  notes?: string | null;
  reviewedBy: string;
}

export async function reviewApplication(
  client: SupabaseClient<Database>,
  applicationId: string,
  input: ReviewApplicationInput
): Promise<void> {
  const { error } = await client
    .from("applications")
    .update({
      status: input.status,
      notes: input.notes ?? null,
      reviewed_by: input.reviewedBy,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", applicationId);

  if (error) {
    throw new Error(`reviewApplication: ${error.message}`);
  }
}
