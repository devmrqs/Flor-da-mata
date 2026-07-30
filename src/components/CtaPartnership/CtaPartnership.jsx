// Libraries
import { Link } from "react-router-dom";

// Hooks
import { useSvgTransition } from "../SVG/useSvgTransition";

// Components
import Button from "../Button/Button";

// CSS
import styles from "./CtaPartnership.module.css";

const CtaPartnership = () => {
  const transitionTo = useSvgTransition();

  function handleClick(e) {
    e.preventDefault();
    transitionTo("/seja-parceiro");
  }

  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaContent}>
        <h2>Vamos crescer juntos?</h2>
        <p>Leve a Flor da Mata para a sua loja e faça parte dessa história.</p>
        <Link
          to="/seja-parceiro"
          className={styles.ctaLink}
          onClick={handleClick}
        >
          <Button
            label="Junte-se a nós"
            variant="primary"
            icon="arrow"
          ></Button>
        </Link>
      </div>
    </section>
  );
};

export default CtaPartnership;
