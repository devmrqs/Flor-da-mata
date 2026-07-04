import { useRef, useState, useEffect } from "react";

export function useDragScroll(itemCount) {
  const ref = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasDragged = useRef(false);

  // Posiciona o scroll no bloco do meio assim que o carousel monta
  useEffect(() => {
    const el = ref.current;
    if (!el || !itemCount) return;

    // largura de um "bloco" (a lista original, sem duplicação)
    const blockWidth = el.scrollWidth / 3;
    el.scrollLeft = blockWidth; // começa no início do bloco do meio
  }, [itemCount]);

  // Função que checa se chegou perto demais de uma ponta, e reposiciona
  const checkLoop = () => {
    const el = ref.current;
    if (!el) return;

    const blockWidth = el.scrollWidth / 3;
    const cardWidth = blockWidth / itemCount; // largura média de um card
    const threshold = cardWidth * 3; // "últimos/primeiros 3 cards"

    // Chegou perto do fim (bloco 3) -> volta pro bloco do meio
    if (el.scrollLeft > blockWidth * 2 - threshold) {
      el.scrollLeft -= blockWidth;
    }

    // Chegou perto do início (bloco 1) -> avança pro bloco do meio
    if (el.scrollLeft < blockWidth + threshold) {
      el.scrollLeft += blockWidth;
    }
  };

  // Scroll via wheel
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
      checkLoop();
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [itemCount]);

  // Drag via mouse
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      hasDragged.current = true;
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
    setIsDragging(true);
    hasDragged.current = false;
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeft.current = ref.current.scrollLeft;
  };

  return { ref, onMouseDown, hasDragged };
}
