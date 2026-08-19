const allProductImages = import.meta.glob(
  "../assets/images/products/*/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" },
);

const entries = Object.entries(allProductImages);

// só casa se depois do prefixo vier direto o número do índice (ex: "-1.jpg")
// — sem isso, "alcachofra-" bateria também com "alcachofra-100g-1.jpg" e a
// galeria padrão ficaria contaminada com fotos de gramagem específica
function matchImages(prefix) {
  const pattern = new RegExp(`${prefix}(\\d+)\\.[a-z]+$`, "i");

  return entries
    .filter(([path]) => pattern.test(path))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url);
}

// convenção: fotos gerais em {slug}-N.jpg, fotos por gramagem em
// {slug}-{peso}-N.jpg (ex: cha-de-alcachofra-20g-1.jpg). Sem foto específica
// da gramagem, cai na galeria padrão do produto.
export function getProductImages(categorySlug, productSlug, weight) {
  if (weight) {
    const weightSlug = weight.toLowerCase().replace(/\s+/g, "");
    const weighted = matchImages(
      `/products/${categorySlug}/${productSlug}-${weightSlug}-`,
    );
    if (weighted.length > 0) return weighted;
  }

  return matchImages(`/products/${categorySlug}/${productSlug}-`);
}

// nomear os arquivos cha-de-alcachofra-20g-1.jpg, cha-de-alcachofra-100g-1.jpg
