import styles from "./ProductsList.module.css";

const ProductsList = ({ category, categoryImage }) => {
  return (
    <div className={styles.productsPanel}>
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
              <li key={index} className={styles.productItem}>
                {product}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
