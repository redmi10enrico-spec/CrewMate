import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import {
  createThread,
  deleteForumCategory,
  deletePost,
  deleteThread,
  getForumCategories,
  getForumPosts,
  getForumStats,
  getForumThreadBySlug,
  getForumThreads,
  getLatestThreads,
  incrementThreadViews,
  listAllForumThreads,
  replyToThread,
  setThreadLocked,
  setThreadPinned,
  upsertForumCategory,
} from "./forum";

describe("getForumCategories", () => {
  it("orders categories by 'order'", async () => {
    const rows = [{ id: "1", name: "Annunci" }];
    const order = vi.fn().mockResolvedValue({ data: rows, error: null });
    const select = vi.fn().mockReturnValue({ order });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    expect(await getForumCategories(client)).toEqual(rows);
    expect(from).toHaveBeenCalledWith("forum_categories");
  });
});

describe("getForumThreads", () => {
  it("filters by category, pinned first then most recently replied", async () => {
    const rows = [{ id: "1", pinned: true }];
    const order2 = vi.fn().mockResolvedValue({ data: rows, error: null });
    const order1 = vi.fn().mockReturnValue({ order: order2 });
    const eq = vi.fn().mockReturnValue({ order: order1 });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await getForumThreads(client, "cat-1");

    expect(select).toHaveBeenCalledWith("*, profiles(id, mc_username, avatar_url)");
    expect(eq).toHaveBeenCalledWith("category_id", "cat-1");
    expect(order1).toHaveBeenCalledWith("pinned", { ascending: false });
    expect(order2).toHaveBeenCalledWith("last_reply_at", { ascending: false });
    expect(result).toEqual(rows);
  });
});

describe("getForumThreadBySlug", () => {
  it("filters by category and slug", async () => {
    const row = { id: "1", slug: "prima-discussione" };
    const maybeSingle = vi.fn().mockResolvedValue({ data: row, error: null });
    const eq2 = vi.fn().mockReturnValue({ maybeSingle });
    const eq1 = vi.fn().mockReturnValue({ eq: eq2 });
    const select = vi.fn().mockReturnValue({ eq: eq1 });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await getForumThreadBySlug(client, "cat-1", "prima-discussione");

    expect(eq1).toHaveBeenCalledWith("category_id", "cat-1");
    expect(eq2).toHaveBeenCalledWith("slug", "prima-discussione");
    expect(result).toEqual(row);
  });
});

describe("getForumPosts", () => {
  it("filters by thread and orders chronologically", async () => {
    const rows = [{ id: "1", content: "ciao" }];
    const order = vi.fn().mockResolvedValue({ data: rows, error: null });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await getForumPosts(client, "thread-1");

    expect(eq).toHaveBeenCalledWith("thread_id", "thread-1");
    expect(order).toHaveBeenCalledWith("created_at", { ascending: true });
    expect(result).toEqual(rows);
  });
});

describe("getLatestThreads", () => {
  it("orders by created_at desc and applies the limit", async () => {
    const rows = [{ id: "1" }];
    const limit = vi.fn().mockResolvedValue({ data: rows, error: null });
    const order = vi.fn().mockReturnValue({ limit });
    const select = vi.fn().mockReturnValue({ order });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await getLatestThreads(client, 3);

    expect(order).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(limit).toHaveBeenCalledWith(3);
    expect(result).toEqual(rows);
  });
});

describe("getForumStats", () => {
  it("counts threads, posts and members", async () => {
    const from = vi.fn((table: string) => ({
      select: vi.fn().mockResolvedValue({
        count: table === "forum_threads" ? 5 : table === "forum_posts" ? 12 : 30,
        error: null,
      }),
    }));
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await getForumStats(client);

    expect(result).toEqual({ threads: 5, posts: 12, members: 30 });
  });

  it("throws when one of the counts errors", async () => {
    const from = vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ count: null, error: { message: "boom" } }),
    }));
    const client = { from } as unknown as SupabaseClient<Database>;

    await expect(getForumStats(client)).rejects.toThrow("getForumStats: boom");
  });
});

describe("incrementThreadViews", () => {
  it("calls the increment_thread_views RPC", async () => {
    const rpc = vi.fn().mockResolvedValue({ error: null });
    const client = { rpc } as unknown as SupabaseClient<Database>;

    await incrementThreadViews(client, "thread-1");

    expect(rpc).toHaveBeenCalledWith("increment_thread_views", { thread_id: "thread-1" });
  });

  it("throws when the RPC returns an error", async () => {
    const rpc = vi.fn().mockResolvedValue({ error: { message: "boom" } });
    const client = { rpc } as unknown as SupabaseClient<Database>;

    await expect(incrementThreadViews(client, "thread-1")).rejects.toThrow("incrementThreadViews: boom");
  });
});

