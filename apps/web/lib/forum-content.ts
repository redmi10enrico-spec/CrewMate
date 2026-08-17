import { createSupabaseClient, getForumCategories, getForumStats, getLatestThreads } from "@crewmate/db";
import type { ForumCategoryRow, ForumStats, ForumThreadWithAuthor } from "@crewmate/db";

export interface ForumHomeContent {
  categories: ForumCategoryRow[];
  stats: ForumStats;
  latestThreads: ForumThreadWithAuthor[];
}

const EMPTY_CONTENT: ForumHomeContent = {
  categories: [],
  stats: { threads: 0, posts: 0, members: 0 },
  latestThreads: [],
};

function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

// Come per le candidature, le categorie del forum sono interamente
// definite dall'admin: nessun fallback statico sensato, solo uno stato
// vuoto onesto se Supabase non è configurato o non ci sono ancora
// categorie.
export async function getForumHomeContent(): Promise<ForumHomeContent> {
  if (!isSupabaseConfigured()) {
    return EMPTY_CONTENT;
  }

  try {
    const client = createSupabaseClient({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    });

    const [categories, stats, latestThreads] = await Promise.all([
      getForumCategories(client),
      getForumStats(client),
      getLatestThreads(client, 5),
    ]);

    return { categories, stats, latestThreads };
  } catch {
    return EMPTY_CONTENT;
  }
}
