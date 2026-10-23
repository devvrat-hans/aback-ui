import { registryItems, type RegistryItemSummary } from "./registry.generated";

export const CATEGORY_ORDER = [
  "Foundation",
  "Forms",
  "Feedback",
  "Overlays",
  "Navigation",
  "Data Display",
  "Application",
] as const;

export type ComponentCategory = (typeof CATEGORY_ORDER)[number];

export const components: RegistryItemSummary[] = registryItems
  .filter((item) => item.type === "registry:ui")
  .sort((a, b) => a.title.localeCompare(b.title));

export const componentGroups = CATEGORY_ORDER.map((category) => ({
  category,
  items: components.filter((item) => item.categories?.includes(category)),
})).filter((group) => group.items.length > 0);

export function getComponent(name: string) {
  return components.find((item) => item.name === name);
}

export function usedInProducts(item: RegistryItemSummary | undefined) {
  return item?.meta?.usedIn ?? [];
}