function mockCreateThreadClient(options: {
  thread: { id: string } | null;
  threadError?: { message: string } | null;
  postError?: { message: string } | null;
}) {
  const single = vi.fn().mockResolvedValue({ data: options.thread, error: options.threadError ?? null });
  const select = vi.fn().mockReturnValue({ single });
  const threadInsert = vi.fn().mockReturnValue({ select });

  const postInsert = vi.fn().mockResolvedValue({ error: options.postError ?? null });

  const from = vi.fn((table: string) => {
    if (table === "forum_threads") return { insert: threadInsert };
    if (table === "forum_posts") return { insert: postInsert };
    throw new Error(`unexpected table ${table}`);
  });

  return { client: { from } as unknown as SupabaseClient<Database>, threadInsert, postInsert };
}

describe("createThread", () => {
  it("creates the thread with a slugified title, then the opening post", async () => {
    const { client, threadInsert, postInsert } = mockCreateThreadClient({ thread: { id: "thread-1" } });

    const result = await createThread(client, {
      categoryId: "cat-1",
      authorId: "user-1",
      title: "Perché è così bello giocare qui?",
      content: "Il mio primo post",
    });

    expect(threadInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        category_id: "cat-1",
        author_id: "user-1",
        title: "Perché è così bello giocare qui?",
        slug: expect.stringMatching(/^perche-e-cosi-bello-giocare-qui-[a-z0-9]+$/),
      })
    );
    expect(postInsert).toHaveBeenCalledWith({
      thread_id: "thread-1",
      author_id: "user-1",
      content: "Il mio primo post",
    });
    expect(result).toEqual({ id: "thread-1" });
  });

  it("throws when creating the thread fails", async () => {
    const { client } = mockCreateThreadClient({ thread: null, threadError: { message: "boom" } });

    await expect(
      createThread(client, { categoryId: "cat-1", authorId: "user-1", title: "Titolo", content: "x" })
    ).rejects.toThrow("createThread: boom");
  });

  it("throws when creating the opening post fails", async () => {
    const { client } = mockCreateThreadClient({ thread: { id: "thread-1" }, postError: { message: "boom" } });

    await expect(
      createThread(client, { categoryId: "cat-1", authorId: "user-1", title: "Titolo", content: "x" })
    ).rejects.toThrow("createThread: boom");
  });
});

describe("replyToThread", () => {
  it("inserts a post and returns it", async () => {
    const row = { id: "post-1", thread_id: "thread-1", content: "risposta" };
    const single = vi.fn().mockResolvedValue({ data: row, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const insert = vi.fn().mockReturnValue({ select });
    const from = vi.fn().mockReturnValue({ insert });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await replyToThread(client, { threadId: "thread-1", authorId: "user-1", content: "risposta" });

    expect(insert).toHaveBeenCalledWith({ thread_id: "thread-1", author_id: "user-1", content: "risposta" });
    expect(result).toEqual(row);
  });
});

describe("admin CRUD and moderation", () => {
  it("upsertForumCategory returns the saved row", async () => {
    const row = { id: "1", name: "Annunci" };
    const single = vi.fn().mockResolvedValue({ data: row, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const upsert = vi.fn().mockReturnValue({ select });
    const from = vi.fn().mockReturnValue({ upsert });
    const client = { from } as unknown as SupabaseClient<Database>;

    expect(await upsertForumCategory(client, { name: "Annunci", slug: "annunci" })).toEqual(row);
  });

  it("deleteForumCategory deletes by id", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const del = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ delete: del });
    const client = { from } as unknown as SupabaseClient<Database>;

    await deleteForumCategory(client, "cat-1");
    expect(eq).toHaveBeenCalledWith("id", "cat-1");
  });

  it("setThreadPinned updates only pinned", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ update });
    const client = { from } as unknown as SupabaseClient<Database>;

    await setThreadPinned(client, "thread-1", true);
    expect(update).toHaveBeenCalledWith({ pinned: true });
  });

  it("setThreadLocked updates only locked", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ update });
    const client = { from } as unknown as SupabaseClient<Database>;

    await setThreadLocked(client, "thread-1", true);
    expect(update).toHaveBeenCalledWith({ locked: true });
  });

  it("deleteThread deletes by id", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const del = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ delete: del });
    const client = { from } as unknown as SupabaseClient<Database>;

    await deleteThread(client, "thread-1");
    expect(eq).toHaveBeenCalledWith("id", "thread-1");
  });

  it("deletePost deletes by id", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const del = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ delete: del });
    const client = { from } as unknown as SupabaseClient<Database>;

    await deletePost(client, "post-1");
    expect(eq).toHaveBeenCalledWith("id", "post-1");
  });
});

describe("listAllForumThreads", () => {
  it("joins author and category, ordered by created_at desc", async () => {
    const rows = [{ id: "1", forum_categories: { name: "Annunci" } }];
    const order = vi.fn().mockResolvedValue({ data: rows, error: null });
    const select = vi.fn().mockReturnValue({ order });
    const from = vi.fn().mockReturnValue({ select });
    const client = { from } as unknown as SupabaseClient<Database>;

    const result = await listAllForumThreads(client);

    expect(select).toHaveBeenCalledWith("*, profiles(id, mc_username, avatar_url), forum_categories(*)");
    expect(result).toEqual(rows);
  });
});
