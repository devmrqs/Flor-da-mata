const allCategoryImages = import.meta.glob(
  "../assets/images/cards-products/*.png",
  { eager: true, import: "default" },
);

export function getCategoryImage(categorySlug) {
  const entry = Object.entries(allCategoryImages).find(([path]) =>
    path.endsWith(`/cards-products/${categorySlug}.png`),
  );
  return entry?.[1];
}
