import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Hooks
import { useDragScroll } from "../../hooks/useDragScroll.js";

// Data
import { categories } from "../../data/categories.js";

// Utils
import { getCategoryImage } from "../../utils/categoryImages.js";

// Components
import ProductsList from "../ProductsList/ProductsList.jsx";
import CategorySheet from "../CategorySheet/CategorySheet.jsx";

// Assets
import arrow from "../../assets/images/cards-products/arrowProducts.svg";

// CSS
import styles from "./CategoryCarousel.module.css";

gsap.registerPlugin(ScrollTrigger);

// Constantes da animação de expandir/recolher o card — ajusta aqui pra mudar o "feel"
const EASE_EXPAND = "power4.inOut";
const EASE_COLLAPSE = "power3.inOut";
// espelha o --panel-overlap do CSS (margin-left negativo do painel)
const PANEL_OVERLAP = 30;

// as larguras vêm do CSS (--card-w / --panel-w, fluidas): medir, não repetir
function getCardWidth(wrapper) {
  return wrapper.firstElementChild?.offsetWidth ?? 0;
}

function getExpandedWidth(wrapper, panel) {
  return getCardWidth(wrapper) + (panel?.offsetWidth ?? 0) - PANEL_OVERLAP;
}

// Abaixo disso não há largura para expandir o card de lado — abre a folha
const COMPACT_QUERY = "(max-width: 47.99rem)";

const CategoryCarousel = () => {
  const [expandedKey, setExpandedKey] = useState(null);
  const [mountedKey, setMountedKey] = useState(null);
  const [sheetCategory, setSheetCategory] = useState(null);
  const [isCompact, setIsCompact] = useState(
    () => window.matchMedia(COMPACT_QUERY).matches,
  );
  const containerRef = useRef(null);
  const wrapperRefs = useRef(new Map());
  const panelRefs = useRef(new Map());
  const { ref, onMouseDown, hasDragged, setLocked } = useDragScroll(
    categories.length,
  );

  const loopedCategories = [...categories, ...categories, ...categories];

  // ao cruzar o limite, fecha o que estiver aberto dos dois lados
  useEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY);

    function handleChange(event) {
      setIsCompact(event.matches);
      setSheetCategory(null);
      setExpandedKey(null);
      setMountedKey(null);
      setLocked(false);

      // devolve ao CSS a largura que o GSAP gravou inline, sem animar
      wrapperRefs.current.forEach((wrapper) => {
        gsap.killTweensOf(wrapper);
        gsap.set(wrapper, { clearProps: "width" });
      });
    }

    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, [setLocked]);

  useGSAP(
    () => {
      gsap.from(`.${styles.cardWrapper}[data-loop-copy="1"]`, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 40,
        duration: 0.4,
        stagger: 0.06,
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
        width: getExpandedWidth(wrapper, panel),
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
        width: getCardWidth(wrapper),
        duration: 0.5,
        ease: EASE_COLLAPSE,
        clearProps: "width",
      },
      panel ? "-=0.05" : 0,
    );
  }

  function handleSelectCategory(key, category) {
    if (isCompact) {
      setSheetCategory(category);
      return;
    }

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
          const isActive = expandedKey === key;
          const isMounted = mountedKey === key;

          return (
            <div
              key={key}
              className={styles.cardWrapper}
              data-loop-copy={Math.floor(index / categories.length)}
              ref={registerWrapperRef(key)}
            >
              <button
                className={`${styles.card} ${
                  isActive ? styles.activeCard : ""
                }`}
                onClick={() => {
                  if (hasDragged.current) return;
                  handleSelectCategory(key, category);
                }}
                type="button"
              >
                <img
                  src={getCategoryImage(category.slug)}
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

              {isMounted && !isCompact && (
                <ProductsList
                  category={category}
                  categoryImage={getCategoryImage(category.slug)}
                  variant="insideCard"
                  panelRef={registerPanelRef(key)}
                />
              )}
            </div>
          );
        })}
      </div>

      {sheetCategory && (
        <CategorySheet
          category={sheetCategory}
          categoryImage={getCategoryImage(sheetCategory.slug)}
          onClose={() => setSheetCategory(null)}
        />
      )}
    </div>
  );
};

export default CategoryCarousel;
