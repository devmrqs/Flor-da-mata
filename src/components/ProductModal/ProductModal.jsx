import { useEffect } from "react";
import Button from "../Button/Button.jsx";
import styles from "./ProductModal.module.css";

const ProductModal = ({ product, onClose }) => {
  useEffect(() => {
    if (!product) return;

    function handleEscKey(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          type="button"
          aria-label="Fechar modal"
        >
          ×
        </button>

        <div className={styles.imageArea}>
          <div className={styles.imageBox}>
            <span>Imagem do produto</span>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.infoHeader}>
            <h2>{product.name || product}</h2>
            <p className={styles.shortDesc}>
              {product.shortDescription ||
                "Produto selecionado da linha Flor da Mata."}
            </p>
          </div>

          <p className={styles.desc}>
            {product.description ||
              "Em breve, este produto terá uma descrição completa com informações, características e opções disponíveis."}
          </p>

          {product.weights?.length > 0 && (
            <div className={styles.weights}>
              <span className={styles.label}>Gramagem</span>
              <div className={styles.weightsList}>
                {product.weights.map((weight) => (
                  <button
                    key={weight}
                    className={styles.weightBtn}
                    type="button"
                  >
                    {weight}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.details && (
            <div className={styles.details}>
              {product.details.origem && (
                <div className={styles.detailItem}>
                  <span>Origem:</span>
                  <strong>{product.details.origem}</strong>
                </div>
              )}
              {product.details.tipo && (
                <div className={styles.detailItem}>
                  <span>Tipo:</span>
                  <strong>{product.details.tipo}</strong>
                </div>
              )}
              {product.details.armazenamento && (
                <div className={styles.detailItem}>
                  <span>Armazenamento:</span>
                  <strong>{product.details.armazenamento}</strong>
                </div>
              )}
            </div>
          )}

          <div className={styles.cta}>
            <Button
              label="Solicitar orçamento"
              variant="primary"
              icon="arrow"
              size="small"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
