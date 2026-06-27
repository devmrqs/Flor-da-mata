import styles from "./ProductModal.module.css";

const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          type="button"
          aria-label="Fechar modal"
        >
          ×
        </button>

        <div className={styles.content}>
          <h2>{product.name}</h2>

          <p>{product.shortDescription}</p>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
