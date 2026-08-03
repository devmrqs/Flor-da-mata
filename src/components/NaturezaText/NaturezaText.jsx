// Libraries
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// CSS
import styles from "./NaturezaText.module.css";

// Paleta clara/âncora/escura de cada cor (dá profundidade ao gradiente)
const GREEN_PALETTE = ["#8C9B5A", "#5D673C", "#343A22"];
const BROWN_PALETTE = ["#D09C77", "#B5713F", "#794B2A"];
const STOP_OFFSETS = ["0%", "50%", "100%"];

const NaturezaText = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const stopRefs = useRef([]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      // blend: 0 = fase verde, 1 = fase marrom
      const state = { blend: 0, mouseBlend: 0 };

      function applyColors() {
        const t = gsap.utils.clamp(0, 1, state.blend + state.mouseBlend);
        stopRefs.current.forEach((stop, index) => {
          if (!stop) return;
          stop.setAttribute(
            "stop-color",
            gsap.utils.interpolate(
              GREEN_PALETTE[index],
              BROWN_PALETTE[index],
              t,
            ),
          );
        });
      }

      gsap.ticker.add(applyColors);

      gsap.to(state, {
        blend: 1,
        duration: 14,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      gsap.to(textRef.current, {
        opacity: 0.93,
        duration: 5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      const setMouseBlend = gsap.quickTo(state, "mouseBlend", {
        duration: 0.7,
        ease: "power3.out",
      });

      function handlePointerMove(event) {
        const rect = containerRef.current.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width - 0.5;
        setMouseBlend(relX * 0.6);
      }

      function handlePointerLeave() {
        setMouseBlend(0);
      }

      const node = containerRef.current;
      node.addEventListener("pointermove", handlePointerMove);
      node.addEventListener("pointerleave", handlePointerLeave);

      return () => {
        gsap.ticker.remove(applyColors);
        node.removeEventListener("pointermove", handlePointerMove);
        node.removeEventListener("pointerleave", handlePointerLeave);
      };
    },
    { scope: containerRef },
  );

  return (
    <div className={styles.container} ref={containerRef}>
      <svg
        viewBox="0 0 1200 230"
        className={styles.naturezaSvg}
        role="img"
        aria-label="Natureza"
      >
        <defs>
          <linearGradient id="naturezaGradient" x1="0" y1="0" x2="1" y2="0.25">
            {STOP_OFFSETS.map((offset, index) => (
              <stop
                key={offset}
                ref={(el) => (stopRefs.current[index] = el)}
                offset={offset}
                stopColor={GREEN_PALETTE[index]}
              />
            ))}
          </linearGradient>

          {/* Grão fotográfico: turbulência recortada pela silhueta das letras */}
          <filter
            id="naturezaGrain"
            x="-10%"
            y="-20%"
            width="120%"
            height="140%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="2"
              seed="6"
              stitchTiles="stitch"
              result="noise"
            />
            <feComponentTransfer in="noise" result="noiseContrast">
              <feFuncA type="linear" slope="2.4" intercept="-0.55" />
            </feComponentTransfer>
            <feComposite in="noiseContrast" in2="SourceAlpha" operator="in" />
          </filter>
        </defs>

        <text
          ref={textRef}
          x="600"
          y="115"
          textAnchor="middle"
          dominantBaseline="central"
          fill="url(#naturezaGradient)"
          className={styles.naturezaText}
        >
          NATUREZA
        </text>

        {/* só carrega o filtro de grão, recortado nas próprias letras */}
        <text
          x="600"
          y="115"
          textAnchor="middle"
          dominantBaseline="central"
          filter="url(#naturezaGrain)"
          className={`${styles.naturezaText} ${styles.naturezaGrainLayer}`}
          aria-hidden="true"
        >
          NATUREZA
        </text>
      </svg>
    </div>
  );
};

export default NaturezaText;
