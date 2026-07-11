import { useState } from "react";

// Components
import ProductModal from "../ProductModal/ProductModal";

// CSS
import styles from "./ProductsList.module.css";

const ProductsList = ({ category, categoryImage, variant }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <>
      <div
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
              {category.products?.map((product) => (
                <li
                  key={product.id}
                  className={styles.productItem}
                  onClick={() => setSelectedProduct(product)}
                >
                  {product.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <ProductModal
        key={selectedProduct?.id ?? "closed"}
        product={selectedProduct}
        categorySlug={category.slug}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
};

export default ProductsList;
