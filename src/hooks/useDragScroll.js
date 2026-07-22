import { useRef, useState, useEffect } from "react";

const AUTO_SCROLL_SPEED = 60; // pixels por segundo — ajuste pra mais rápido/devagar

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

  // Posiciona o scroll no bloco do meio ao montar
  useEffect(() => {
    const el = ref.current;
    if (!el || !itemCount) return;
    const blockWidth = el.scrollWidth / 3;
    el.scrollLeft = blockWidth;
  }, [itemCount]);

  const checkLoop = () => {
    const el = ref.current;
    if (!el || isLocked.current) return;

    const blockWidth = el.scrollWidth / 3;
    const cardWidth = blockWidth / itemCount;
    const threshold = cardWidth * 3;

    if (el.scrollLeft > blockWidth * 2 - threshold) {
      el.scrollLeft -= blockWidth;
    }
    if (el.scrollLeft < blockWidth + threshold) {
      el.scrollLeft += blockWidth;
    }
  };

  const markInteraction = () => {
    isInteracting.current = true;
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      isInteracting.current = false;
    }, 50);
  };

  // Loop de auto-scroll via requestAnimationFrame
  useEffect(() => {
    const el = ref.current;
    if (!el || !itemCount) return;

    const step = (timestamp) => {
      if (lastTimestamp.current === null) lastTimestamp.current = timestamp;
      const delta = (timestamp - lastTimestamp.current) / 1000;
      lastTimestamp.current = timestamp;

      if (!isLocked.current && !isInteracting.current) {
        el.scrollLeft += AUTO_SCROLL_SPEED * delta;
        checkLoop();
      }

      rafId.current = requestAnimationFrame(step);
    };

    rafId.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId.current);
  }, [itemCount]);

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
  }, [isDragging]);

  const onMouseDown = (e) => {
    if (isLocked.current) return;
    setIsDragging(true);
    hasDragged.current = false;
    markInteraction();
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
  };

  const setLocked = (value) => {
    isLocked.current = value;
  };

  return { ref, onMouseDown, hasDragged, setLocked };
}
