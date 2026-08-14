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
// precisa espelhar o `gap` do .btn no CSS — é pra cá que a saída volta
const REST_GAP = 12;

const Button = ({ label, variant, icon, size, onClick }) => {
  const btnRef = useRef(null);
  const arrowWrapperRef = useRef(null);
  const textRef = useRef(null);
  const spacerRef = useRef(null);

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

    gsap.to([textRef.current, spacerRef.current], {
      width: 0,
      opacity: 0,
      margin: 0,
      duration: 0.35,
      ease: EASE_SOFT,
    });

    gsap.to(btnRef.current, {
      gap: 0,
      duration: DURATION_MAIN,
      ease: EASE_MAIN,
    });

    // seta cresce pra preencher o espaço liberado pelo texto
    gsap.to(arrowWrapperRef.current, {
      flexGrow: 1,
      duration: DURATION_MAIN,
      ease: EASE_MAIN,
    });
  }

  function playLeaveAnimation() {
    gsap.killTweensOf(getAnimatedElements());

    gsap.to(arrowWrapperRef.current, {
      flexGrow: 0,
      duration: DURATION_MAIN,
      ease: EASE_MAIN,
      onComplete: () =>
        gsap.set(arrowWrapperRef.current, { clearProps: "flexGrow" }),
    });

    gsap.to(btnRef.current, {
      gap: REST_GAP,
      duration: DURATION_MAIN,
      ease: EASE_MAIN,
    });

    // pequeno deslocamento no texto dá sensação de "assentar"
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

  return (
    <button
      ref={btnRef}
      className={`${styles.btn} ${
        variant === "primary" ? styles.primary : styles.secondary
      } ${size === "small" ? styles.small : ""}`}
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
        className={
          variant === "primary" ? styles.arrowWrapper : styles.wppIconWrapper
        }
      >
        <img
          src={icon === "arrow" ? arrowIcon : whatsappIcon}
          alt=""
          className={icon === "arrow" ? "" : styles.wppIcon}
        />
      </div>
    </button>
  );
};

export default Button;
