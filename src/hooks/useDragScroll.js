import { useRef, useState, useEffect, useCallback } from "react";

const AUTO_SCROLL_SPEED = 60; // pixels por segundo — ajuste pra mais rápido/devagar
const RESUME_DELAY = 60; // ms parado antes do auto-scroll voltar (mouse)
const RESUME_DELAY_TOUCH = 900; // toque tem inércia: espera mais pra não brigar com o dedo
const MAX_DELTA = 0.05; // trava o passo se a aba ficou em segundo plano

export function useDragScroll(itemCount) {
  const ref = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasDragged = useRef(false);

  const isLocked = useRef(false);
  const isInteracting = useRef(false);
  const resumeTimeout = useRef(null);
  const rafId = useRef(null);
  const lastTimestamp = useRef(null);

  // Largura de um bloco = distância entre o 1º card de uma cópia e o da cópia
  // seguinte. Medir no DOM (em vez de scrollWidth / 3) conta o gap certo:
  // scrollWidth tem 29 gaps para 30 cards, então dividir por 3 erra por 1/3 de
  // gap a cada volta, e o erro aparece como um tranco.
  const getBlockWidth = useCallback(() => {
    const el = ref.current;
    if (!el || !itemCount) return 0;
    const first = el.children[0];
    const nextCopy = el.children[itemCount];
    if (!first || !nextCopy) return el.scrollWidth / 3;
    return nextCopy.offsetLeft - first.offsetLeft;
  }, [itemCount]);

  // Posiciona o scroll no bloco do meio ao montar
  useEffect(() => {
    const el = ref.current;
    if (!el || !itemCount) return;
    el.scrollLeft = getBlockWidth();
  }, [getBlockWidth, itemCount]);

  // São 3 cópias idênticas, então pular exatamente um bloco é imperceptível:
  // basta manter o scroll dentro da cópia do meio. A versão anterior usava
  // faixas de tolerância que se sobrepunham — as duas condições disparavam no
  // mesmo frame e cancelavam o avanço do auto-scroll, travando o carrossel.
  const checkLoop = useCallback(() => {
    const el = ref.current;
    if (!el || isLocked.current) return;

    const blockWidth = getBlockWidth();
    if (!blockWidth) return;

    if (el.scrollLeft >= blockWidth * 2) el.scrollLeft -= blockWidth;
    else if (el.scrollLeft < blockWidth) el.scrollLeft += blockWidth;
  }, [getBlockWidth]);

  const markInteraction = (delay = RESUME_DELAY) => {
    isInteracting.current = true;
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      isInteracting.current = false;
    }, delay);
  };

  // Loop de auto-scroll via requestAnimationFrame
  useEffect(() => {
    const el = ref.current;
    if (!el || !itemCount) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const step = (timestamp) => {
      if (lastTimestamp.current === null) lastTimestamp.current = timestamp;
      const delta = Math.min(
        (timestamp - lastTimestamp.current) / 1000,
        MAX_DELTA,
      );
      lastTimestamp.current = timestamp;

      if (!isLocked.current) {
        if (!isInteracting.current && !reducedMotion) {
          el.scrollLeft += AUTO_SCROLL_SPEED * delta;
        }
        // roda mesmo durante a interação: senão o usuário arrasta até o fim da
        // terceira cópia e o carrossel "acaba"
        checkLoop();
      }

      rafId.current = requestAnimationFrame(step);
    };

    rafId.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(rafId.current);
      lastTimestamp.current = null;
    };
  }, [checkLoop, itemCount]);

  // Bloqueia o wheel — o carousel só se move via auto-scroll ou drag
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const blockWheel = (e) => {
      e.preventDefault();
    };

    el.addEventListener("wheel", blockWheel, { passive: false });
    return () => el.removeEventListener("wheel", blockWheel);
  }, []);

  // Toque: o scroll nativo da faixa já funciona sozinho, mas o auto-scroll
  // precisa sair da frente enquanto o dedo (e a inércia) estão no comando.
  // mousedown não dispara em toque, então o drag abaixo não cobre esse caso.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const pause = () => markInteraction(RESUME_DELAY_TOUCH);

    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchmove", pause, { passive: true });
    el.addEventListener("touchend", pause, { passive: true });

    return () => {
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchmove", pause);
      el.removeEventListener("touchend", pause);
    };
  }, []);

  // Drag via mouse
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      if (isLocked.current) return;
      hasDragged.current = true;
      markInteraction();
      const x = e.pageX - ref.current.offsetLeft;
      const walk = x - startX.current;
      ref.current.scrollLeft = scrollLeft.current - walk;
      checkLoop();
    };

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [checkLoop, isDragging]);

  const onMouseDown = (e) => {
    if (isLocked.current) return;
    setIsDragging(true);
    hasDragged.current = false;
    markInteraction();
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
  };

  // useCallback mantém a identidade estável para quem usa em deps de efeito
  const setLocked = useCallback((value) => {
    isLocked.current = value;
  }, []);

  return { ref, onMouseDown, hasDragged, setLocked };
}
