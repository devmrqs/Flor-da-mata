const allProductImages = import.meta.glob(
  "../assets/images/products/*/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" },
);

export function getProductImages(categorySlug, productSlug) {
  return Object.entries(allProductImages)
    .filter(([path]) =>
      path.includes(`/products/${categorySlug}/${productSlug}-`),
    )
    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
    .map(([, url]) => url);
}
