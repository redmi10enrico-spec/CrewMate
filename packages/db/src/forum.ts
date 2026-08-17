import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import type { ProfileRow } from "./profiles";

export type ForumCategoryRow = Database["public"]["Tables"]["forum_categories"]["Row"];
export type ForumCategoryInput = Database["public"]["Tables"]["forum_categories"]["Insert"];
export type ForumThreadRow = Database["public"]["Tables"]["forum_threads"]["Row"];
export type ForumPostRow = Database["public"]["Tables"]["forum_posts"]["Row"];

type ThreadAuthor = Pick<ProfileRow, "id" | "mc_username" | "avatar_url"> | null;

export interface ForumThreadWithAuthor extends ForumThreadRow {
  profiles: ThreadAuthor;
}

export interface ForumPostWithAuthor extends ForumPostRow {
  profiles: ThreadAuthor;
}

export interface ForumStats {
  threads: number;
  posts: number;
  members: number;
}

const COMBINING_DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
  return base || "discussione";
}

// --- Lettura pubblica (filtrata dalla RLS in base a min_role_view) -----

export async function getForumCategories(client: SupabaseClient<Database>): Promise<ForumCategoryRow[]> {
  const { data, error } = await client.from("forum_categories").select("*").order("order", { ascending: true });

  if (error) {
    throw new Error(`getForumCategories: ${error.message}`);
  }

  return data ?? [];
}

export async function getForumThreads(
  client: SupabaseClient<Database>,
  categoryId: string
): Promise<ForumThreadWithAuthor[]> {
  const { data, error } = await client
    .from("forum_threads")
    .select("*, profiles(id, mc_username, avatar_url)")
    .eq("category_id", categoryId)
    .order("pinned", { ascending: false })
    .order("last_reply_at", { ascending: false });

  if (error) {
    throw new Error(`getForumThreads: ${error.message}`);
  }

  return (data ?? []) as unknown as ForumThreadWithAuthor[];
}

export async function getForumThreadBySlug(
  client: SupabaseClient<Database>,
  categoryId: string,
  slug: string
): Promise<ForumThreadRow | null> {
  const { data, error } = await client
    .from("forum_threads")
    .select("*")
    .eq("category_id", categoryId)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(`getForumThreadBySlug: ${error.message}`);
  }

  return data;
}

export async function getForumPosts(
  client: SupabaseClient<Database>,
  threadId: string
): Promise<ForumPostWithAuthor[]> {
  const { data, error } = await client
    .from("forum_posts")
    .select("*, profiles(id, mc_username, avatar_url)")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`getForumPosts: ${error.message}`);
  }

  return (data ?? []) as unknown as ForumPostWithAuthor[];
}

export async function getLatestThreads(
  client: SupabaseClient<Database>,
  limit = 5
): Promise<ForumThreadWithAuthor[]> {
  const { data, error } = await client
    .from("forum_threads")
    .select("*, profiles(id, mc_username, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`getLatestThreads: ${error.message}`);
  }

  return (data ?? []) as unknown as ForumThreadWithAuthor[];
}

export async function getForumStats(client: SupabaseClient<Database>): Promise<ForumStats> {
  const [threads, posts, members] = await Promise.all([
    client.from("forum_threads").select("*", { count: "exact", head: true }),
    client.from("forum_posts").select("*", { count: "exact", head: true }),
    client.from("profiles").select("*", { count: "exact", head: true }),
  ]);

  if (threads.error) {
    throw new Error(`getForumStats: ${threads.error.message}`);
  }
  if (posts.error) {
    throw new Error(`getForumStats: ${posts.error.message}`);
  }
  if (members.error) {
    throw new Error(`getForumStats: ${members.error.message}`);
  }

  return { threads: threads.count ?? 0, posts: posts.count ?? 0, members: members.count ?? 0 };
}

