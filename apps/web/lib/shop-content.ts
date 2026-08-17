import { createSupabaseClient, getEnabledProductsWithFeatures, getProductCategories } from "@crewmate/db";
import type { ProductCategoryRow, ProductWithFeatures } from "@crewmate/db";

export interface ShopContent {
  categories: ProductCategoryRow[];
  products: ProductWithFeatures[];
}

// Stesso catalogo dello scheletro statico originale, usato finché non
// esiste un progetto Supabase reale o se una query fallisce.
const DEFAULT_CATEGORIES: ProductCategoryRow[] = [
  { id: "default-ranghi", name: "Ranghi", slug: "ranghi", order: 1 },
  { id: "default-kit", name: "Kit", slug: "kit", order: 2 },
  { id: "default-cosmetici", name: "Cosmetici", slug: "cosmetici", order: 3 },
];

function feature(productId: string, text: string, order: number) {
  return { id: `${productId}-${order}`, product_id: productId, text, order };
}

const DEFAULT_PRODUCTS: ProductWithFeatures[] = [
  {
    id: "default-vip",
    category_id: "default-ranghi",
    name: "VIP",
    description: "Il primo passo per sostenere il server.",
    price: 4.99,
    currency: "EUR",
    image_url: null,
    featured: false,
    enabled: true,
    order: 1,
    stock: null,
    product_features: [
      feature("default-vip", "Prefix [VIP] in chat", 1),
      feature("default-vip", "2 home extra", 2),
      feature("default-vip", "Accesso a /kit vip", 3),
    ],
  },
  {
    id: "default-mvp",
    category_id: "default-ranghi",
    name: "MVP",
    description: "Il rango più scelto dalla community.",
    price: 9.99,
    currency: "EUR",
    image_url: null,
    featured: true,
    enabled: true,
    order: 2,
    stock: null,
    product_features: [
      feature("default-mvp", "Tutti i vantaggi VIP", 1),
      feature("default-mvp", "Prefix [MVP] colorato", 2),
      feature("default-mvp", "5 home extra", 3),
      feature("default-mvp", "Effetti particellari", 4),
    ],
  },
  {
    id: "default-elite",
    category_id: "default-ranghi",
    name: "ELITE",
    description: "Il massimo dei vantaggi su CrewMate Network.",
    price: 19.99,
    currency: "EUR",
    image_url: null,
    featured: false,
    enabled: true,
    order: 3,
    stock: null,
    product_features: [
      feature("default-elite", "Tutti i vantaggi MVP", 1),
      feature("default-elite", "Prefix [ELITE] animato", 2),
      feature("default-elite", "Home illimitate", 3),
      feature("default-elite", "Accesso prioritario", 4),
    ],
  },
  {
    id: "default-kit-guerriero",
    category_id: "default-kit",
    name: "Kit Guerriero",
    description: "Tutto il necessario per il combattimento.",
    price: 2.99,
    currency: "EUR",
    image_url: null,
    featured: false,
    enabled: true,
    order: 1,
    stock: null,
    product_features: [
      feature("default-kit-guerriero", "Armatura in diamante", 1),
      feature("default-kit-guerriero", "Spada incantata", 2),
      feature("default-kit-guerriero", "Pozioni assortite", 3),
    ],
  },
  {
    id: "default-kit-minatore",
    category_id: "default-kit",
    name: "Kit Minatore",
    description: "Tutto il necessario per minare in profondità.",
    price: 2.99,
    currency: "EUR",
    image_url: null,
    featured: false,
    enabled: true,
    order: 2,
    stock: null,
    product_features: [
      feature("default-kit-minatore", "Piccone Fortuna III", 1),
      feature("default-kit-minatore", "Set completo di picconi", 2),
      feature("default-kit-minatore", "Torce e cibo", 3),
    ],
  },
  {
    id: "default-particelle",
    category_id: "default-cosmetici",
    name: "Pacchetto Particelle",
    description: "Personalizza il tuo stile in gioco.",
    price: 3.99,
    currency: "EUR",
    image_url: null,
    featured: false,
    enabled: true,
    order: 1,
    stock: null,
    product_features: [
      feature("default-particelle", "20+ effetti particellari", 1),
      feature("default-particelle", "Scie personalizzate", 2),
      feature("default-particelle", "Ali cosmetiche", 3),
    ],
  },
];

const DEFAULT_SHOP_CONTENT: ShopContent = {
  categories: DEFAULT_CATEGORIES,
  products: DEFAULT_PRODUCTS,
};

function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getShopContent(): Promise<ShopContent> {
  if (!isSupabaseConfigured()) {
    return DEFAULT_SHOP_CONTENT;
  }

  try {
    const client = createSupabaseClient({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    });

    const [categories, products] = await Promise.all([
      getProductCategories(client),
      getEnabledProductsWithFeatures(client),
    ]);

    return {
      categories: categories.length > 0 ? categories : DEFAULT_CATEGORIES,
      products: products.length > 0 ? products : DEFAULT_PRODUCTS,
    };
  } catch {
    return DEFAULT_SHOP_CONTENT;
  }
}
