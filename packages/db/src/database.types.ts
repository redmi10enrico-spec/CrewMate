// Tipi scritti a mano per riflettere supabase/migrations/. Nessun progetto
// Supabase reale ancora creato (vedi docs/SETUP.md). Una volta creato,
// rigenera con:
//   supabase gen types typescript --project-id <project-id> > src/database.types.ts
// ...e verifica che coincida con questo file (le migrazioni restano la
// fonte di verità).

export type AppRole = "user" | "helper" | "mod" | "admin";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string | null;
          mc_username: string | null;
          mc_uuid: string | null;
          mc_verified: boolean;
          discord_id: string | null;
          avatar_url: string | null;
          role: AppRole;
          created_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          mc_username?: string | null;
          mc_uuid?: string | null;
          mc_verified?: boolean;
          discord_id?: string | null;
          avatar_url?: string | null;
          role?: AppRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          mc_username?: string | null;
          mc_uuid?: string | null;
          mc_verified?: boolean;
          discord_id?: string | null;
          avatar_url?: string | null;
          role?: AppRole;
          created_at?: string;
        };
        Relationships: [];
      };
      mc_verification_codes: {
        Row: {
          id: string;
          user_id: string;
          code: string;
          expires_at: string;
          used: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          code: string;
          expires_at: string;
          used?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          code?: string;
          expires_at?: string;
          used?: boolean;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: unknown;
        };
        Insert: {
          key: string;
          value: unknown;
        };
        Update: {
          key?: string;
          value?: unknown;
        };
        Relationships: [];
      };
      server_modes: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          icon: string;
          image_url: string | null;
          order: number;
          enabled: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          icon?: string;
          image_url?: string | null;
          order?: number;
          enabled?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          icon?: string;
          image_url?: string | null;
          order?: number;
          enabled?: boolean;
        };
        Relationships: [];
      };
      home_features: {
        Row: {
          id: string;
          title: string;
          description: string;
          icon: string;
          order: number;
          enabled: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          icon?: string;
          order?: number;
          enabled?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          icon?: string;
          order?: number;
          enabled?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      app_role: AppRole;
    };
    CompositeTypes: Record<string, never>;
  };
}