export async function incrementThreadViews(client: SupabaseClient<Database>, threadId: string): Promise<void> {
  const { error } = await client.rpc("increment_thread_views", { thread_id: threadId });

  if (error) {
    throw new Error(`incrementThreadViews: ${error.message}`);
  }
}

// --- Scrittura utente (client dell'utente autenticato) ------------------

export interface CreateThreadInput {
  categoryId: string;
  authorId: string;
  title: string;
  content: string;
}

export async function createThread(
  client: SupabaseClient<Database>,
  input: CreateThreadInput
): Promise<ForumThreadRow> {
  const slug = `${slugify(input.title)}-${Date.now().toString(36)}`;

  const { data: thread, error: threadError } = await client
    .from("forum_threads")
    .insert({ category_id: input.categoryId, author_id: input.authorId, title: input.title, slug })
    .select()
    .single();

  if (threadError) {
    throw new Error(`createThread: ${threadError.message}`);
  }

  const { error: postError } = await client.from("forum_posts").insert({
    thread_id: thread.id,
    author_id: input.authorId,
    content: input.content,
  });

  if (postError) {
    throw new Error(`createThread: ${postError.message}`);
  }

  return thread;
}

export interface ReplyToThreadInput {
  threadId: string;
  authorId: string;
  content: string;
}

export async function replyToThread(
  client: SupabaseClient<Database>,
  input: ReplyToThreadInput
): Promise<ForumPostRow> {
  const { data, error } = await client
    .from("forum_posts")
    .insert({ thread_id: input.threadId, author_id: input.authorId, content: input.content })
    .select()
    .single();

  if (error) {
    throw new Error(`replyToThread: ${error.message}`);
  }

  return data;
}

// --- Pannello admin (client service-role) --------------------------------

export interface ForumThreadWithCategory extends ForumThreadWithAuthor {
  forum_categories: ForumCategoryRow | null;
}

/** Tutti i thread di tutte le categorie, per la moderazione. */
export async function listAllForumThreads(
  client: SupabaseClient<Database>
): Promise<ForumThreadWithCategory[]> {
  const { data, error } = await client
    .from("forum_threads")
    .select("*, profiles(id, mc_username, avatar_url), forum_categories(*)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`listAllForumThreads: ${error.message}`);
  }

  return (data ?? []) as unknown as ForumThreadWithCategory[];
}

export async function upsertForumCategory(
  client: SupabaseClient<Database>,
  input: ForumCategoryInput
): Promise<ForumCategoryRow> {
  const { data, error } = await client.from("forum_categories").upsert(input).select().single();

  if (error) {
    throw new Error(`upsertForumCategory: ${error.message}`);
  }

  return data;
}

export async function deleteForumCategory(client: SupabaseClient<Database>, id: string): Promise<void> {
  const { error } = await client.from("forum_categories").delete().eq("id", id);

  if (error) {
    throw new Error(`deleteForumCategory: ${error.message}`);
  }
}

export async function setThreadPinned(
  client: SupabaseClient<Database>,
  id: string,
  pinned: boolean
): Promise<void> {
  const { error } = await client.from("forum_threads").update({ pinned }).eq("id", id);

  if (error) {
    throw new Error(`setThreadPinned: ${error.message}`);
  }
}

export async function setThreadLocked(
  client: SupabaseClient<Database>,
  id: string,
  locked: boolean
): Promise<void> {
  const { error } = await client.from("forum_threads").update({ locked }).eq("id", id);

  if (error) {
    throw new Error(`setThreadLocked: ${error.message}`);
  }
}

export async function deleteThread(client: SupabaseClient<Database>, id: string): Promise<void> {
  const { error } = await client.from("forum_threads").delete().eq("id", id);

  if (error) {
    throw new Error(`deleteThread: ${error.message}`);
  }
}

export async function deletePost(client: SupabaseClient<Database>, id: string): Promise<void> {
  const { error } = await client.from("forum_posts").delete().eq("id", id);

  if (error) {
    throw new Error(`deletePost: ${error.message}`);
  }
}
