/* eslint-disable react-hooks/exhaustive-deps */
// Libraries
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// Components
import ProductsList from "../ProductsList/ProductsList.jsx";

// Utils
import { lockScroll, unlockScroll } from "../../utils/scrollLock.js";

// CSS
import styles from "./CategorySheet.module.css";

// abaixo de 48rem o card não tem para onde expandir de lado, então a
// categoria abre aqui em tela cheia
const CategorySheet = ({ category, categoryImage, onClose }) => {
  const overlayRef = useRef(null);
  const sheetRef = useRef(null);
  const isClosingRef = useRef(false);

  useGSAP(
    () => {
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(sheetRef.current, { yPercent: 100 });

      gsap
        .timeline()
        .to(overlayRef.current, {
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
        })
        .to(
          sheetRef.current,
          { yPercent: 0, duration: 0.45, ease: "power3.out" },
          "-=0.15",
        );
    },
    { scope: overlayRef },
  );

  function handleClose() {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    gsap
      .timeline({ onComplete: onClose })
      .to(sheetRef.current, {
        yPercent: 100,
        duration: 0.35,
        ease: "power3.in",
      })
      .to(
        overlayRef.current,
        { opacity: 0, duration: 0.2, ease: "power2.in" },
        "-=0.2",
      );
  }

  useEffect(() => {
    function handleEscKey(event) {
      if (event.key === "Escape") handleClose();
    }

    document.addEventListener("keydown", handleEscKey);
    lockScroll();

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      unlockScroll();
    };
  }, []);

  return createPortal(
    <div className={styles.overlay} onClick={handleClose} ref={overlayRef}>
      <div
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()}
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Produtos da categoria ${category.title}`}
      >
        <button
          className={styles.closeButton}
          onClick={handleClose}
          type="button"
          aria-label="Fechar categoria"
        >
          ×
        </button>

        <ProductsList
          category={category}
          categoryImage={categoryImage}
          variant="sheet"
          onNavigateAway={onClose}
        />
      </div>
    </div>,
    document.body,
  );
};

export default CategorySheet;
