import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Hooks
import { useDragScroll } from "../../hooks/useDragScroll.js";

// Data
import { categories } from "../../data/categories.js";

// Components
import ProductsList from "../ProductsList/ProductsList.jsx";

// Assets
import arrow from "../../assets/images/cards-products/arrowProducts.svg";
import chas from "../../assets/images/cards-products/chaservas.png";
import graos from "../../assets/images/cards-products/graos.png";
import naturais from "../../assets/images/cards-products/naturais.png";
import sementes from "../../assets/images/cards-products/sementes.png";
import farinhas from "../../assets/images/cards-products/farinhas.png";
import soja from "../../assets/images/cards-products/soja.png";
import elixis from "../../assets/images/cards-products/elixis.png";
import capsulas from "../../assets/images/cards-products/capsulas.png";
import beleza from "../../assets/images/cards-products/beleza.png";
import snacks from "../../assets/images/cards-products/snacks.png";

// CSS
import styles from "./CategoryCarousel.module.css";

gsap.registerPlugin(ScrollTrigger);

// Constantes da animação de expandir/recolher o card — ajusta aqui pra mudar o "feel"
const EXPANDED_WIDTH = 980;
const BASE_WIDTH = 350;
const EASE_EXPAND = "power4.inOut";
const EASE_COLLAPSE = "power3.inOut";

const categoryImages = {
  1: chas,
  2: graos,
  3: naturais,
  4: sementes,
  5: farinhas,
  6: soja,
  7: elixis,
  8: capsulas,
  9: beleza,
  10: snacks,
};

const CategoryCarousel = () => {
  // expandedKey: qual card está "aberto" (controla interação/estilo do botão)
  // mountedKey: qual card ainda precisa do ProductsList no DOM — fica um passo
  // atrás do expandedKey ao fechar, pra dar tempo da animação de saída rodar
  const [expandedKey, setExpandedKey] = useState(null);
  const [mountedKey, setMountedKey] = useState(null);
  const containerRef = useRef(null);
  const wrapperRefs = useRef(new Map());
  const panelRefs = useRef(new Map());
  const { ref, onMouseDown, hasDragged, setLocked } = useDragScroll(
    categories.length,
  );

  const loopedCategories = [...categories, ...categories, ...categories];

  useGSAP(
    () => {
      gsap.from(`.${styles.cardWrapper}`, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform",
      });
    },
    { scope: containerRef },
  );

  function registerWrapperRef(key) {
    return (el) => {
      if (el) wrapperRefs.current.set(key, el);
      else wrapperRefs.current.delete(key);
    };
  }

  function registerPanelRef(key) {
    return (el) => {
      if (el) panelRefs.current.set(key, el);
      else panelRefs.current.delete(key);
    };
  }

  function openCard(key) {
    setLocked(true);
    setExpandedKey(key);
    setMountedKey(key);

    // o painel só existe no DOM depois desse render — espera o próximo frame
    requestAnimationFrame(() => {
      const wrapper = wrapperRefs.current.get(key);
      const panel = panelRefs.current.get(key);
      if (!wrapper) return;

      gsap.killTweensOf([wrapper, panel].filter(Boolean));
      if (panel) gsap.set(panel, { opacity: 0, x: 20 });

      const tl = gsap.timeline();
      tl.to(wrapper, {
        width: EXPANDED_WIDTH,
        duration: 0.6,
        ease: EASE_EXPAND,
      });
      if (panel) {
        tl.to(
          panel,
          { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
          "-=0.25",
        );
      }
    });
  }

  function closeCard(key, onComplete) {
    const wrapper = wrapperRefs.current.get(key);
    const panel = panelRefs.current.get(key);

    if (!wrapper) {
      setMountedKey((current) => (current === key ? null : current));
      onComplete?.();
      return;
    }

    gsap.killTweensOf([wrapper, panel].filter(Boolean));

    const tl = gsap.timeline({
      onComplete: () => {
        setMountedKey((current) => (current === key ? null : current));
        onComplete?.();
      },
    });

    if (panel) {
      tl.to(panel, { opacity: 0, x: 20, duration: 0.25, ease: "power2.in" });
    }
    tl.to(
      wrapper,
      {
        width: BASE_WIDTH,
        duration: 0.5,
        ease: EASE_COLLAPSE,
        clearProps: "width",
      },
      panel ? "-=0.05" : 0,
    );
  }

  function handleSelectCategory(key) {
    if (expandedKey === key) {
      setExpandedKey(null);
      closeCard(key, () => setLocked(false));
      return;
    }

    const previousKey = expandedKey;
    setExpandedKey(key);

    if (previousKey) {
      closeCard(previousKey, () => openCard(key));
    } else {
      openCard(key);
    }
  }

  return (
    <div className={styles.carouselContainer} ref={containerRef}>
      <div className={styles.track} ref={ref} onMouseDown={onMouseDown}>
        {loopedCategories.map((category, index) => {
          const key = `${category.id}-${index}`;
          const isActive = expandedKey === key; // agora só UM card bate essa condição
          const isMounted = mountedKey === key;

          return (
            <div
              key={key}
              className={styles.cardWrapper}
              ref={registerWrapperRef(key)}
            >
              <button
                className={`${styles.card} ${
                  isActive ? styles.activeCard : ""
                }`}
                onClick={() => {
                  if (hasDragged.current) return;
                  handleSelectCategory(key);
                }}
                type="button"
              >
                <img
                  src={categoryImages[category.id]}
                  alt={category.title}
                  className={styles.cardImage}
                />
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h4>{category.title}</h4>
                    <img src={arrow} alt="" className={styles.arrowCard} />
                  </div>
                  <p>{category.description}</p>
                </div>
              </button>

              {isMounted && (
                <ProductsList
                  category={category}
                  categoryImage={categoryImages[category.id]}
                  variant="insideCard"
                  panelRef={registerPanelRef(key)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryCarousel;
