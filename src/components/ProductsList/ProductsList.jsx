import { useState } from "react";

// Components
import ProductModal from "../ProductModal/ProductModal";

// CSS
import styles from "./ProductsList.module.css";

const ProductsList = ({ category, categoryImage, variant, panelRef }) => {
  // Índice no array, não o produto em si — a navegação (setinhas) dentro
  // do modal precisa de uma posição confiável, e o slug não é garantido
  // único (dois produtos com o mesmo slug quebrariam uma busca por slug).
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <>
      <div
        ref={panelRef}
        className={`${styles.productsPanel} ${
          variant === "insideCard" ? styles.insideCard : ""
        }`}
      >
        <aside className={styles.categoryPreview}>
          <div className={styles.imageWrapper}>
            <img
              src={categoryImage}
              alt={category.title}
              className={styles.categoryImage}
            />
          </div>
          <div className={styles.previewContent}>
            <span className={styles.label}>Categoria</span>
            <h3>{category.title}</h3>
            <p>{category.description}</p>
          </div>
        </aside>

        <div className={styles.productsContent}>
          <div className={styles.productsHeader}>
            <span className={styles.label}>Produtos</span>
            <h4>Itens disponíveis</h4>
            <p>Confira os principais produtos da categoria {category.title}.</p>
          </div>

          <div className={styles.productsScroll}>
            <ul className={styles.productsGrid}>
              {category.products?.map((product, index) => (
                <li
                  key={product.slug + index}
                  className={styles.productItem}
                  onClick={() => setSelectedIndex(index)}
                >
                  {product.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* key não é o índice do produto — trocar de produto (setinhas)
          precisa manter o modal montado pra animar o slide entre eles.
          Só remonta de fato ao abrir/fechar (entrada/saída em zoom). */}
      <ProductModal
        key={selectedIndex !== null ? "open" : "closed"}
        products={category.products}
        initialIndex={selectedIndex}
        categorySlug={category.slug}
        categoryTitle={category.title}
        onClose={() => setSelectedIndex(null)}
      />
    </>
  );
};

export default ProductsList;
