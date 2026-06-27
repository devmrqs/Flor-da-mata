import { useEffect } from "react";
import styles from "./ProductModal.module.css";

const ProductModal = ({ product, onClose }) => {
  useEffect(() => {
    if (!product) return;
    function handleEscKey(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [product, onClose]);
  if (!product) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
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
