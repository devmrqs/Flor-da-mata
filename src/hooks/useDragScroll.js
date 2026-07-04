import { useRef, useState, useEffect } from "react";

export function useDragScroll() {
  const ref = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasDragged = useRef(false);

  // Scroll via wheel (mantido igual)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Drag via mouse — listeners no window, só enquanto isDragging === true
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      hasDragged.current = true;
      const x = e.pageX - ref.current.offsetLeft;
      const walk = x - startX.current;
      ref.current.scrollLeft = scrollLeft.current - walk;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

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

  return {
    ref,
    onMouseDown,
    hasDragged,
  };
}
