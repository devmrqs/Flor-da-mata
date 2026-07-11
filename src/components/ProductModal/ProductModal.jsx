import { useEffect, useState } from "react";
import Button from "../Button/Button.jsx";
import { getProductImages } from "../../utils/productImages.js";
import styles from "./ProductModal.module.css";

const ProductModal = ({ product, categorySlug, onClose }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(
    product?.weights?.[0] ?? null,
  );

  useEffect(() => {
    if (!product) return;

    function handleEscKey(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscKey);
    return () => document.removeEventListener("keydown", handleEscKey);
  }, [product, onClose]);

  if (!product) return null;

  const images = getProductImages(categorySlug, product.slug);

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

        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            {images[activeImage] ? (
              <img
                src={images[activeImage]}
                alt={product.name}
                className={styles.mainImageImg}
              />
            ) : (
              <span>Imagem do produto</span>
            )}
          </div>

          {images.length > 1 && (
            <div className={styles.thumbList}>
              {images.map((imgSrc, index) => (
                <button
                  key={imgSrc}
                  type="button"
                  className={`${styles.thumb} ${
                    activeImage === index ? styles.thumbActive : ""
                  }`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Ver imagem ${index + 1}`}
                >
                  <img src={imgSrc} alt="" className={styles.thumbImg} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.info}>
          <div className={styles.infoHeader}>
            <span className={styles.label}>Flor da Mata</span>
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
            <div className={styles.weightsBlock}>
              <span className={styles.label}>Gramagem</span>
              <div className={styles.weightsList}>
                {product.weights.map((weight) => (
                  <button
                    key={weight}
                    type="button"
                    className={`${styles.weightCard} ${
                      selectedWeight === weight ? styles.weightCardActive : ""
                    }`}
                    onClick={() => setSelectedWeight(weight)}
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
                  <span>Origem</span>
                  <strong>{product.details.origem}</strong>
                </div>
              )}
              {product.details.tipo && (
                <div className={styles.detailItem}>
                  <span>Tipo</span>
                  <strong>{product.details.tipo}</strong>
                </div>
              )}
              {product.details.armazenamento && (
                <div className={styles.detailItem}>
                  <span>Armazenamento</span>
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
