export { createSupabaseClient } from "./client";
export type { SupabaseEnv } from "./client";
export type { AppRole, Database, OrderStatus } from "./database.types";

export {
  createMcVerificationCode,
  generateVerificationCode,
  getProfile,
  hasRoleAtLeast,
  updateMcUsername,
  verifyMcCode,
} from "./profiles";
export type { CreatedVerificationCode, ProfileRow, VerifyMcCodeResult } from "./profiles";

export {
  deleteHomeFeature,
  deleteServerMode,
  getEnabledHomeFeatures,
  getEnabledServerModes,
  getSiteSettings,
  listHomeFeatures,
  listServerModes,
  setHomeFeatureEnabled,
  setServerModeEnabled,
  upsertHomeFeature,
  upsertServerMode,
  upsertSiteSettings,
} from "./site-content";
export type { HomeFeatureInput, HomeFeatureRow, ServerModeInput, ServerModeRow } from "./site-content";

export { logAdminAction } from "./audit-log";
export type { AdminActionInput } from "./audit-log";

export {
  deleteProduct,
  deleteProductCategory,
  deleteProductFeature,
  getEnabledProductsWithFeatures,
  getProductCategories,
  listProductFeatures,
  listProducts,
  setProductEnabled,
  upsertProduct,
  upsertProductCategory,
  upsertProductFeature,
} from "./shop";
export type {
  ProductCategoryInput,
  ProductCategoryRow,
  ProductFeatureInput,
  ProductFeatureRow,
  ProductInput,
  ProductRow,
  ProductWithFeatures,
} from "./shop";

export { createPendingOrder, listAllOrders, listUserOrders, markOrderPaid } from "./orders";
export type { CartLine, OrderItemRow, OrderRow } from "./orders";
