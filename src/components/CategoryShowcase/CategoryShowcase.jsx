// Libraries
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Data
import { categories } from "../../data/categories.js";

// Utils
import { getCategoryImage } from "../../utils/categoryImages.js";

// Components
import ProductsList from "../ProductsList/ProductsList.jsx";

// CSS
import styles from "./CategoryShowcase.module.css";

gsap.registerPlugin(ScrollTrigger);

const AUTO_ADVANCE_MS = 3000; // intervalo entre categorias
const RESUME_AFTER_MS = 3000; // silêncio antes de o automático voltar
const IDLE_MS = 150; // scroll parado por este tempo = movimento terminou
const GLIDE_DURATION = 1.1; // duração do deslize entre um card e o próximo
const GLIDE_EASE = "power2.inOut";

/**
 * Vitrine de categorias para telas pequenas: uma imagem por vez, avançando
 * sozinha e em laço infinito. O movimento é scroll-snap nativo — o auto-avanço
 * só empurra a faixa, e o dedo continua no comando quando o usuário toca.
 * O CategoryCarousel segue servindo o desktop.
 */
const CategoryShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openCategory, setOpenCategory] = useState(null);
  const trackRef = useRef(null);
  const slideRefs = useRef([]);
  const panelRef = useRef(null);
  const isAnimating = useRef(false);
  const openRef = useRef(null);
  const isPaused = useRef(false);
  const isVisible = useRef(false);
  const resumeTimer = useRef(null);
  const idleTimer = useRef(null);
  const glideTween = useRef(null);

  // três cópias: o salto de um bloco inteiro é invisível porque são idênticas
  const loopedCategories = [...categories, ...categories, ...categories];

  // identidade estável: são usadas em deps de efeito e só tocam refs
  const getMetrics = useCallback(() => {
    const track = trackRef.current;
    const slides = slideRefs.current.filter(Boolean);
    if (!track || slides.length <= categories.length) return null;

    // slides são centralizados pelo snap, então a posição de repouso do
    // primeiro não é zero
    const base =
      slides[0].offsetLeft - (track.clientWidth - slides[0].offsetWidth) / 2;

    return {
      track,
      base,
      block: slides[categories.length].offsetLeft - slides[0].offsetLeft,
      pitch: slides[1].offsetLeft - slides[0].offsetLeft,
    };
  }, []);

  // Mantém o scroll dentro da cópia do meio. Só roda com a faixa parada: durante
  // o movimento, escrever scrollLeft brigaria com a animação de snap.
  const normalize = useCallback(() => {
    const m = getMetrics();
    if (!m || !m.block) return;

    const rel = m.track.scrollLeft - m.base;
    if (rel >= m.block * 2) m.track.scrollLeft -= m.block;
    else if (rel < m.block) m.track.scrollLeft += m.block;
  }, [getMetrics]);

  const pauseAuto = useCallback(() => {
    isPaused.current = true;

    // o dedo tem prioridade sobre o deslize automático
    if (glideTween.current) {
      glideTween.current.kill();
      glideTween.current = null;
      if (trackRef.current) trackRef.current.style.scrollSnapType = "";
    }

    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      if (!openRef.current) isPaused.current = false;
    }, RESUME_AFTER_MS);
  }, []);

  // posiciona no bloco do meio ao montar
  useEffect(() => {
    const m = getMetrics();
    if (m) m.track.scrollLeft = m.base + m.block;
  }, [getMetrics]);

  // O índice ativo vem de quem está visível, não de conta de gesto: assim o
  // scroll nativo continua dono do movimento.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const index = Number(entry.target.dataset.index);
          setActiveIndex(index);

          // deslizar para outra categoria fecha a lista: deslizar é explorar,
          // tocar é aprofundar
          const open = openRef.current;
          if (open && open.id !== categories[index]?.id) {
            openRef.current = null;
            setOpenCategory(null);
            ScrollTrigger.refresh();
          }
        });
      },
      { root: track, threshold: 0.6 },
    );

    slideRefs.current.filter(Boolean).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Reposiciona o laço quando a faixa para, e pausa o automático enquanto o
  // usuário estiver mexendo.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function handleScroll() {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(normalize, IDLE_MS);
    }

    track.addEventListener("scroll", handleScroll, { passive: true });
    track.addEventListener("touchstart", pauseAuto, { passive: true });
    track.addEventListener("touchmove", pauseAuto, { passive: true });

    return () => {
      track.removeEventListener("scroll", handleScroll);
      track.removeEventListener("touchstart", pauseAuto);
      track.removeEventListener("touchmove", pauseAuto);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, [normalize, pauseAuto]);

  // fora da tela o auto-avanço é custo puro — mesma lição do carrossel antigo
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
      },
      { threshold: 0.35 },
    );

    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    const id = setInterval(() => {
      if (isPaused.current || !isVisible.current || openRef.current) return;
      if (glideTween.current) return;

      const m = getMetrics();
      if (!m) return;

      // O behavior "smooth" do navegador tem curva fixa e seca. Um tween dá
      // controle do easing — mas com scroll-snap mandatory ligado o navegador
      // tentaria reencaixar a cada frame, então o snap sai de cena durante o
      // deslize e volta no fim, onde a posição já é exatamente um ponto de snap.
      m.track.style.scrollSnapType = "none";

      glideTween.current = gsap.to(m.track, {
        scrollLeft: m.track.scrollLeft + m.pitch,
        duration: GLIDE_DURATION,
        ease: GLIDE_EASE,
        onComplete: () => {
          m.track.style.scrollSnapType = "";
          glideTween.current = null;
        },
      });
    }, AUTO_ADVANCE_MS);

    return () => {
      clearInterval(id);
      glideTween.current?.kill();
    };
  }, [getMetrics]);

  function openPanel(category) {
    openRef.current = category;
    isPaused.current = true;
    setOpenCategory(category);

    // o painel só existe no DOM depois deste render
    requestAnimationFrame(() => {
      if (!panelRef.current) return;
      isAnimating.current = true;

      gsap.from(panelRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.45,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(panelRef.current, { clearProps: "height,opacity" });
          isAnimating.current = false;
          // a sanfona empurra tudo abaixo dela: sem isso o pin do About e os
          // gatilhos da Timeline ficam com as posições antigas
          ScrollTrigger.refresh();
          panelRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        },
      });
    });
  }

  function closePanel() {
    openRef.current = null;
    pauseAuto();

    if (!panelRef.current || isAnimating.current) {
      setOpenCategory(null);
      return;
    }

    isAnimating.current = true;
    gsap.to(panelRef.current, {
      height: 0,
      opacity: 0,
      duration: 0.35,
      ease: "power3.inOut",
      onComplete: () => {
        isAnimating.current = false;
        setOpenCategory(null);
        ScrollTrigger.refresh();
      },
    });
  }

  function handleSlideClick(category) {
    if (openCategory?.id === category.id) closePanel();
    else openPanel(category);
  }

  return (
    <div className={styles.showcase}>
      <div className={styles.track} ref={trackRef}>
        {loopedCategories.map((category, index) => {
          const categoryIndex = index % categories.length;
          const isOpen = openCategory?.id === category.id;
          const total = category.products?.length ?? 0;

          return (
            <button
              key={`${category.id}-${index}`}
              type="button"
              data-index={categoryIndex}
              ref={(el) => (slideRefs.current[index] = el)}
              className={`${styles.slide} ${isOpen ? styles.slideOpen : ""}`}
              onClick={() => handleSlideClick(category)}
              aria-expanded={isOpen}
            >
              <img
                src={getCategoryImage(category.slug)}
                alt={category.title}
                className={styles.slideImage}
                loading="lazy"
                decoding="async"
              />

              <div className={styles.slideContent}>
                <span className={styles.slideCount}>
                  {total > 0 ? `${total} produtos` : "Em breve"}
                </span>
                <h4>{category.title}</h4>
                <p>{category.description}</p>
                <span className={styles.slideAction}>
                  {isOpen ? "Fechar" : "Ver produtos"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* a ativa vira pílula em vez de bolinha: com 10 categorias, dez pontos
          iguais viram textura e param de indicar posição */}
      <div className={styles.dots} role="presentation">
        {categories.map((category, index) => (
          <span
            key={category.id}
            className={`${styles.dot} ${
              index === activeIndex ? styles.dotActive : ""
            }`}
          />
        ))}
      </div>

      {openCategory && (
        <div className={styles.panel} ref={panelRef}>
          <button
            type="button"
            className={styles.panelClose}
            onClick={closePanel}
            aria-label={`Fechar produtos de ${openCategory.title}`}
          >
            ×
          </button>

          <ProductsList
            category={openCategory}
            categoryImage={getCategoryImage(openCategory.slug)}
            variant="expanded"
          />
        </div>
      )}
    </div>
  );
};

export default CategoryShowcase;
