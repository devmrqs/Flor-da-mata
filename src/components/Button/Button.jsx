// Libraries
import { useRef } from "react";
import gsap from "gsap";

// Assets
import arrowIcon from "../../assets/images/arrowDiagonal.svg";
import whatsappIcon from "../../assets/images/whatsapp.svg";

// CSS
import styles from "./Button.module.css";

// Constantes de animação — ajusta aqui pra mudar o "feel" do botão inteiro
const DURATION_MAIN = 0.55;
const DURATION_SOFT = 0.4;
const EASE_MAIN = "power4.inOut";
const EASE_SOFT = "power3.out";

// Cor/tamanho de cada variante e tamanho ficam nos tokens do Button.module.css
// — aqui só mapeia os nomes de prop pra classe CSS. Pra adicionar uma
// variante/tamanho novo: cria o bloco de tokens no CSS e adiciona uma
// entrada aqui.
const VARIANTS = {
  primary: styles.primary,
  secondary: styles.secondary,
};

const SIZES = {
  default: "",
  small: styles.small,
  "v-small": styles.vsmall,
};

// Cada ícone sabe sua própria imagem, o espaçamento do círculo ao redor
// (tamanhos nativos bem diferentes: seta 13px, whatsapp 21px) e se precisa
// de estilo próprio (o whatsapp precisa de largura fixa + inverter pra
// branco, já que fica em cima de um círculo escuro). Pra adicionar um
// ícone novo, só cria uma entrada aqui.
const ICONS = {
  arrow: { src: arrowIcon, wrapperClass: styles.iconArrow, imgClass: "" },
  whatsapp: {
    src: whatsappIcon,
    wrapperClass: styles.iconWpp,
    imgClass: styles.wppIcon,
  },
};

const Button = ({
  label,
  variant = "primary",
  size = "default",
  icon = "arrow",
  onClick,
}) => {
  const btnRef = useRef(null);
  const arrowWrapperRef = useRef(null);
  const textRef = useRef(null);
  const spacerRef = useRef(null);

  const iconConfig = ICONS[icon] ?? ICONS.arrow;

  function getAnimatedElements() {
    return [
      btnRef.current,
      arrowWrapperRef.current,
      textRef.current,
      spacerRef.current,
    ];
  }

  function playEnterAnimation() {
    gsap.killTweensOf(getAnimatedElements());

    // Texto e spacer colapsam
    gsap.to([textRef.current, spacerRef.current], {
      width: 0,
      opacity: 0,
      margin: 0,
      duration: 0.35,
      ease: EASE_SOFT,
    });

    // Gap do botão fecha junto
    gsap.to(btnRef.current, {
      gap: 0,
      duration: DURATION_MAIN,
      ease: EASE_MAIN,
    });

    // Círculo da seta cresce, preenchendo o espaço liberado
    gsap.to(arrowWrapperRef.current, {
      flexGrow: 1,
      duration: DURATION_MAIN,
      ease: EASE_MAIN,
    });
  }

  function playLeaveAnimation() {
    gsap.killTweensOf(getAnimatedElements());

    // Círculo da seta encolhe de volta
    gsap.to(arrowWrapperRef.current, {
      flexGrow: 0,
      duration: DURATION_MAIN,
      ease: EASE_MAIN,
      onComplete: () =>
        gsap.set(arrowWrapperRef.current, { clearProps: "flexGrow" }),
    });

    // Gap do botão reabre
    gsap.to(btnRef.current, {
      gap: 20,
      duration: DURATION_MAIN,
      ease: EASE_MAIN,
    });

    // Texto reaparece com leve deslocamento (dá sensação de "assentar")
    gsap.fromTo(
      textRef.current,
      { width: 0, opacity: 0, x: 12 },
      {
        width: "auto",
        opacity: 1,
        x: 0,
        duration: 0.45,
        delay: 0.18,
        ease: EASE_SOFT,
        onComplete: () =>
          gsap.set(textRef.current, { clearProps: "width,opacity,transform" }),
      },
    );

    // Spacer reaparece
    gsap.to(spacerRef.current, {
      width: "",
      opacity: 1,
      margin: "",
      duration: DURATION_SOFT,
      delay: 0.16,
      ease: EASE_SOFT,
      onComplete: () =>
        gsap.set(spacerRef.current, { clearProps: "width,opacity,margin" }),
    });
  }

  function handleMouseEnter() {
    playEnterAnimation();
  }

  function handleMouseLeave() {
    playLeaveAnimation();
  }

  const btnClassName = [styles.btn, VARIANTS[variant], SIZES[size]]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      ref={btnRef}
      className={btnClassName}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      type="button"
    >
      <div ref={spacerRef} className={styles.spacer} />

      <span ref={textRef} className={styles.label}>
        {label}
      </span>

      <div
        ref={arrowWrapperRef}
        className={`${styles.iconWrapper} ${iconConfig.wrapperClass}`}
      >
        <img src={iconConfig.src} alt="" className={iconConfig.imgClass} />
      </div>
    </button>
  );
};

export default Button;
