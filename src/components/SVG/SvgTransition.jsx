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

// Quem clica no botão não sabe (nem precisa saber) que isso é um SVG sendo
// desenhado — só chama `ref.current.playIn(onComplete)` / `playOut(onComplete)`.
// Precisa viver fora das rotas (ver SvgTransitionProvider) pra sobreviver à
// troca de página: o "playOut" (a saída) tem que acontecer com o site de
// destino já carregado por baixo, não antes de navegar.
const SvgTransition = forwardRef((_props, ref) => {
  const pathRef = useRef(null);

  useGSAP(
    () => {
      gsap.set(pathRef.current, { drawSVG: "0%", strokeWidth: 2 });
    },
    { scope: pathRef },
  );

  useImperativeHandle(ref, () => ({
    // desenha e engrossa — cobre a página atual antes de trocar de rota
    playIn(onComplete) {
      gsap.to(pathRef.current, {
        drawSVG: "100%",
        strokeWidth: 490,
        duration: 1.7,
        ease: "power2.inOut",
        onComplete,
      });
    },
    // desdesenha e afina — roda com a página nova já carregada por baixo
    playOut(onComplete) {
      gsap.to(pathRef.current, {
        drawSVG: "0%",
        strokeWidth: 2,
        duration: 1.5,
        ease: "power2.inOut",
        onComplete,
      });
    },
  }));

  return (
    <div className={styles.divSvg}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1062 563"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={pathRef}
          d="M12.6942 561.989C9.19424 404.823 53.6922 65.4893 89.6978 87.9907C190.017 150.685 173.194 757.989 247.694 341.491C322.194 -75.0074 450.691 739.489 464.194 220.989C477.698 -297.511 603.197 696.489 728.694 332.489C854.19 -31.5106 849.794 766.189 938.194 394.989C1026.59 23.7892 1037.53 45.3241 1049.7 3.49072"
          stroke="#40472d"
          strokeWidth="25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
});

SvgTransition.displayName = "SvgTransition";

// Precisa envolver as rotas (não ficar dentro de uma página) pra sobreviver
// à troca de rota: o "playIn" cobre a página atual, o navigate troca o
// conteúdo por baixo, e só então o "playOut" revela a página nova.
export const SvgTransitionProvider = ({ children }) => {
  const navigate = useNavigate();
  const svgRef = useRef(null);
  const isAnimating = useRef(false);
  const pendingRevealRef = useRef(null);

  // A página de destino usa isso pra saber se chegou via transição (e nesse
  // caso só revelar sua própria entrada quando o "playOut" terminar) ou via
  // navegação direta (URL/refresh), quando não há SVG nenhum rodando.
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
        // espera o próximo frame pra garantir que a página nova já foi
        // montada/pintada por baixo antes de começar a revelar ela.
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
