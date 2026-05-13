export const inventoryVisibilityValues = ["PRIVATE", "PUBLIC"] as const;
export type InventoryVisibility = (typeof inventoryVisibilityValues)[number];

export const inventoryStatusValues = ["AVAILABLE", "RESERVED", "BORROWED", "ARCHIVED"] as const;
export type InventoryStatus = (typeof inventoryStatusValues)[number];
