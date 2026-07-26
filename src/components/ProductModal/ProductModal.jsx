/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import Button from "../Button/Button.jsx";
import { getProductImages } from "../../utils/productImages.js";
import styles from "./ProductModal.module.css";

const ProductModal = ({ product, categorySlug, categoryTitle, onClose }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(
    product?.weights?.[0] ?? null,
  );
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const isClosingRef = useRef(false);

  // Entrada: overlay some, modal "salta" pro centro com leve overshoot de
  // escala, e o conteúdo de texto entra em stagger logo em seguida.
  useGSAP(
    () => {
      if (!product) return;

      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(modalRef.current, { scale: 0.82, opacity: 0 });

      gsap
        .timeline()
        .to(overlayRef.current, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        })
        .to(
          modalRef.current,
          { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.6)" },
          "-=0.2",
        )
        .from(
          `.${styles.categoryBadge}, .${styles.infoHeader} > *, .${styles.desc}, .${styles.weightsBlock}, .${styles.details}, .${styles.cta}`,
          {
            opacity: 0,
            y: 14,
            duration: 0.4,
            stagger: 0.06,
            ease: "power2.out",
          },
          "-=0.25",
        );
    },
    { scope: overlayRef },
  );

  function playExitAnimation(onComplete) {
    gsap
      .timeline({ onComplete })
      .to(modalRef.current, {
        scale: 0.85,
        duration: 0.4,
        ease: "back.in(1.7)",
      })
      .to(
        [modalRef.current, overlayRef.current],
        { opacity: 0, duration: 0.25, ease: "power2.in" },
        "-=0.3",
      );
  }

  function handleClose() {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    playExitAnimation(onClose);
  }

  useEffect(() => {
    if (!product) return;

    function handleEscKey(event) {
      if (event.key === "Escape") handleClose();
    }

    document.addEventListener("keydown", handleEscKey);
    // O site usa ScrollSmoother (não scroll nativo) — travar overflow no body
    // não teria efeito, então pausamos o smoother enquanto o modal está aberto.
    ScrollSmoother.get()?.paused(true);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      ScrollSmoother.get()?.paused(false);
    };
  }, [product, handleClose]);

  if (!product) return null;

  const images = getProductImages(categorySlug, product.slug);

  return createPortal(
    <div className={styles.overlay} onClick={handleClose} ref={overlayRef}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <button
          className={styles.closeButton}
          onClick={handleClose}
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

            {categoryTitle && (
              <span className={styles.categoryBadge}>{categoryTitle}</span>
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
    </div>,
    document.body,
  );
};

export default ProductModal;
