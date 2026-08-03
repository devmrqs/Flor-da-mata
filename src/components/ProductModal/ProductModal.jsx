/* eslint-disable react-hooks/exhaustive-deps */
// Libraries
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";

// Components
import Button from "../Button/Button.jsx";

// Data
import { getProductImages } from "../../utils/productImages.js";

// Assets
import arrowLeft from "../../assets/images/arrowLeft.svg";
import arrowRight from "../../assets/images/arrowRight.svg";

// CSS
import styles from "./ProductModal.module.css";

const ProductModal = ({
  products,
  initialIndex,
  categorySlug,
  categoryTitle,
  onClose,
}) => {
  const isOpen = initialIndex !== null && initialIndex !== undefined;

  // Índice, não o produto/slug: slug não é garantido único
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentProduct = products?.[currentIndex];

  const [activeImage, setActiveImage] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(
    currentProduct?.weights?.[0] ?? null,
  );
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const isClosingRef = useRef(false);
  const isNavigatingRef = useRef(false);

  // Animação de entrada; roda só no mount, não na navegação entre produtos
  useGSAP(
    () => {
      if (!isOpen) return;

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

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < (products?.length ?? 0) - 1;

  // direction: -1 = anterior, 1 = próximo. Sinal invertido de propósito:
  // seta esquerda manda o card pra direita, e vice-versa.
  function goTo(direction) {
    if (isNavigatingRef.current) return;
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= (products?.length ?? 0)) return;

    isNavigatingRef.current = true;
    gsap.to(modalRef.current, {
      x: direction * -500,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        setCurrentIndex(nextIndex);
        setActiveImage(0);
        setSelectedWeight(products[nextIndex].weights?.[0] ?? null);
        gsap.set(modalRef.current, { x: 0, scale: 0.85, opacity: 0 });
        gsap.to(modalRef.current, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.6)",
          onComplete: () => {
            isNavigatingRef.current = false;
          },
        });
      },
    });
  }

  useEffect(() => {
    if (!isOpen) return;

    function handleEscKey(event) {
      if (event.key === "Escape") handleClose();
    }

    document.addEventListener("keydown", handleEscKey);
    // pausa o ScrollSmoother enquanto o modal está aberto
    ScrollSmoother.get()?.paused(true);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      ScrollSmoother.get()?.paused(false);
    };
  }, [isOpen, handleClose]);

  if (!isOpen || !currentProduct) return null;

  const images = getProductImages(categorySlug, currentProduct.slug);

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

        <div className={styles.content}>
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              {images[activeImage] ? (
                <img
                  src={images[activeImage]}
                  alt={currentProduct.name}
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
              <h2>{currentProduct.name || currentProduct}</h2>
              <p className={styles.shortDesc}>
                {currentProduct.shortDescription ||
                  "Produto selecionado da linha Flor da Mata."}
              </p>
            </div>

            <p className={styles.desc}>
              {currentProduct.description ||
                "Em breve, este produto terá uma descrição completa com informações, características e opções disponíveis."}
            </p>

            {currentProduct.weights?.length > 0 && (
              <div className={styles.weightsBlock}>
                <span className={styles.label}>Gramagem</span>
                <div className={styles.weightsList}>
                  {currentProduct.weights.map((weight) => (
                    <button
                      key={weight}
                      type="button"
                      className={`${styles.weightCard} ${
                        selectedWeight === weight
                          ? styles.weightCardActive
                          : ""
                      }`}
                      onClick={() => setSelectedWeight(weight)}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentProduct.details && (
              <div className={styles.details}>
                {currentProduct.details.origem && (
                  <div className={styles.detailItem}>
                    <span>Origem</span>
                    <strong>{currentProduct.details.origem}</strong>
                  </div>
                )}
                {currentProduct.details.tipo && (
                  <div className={styles.detailItem}>
                    <span>Tipo</span>
                    <strong>{currentProduct.details.tipo}</strong>
                  </div>
                )}
                {currentProduct.details.armazenamento && (
                  <div className={styles.detailItem}>
                    <span>Armazenamento</span>
                    <strong>{currentProduct.details.armazenamento}</strong>
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

            {products?.length > 1 && (
              <div className={styles.navRow}>
                <button
                  className={styles.navButton}
                  onClick={() => goTo(-1)}
                  disabled={!hasPrev}
                  type="button"
                  aria-label="Produto anterior"
                >
                  <img src={arrowLeft} alt="" />
                </button>
                <button
                  className={styles.navButton}
                  onClick={() => goTo(1)}
                  disabled={!hasNext}
                  type="button"
                  aria-label="Próximo produto"
                >
                  <img src={arrowRight} alt="" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ProductModal;
