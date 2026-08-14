// Libraries
import { forwardRef, useImperativeHandle, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

// Context
import { SvgTransitionContext } from "./useSvgTransition";

// CSS
import styles from "./SvgTransition.module.css";

gsap.registerPlugin(DrawSVGPlugin);

// Espessura que inunda a tela. Com preserveAspectRatio "slice" numa tela
// estreita, só uma fatia vertical do traçado fica visível — e 490 (87% da
// altura do viewBox) deixava faixas descobertas em cima e embaixo quando o
// traçado passava pelo meio dessa fatia. Baixe se o flood ficar rápido demais.
const COVER_STROKE = 700;
const REST_STROKE = 2;

// expõe playIn(onComplete)/playOut(onComplete) via ref
const SvgTransition = forwardRef((_props, ref) => {
  const pathRef = useRef(null);

  useGSAP(
    () => {
      gsap.set(pathRef.current, { drawSVG: "0%", strokeWidth: REST_STROKE });
    },
    { scope: pathRef },
  );

  useImperativeHandle(ref, () => ({
    // cobre a página atual antes de trocar de rota
    playIn(onComplete) {
      gsap.to(pathRef.current, {
        drawSVG: "100%",
        strokeWidth: COVER_STROKE,
        duration: 1.7,
        ease: "power2.inOut",
        onComplete,
      });
    },
    // roda com a página nova já carregada por baixo
    playOut(onComplete) {
      gsap.to(pathRef.current, {
        drawSVG: "0%",
        strokeWidth: REST_STROKE,
        duration: 1.5,
        ease: "power2.inOut",
        onComplete,
      });
    },
  }));

  return (
    <div className={styles.divSvg}>
      {/* slice em vez do "meet" padrão: o viewBox é panorâmico (1062x563) e,
          numa tela vertical, "meet" encaixaria o desenho na largura deixando
          faixas vazias em cima e embaixo. "slice" cobre e corta o excedente. */}
      <svg
        viewBox="0 0 1062 563"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={pathRef}
          d="M12.6942 561.989C9.19424 404.823 53.6922 65.4893 89.6978 87.9907C190.017 150.685 173.194 757.989 247.694 341.491C322.194 -75.0074 450.691 739.489 464.194 220.989C477.698 -297.511 603.197 696.489 728.694 332.489C854.19 -31.5106 849.794 766.189 938.194 394.989C1026.59 23.7892 1037.53 45.3241 1049.7 3.49072"
          stroke="#4c5535"
          strokeWidth="25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
});

SvgTransition.displayName = "SvgTransition";

// envolve as rotas pra sobreviver à troca de página
export const SvgTransitionProvider = ({ children }) => {
  const navigate = useNavigate();
  const svgRef = useRef(null);
  const isAnimating = useRef(false);
  const pendingRevealRef = useRef(null);

  // página de destino usa isso pra saber se chegou via transição
  const onReveal = useCallback((callback) => {
    pendingRevealRef.current = callback;
    return () => {
      if (pendingRevealRef.current === callback) {
        pendingRevealRef.current = null;
      }
    };
  }, []);

  const transitionTo = useCallback(
    (path) => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      svgRef.current.playIn(() => {
        navigate(path);
        // espera a página nova montar/pintar por baixo antes de revelar
        requestAnimationFrame(() => {
          svgRef.current.playOut(() => {
            isAnimating.current = false;
            pendingRevealRef.current?.();
            pendingRevealRef.current = null;
          });
        });
      });
    },
    [navigate],
  );

  return (
    <SvgTransitionContext.Provider
      value={{ transitionTo, onReveal, isTransitioning: isAnimating }}
    >
      {children}
      <SvgTransition ref={svgRef} />
    </SvgTransitionContext.Provider>
  );
};

export default SvgTransition;
