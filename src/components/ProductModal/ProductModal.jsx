/* eslint-disable react-hooks/exhaustive-deps */
// Libraries
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// Hooks
import { useSvgTransition } from "../SVG/useSvgTransition.js";

// Components
import Button from "../Button/Button.jsx";

// Data
import { getProductImages } from "../../utils/productImages.js";
import { lockScroll, unlockScroll } from "../../utils/scrollLock.js";

// Assets
import arrowLeft from "../../assets/images/arrowLeft.svg";
import arrowRight from "../../assets/images/arrowRight.svg";

// CSS
import styles from "./ProductModal.module.css";

const WEIGHT_ACTIVE_TEXT = "#fffefa";
const WEIGHT_INACTIVE_TEXT = "#333725";

const ProductModal = ({
  products,
  initialIndex,
  categorySlug,
  categoryTitle,
  onClose,
  // fecha também o que abriu este modal (a folha de categoria, no celular)
  onNavigateAway,
}) => {
  const isOpen = initialIndex !== null && initialIndex !== undefined;
  const { transitionTo } = useSvgTransition();

  // Índice, não o produto/slug: slug não é garantido único
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentProduct = products?.[currentIndex];

  const [activeImage, setActiveImage] = useState(0);

  // Começa com null para não forçar seleção inicial e evitar bug visual
  const [selectedWeight, setSelectedWeight] = useState(null);

  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const isClosingRef = useRef(false);
  const isNavigatingRef = useRef(false);

  // Duas camadas empilhadas pro crossfade — nunca desmontam, só trocam de src
  const imageSlotsRef = useRef([null, null]);
  const visibleSlotRef = useRef(0);
  const currentSrcRef = useRef(null);
  const productKeyRef = useRef(null);

  // Preenchimento das gramagens: mapas por weight, não por índice, porque
  // os botões trocam de peso disponível a cada produto
  const weightFillRefs = useRef({});
  const weightLabelRefs = useRef({});
  const clickOriginRef = useRef({});
  const activeWeightRef = useRef(null);
  const weightsProductKeyRef = useRef(null);

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

  const images = getProductImages(
    categorySlug,
    currentProduct?.slug,
    selectedWeight,
  );

  // Crossfade entre as duas camadas sempre que a imagem-alvo muda (troca de
  // gramagem, clique numa thumb, ou navegação pra outro produto). Na primeira
  // imagem de cada produto, a troca é instantânea — quem anima a entrada
  // ali é o modal como um todo, não faz sentido também animar a foto.
  useGSAP(
    () => {
      const targetSrc = images[activeImage];
      if (!targetSrc) return;

      const isNewProduct = productKeyRef.current !== currentIndex;
      productKeyRef.current = currentIndex;

      if (targetSrc === currentSrcRef.current && !isNewProduct) return;

      const visible = visibleSlotRef.current;
      const hidden = visible === 0 ? 1 : 0;
      const hiddenEl = imageSlotsRef.current[hidden];
      const visibleEl = imageSlotsRef.current[visible];
      if (!hiddenEl || !visibleEl) return;

      // Cancela qualquer fade pendente das duas camadas antes de começar um
      // novo — sem isso, cliques rápidos entre fotos podem deixar um
      // onComplete antigo esvaziar o src da imagem errada.
      gsap.killTweensOf([hiddenEl, visibleEl]);

      function showImage(instant) {
        hiddenEl.src = targetSrc;

        if (instant) {
          gsap.set(hiddenEl, { opacity: 1, scale: 1, zIndex: 2 });
          gsap.set(visibleEl, { opacity: 0, zIndex: 1 });
        } else {
          gsap.set(hiddenEl, { opacity: 0, scale: 1.04, zIndex: 2 });
          gsap.set(visibleEl, { zIndex: 1 });
          gsap.to(hiddenEl, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
          });
          gsap.to(visibleEl, {
            opacity: 0,
            duration: 0.45,
            ease: "power2.in",
            onComplete: () => {
              // libera a decodificação da imagem que saiu de cena
              visibleEl.src = "";
            },
          });
        }

        visibleSlotRef.current = hidden;
        currentSrcRef.current = targetSrc;
      }

      // pré-carrega antes de animar — evita flash de imagem quebrada/em branco
      const preload = new Image();
      preload.src = targetSrc;
      if (preload.complete) {
        showImage(isNewProduct);
      } else {
        preload.onload = () => showImage(isNewProduct);
      }
    },
    { dependencies: [images[activeImage], currentIndex], scope: modalRef },
  );

  // Preenchimento circular da gramagem ativa
  useGSAP(
    () => {
      // 1. Se mudou de produto, reseta tudo IMEDIATAMENTE antes de checar selectedWeight
      if (weightsProductKeyRef.current !== currentIndex) {
        weightsProductKeyRef.current = currentIndex;
        activeWeightRef.current = null; // Zera a memória do peso anterior

        // Limpa visualmente todos os botões que ficaram pendentes
        Object.values(weightFillRefs.current).forEach((el) => {
          if (el) gsap.set(el, { clipPath: "circle(0px at 50% 50%)" });
        });
        Object.values(weightLabelRefs.current).forEach((el) => {
          if (el) gsap.set(el, { color: WEIGHT_INACTIVE_TEXT });
        });
      }

      // 2. Se nada estiver selecionado (ex: modal abriu agora), apenas aguarda
      if (!selectedWeight) return;

      const nextFill = weightFillRefs.current[selectedWeight];
      const nextLabel = weightLabelRefs.current[selectedWeight];
      if (!nextFill || !nextLabel) return;

      const prevWeight = activeWeightRef.current;
      if (prevWeight === selectedWeight) return; // Evita re-animar o que já está ativo
      activeWeightRef.current = selectedWeight;

      const origin = clickOriginRef.current[selectedWeight] ?? {
        x: "50%",
        y: "50%",
        maxRadius: 150, // fallback seguro
      };

      // 3. Anima o NOVO botão selecionado
      gsap.killTweensOf(nextFill);
      gsap.fromTo(
        nextFill,
        { clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` },
        {
          clipPath: `circle(${origin.maxRadius}px at ${origin.x}px ${origin.y}px)`,
          duration: 0.55,
          ease: "power2.out",
        },
      );
      gsap.to(nextLabel, {
        color: WEIGHT_ACTIVE_TEXT,
        duration: 0.3,
        ease: "power1.out",
      });

      // 4. Recolhe o botão ANTERIOR, se houver
      if (prevWeight) {
        const prevFill = weightFillRefs.current[prevWeight];
        const prevLabel = weightLabelRefs.current[prevWeight];
        const prevOrigin = clickOriginRef.current[prevWeight] ?? {
          x: "50%",
          y: "50%",
        };

        if (prevFill) {
          gsap.killTweensOf(prevFill);
          gsap.to(prevFill, {
            clipPath: `circle(0px at ${prevOrigin.x}px ${prevOrigin.y}px)`,
            duration: 0.4,
            ease: "power2.in",
          });
        }
        if (prevLabel) {
          gsap.to(prevLabel, {
            color: WEIGHT_INACTIVE_TEXT,
            duration: 0.2,
            ease: "power1.out",
          });
        }
      }
    },
    { dependencies: [selectedWeight, currentIndex], scope: modalRef },
  );

  function handleWeightClick(event, weight) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // raio precisa alcançar o canto mais distante do ponto clicado,
    // senão a mancha para antes de cobrir o botão todo
    const corners = [
      [0, 0],
      [rect.width, 0],
      [0, rect.height],
      [rect.width, rect.height],
    ];
    const maxRadius = Math.max(
      ...corners.map(([cx, cy]) => Math.hypot(x - cx, y - cy)),
    );

    clickOriginRef.current[weight] = { x, y, maxRadius };
    setSelectedWeight(weight);
  }

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

  // A cortina do SvgTransition fica num z-index abaixo deste modal, então ela
  // desenharia por trás dele. Fecha tudo primeiro, depois transiciona.
  function handleRequestQuote() {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    playExitAnimation(() => {
      onClose();
      onNavigateAway?.();
      transitionTo("/seja-parceiro");
    });
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
        setSelectedWeight(null); // Remove a seleção forçada ao trocar de produto
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
    lockScroll();

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      unlockScroll();
    };
  }, [isOpen, handleClose]);

  if (!isOpen || !currentProduct) return null;

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
            <div className={styles.imageStage}>
              <div className={styles.imageFrame}>
                {images.length > 0 ? (
                  <>
                    <img
                      ref={(el) => (imageSlotsRef.current[0] = el)}
                      alt={currentProduct.name}
                      className={styles.mainImageImg}
                    />
                    <img
                      ref={(el) => (imageSlotsRef.current[1] = el)}
                      alt={currentProduct.name}
                      className={styles.mainImageImg}
                    />
                  </>
                ) : (
                  <span>Imagem do produto</span>
                )}

                {categoryTitle && (
                  <span className={styles.categoryBadge}>{categoryTitle}</span>
                )}
              </div>
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
                        selectedWeight === weight ? styles.weightCardActive : ""
                      }`}
                      onClick={(e) => handleWeightClick(e, weight)}
                    >
                      <span
                        className={styles.weightCardFill}
                        ref={(el) => (weightFillRefs.current[weight] = el)}
                      />
                      <span
                        className={styles.weightCardLabel}
                        ref={(el) => (weightLabelRefs.current[weight] = el)}
                      >
                        {weight}
                      </span>
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
                onClick={handleRequestQuote}
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
