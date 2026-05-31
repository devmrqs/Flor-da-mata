import styles from "./Timeline.module.css";
import arrowLeft from "../../assets/images/arrowLeft.svg";
import arrowRight from "../../assets/images/arrowRight.svg";
import { cardsTimeline } from "../../data/timeline";

const Timeline = () => {
  return (
    <section className={styles.timelineSection}>
      <h2>Nossa trajetória</h2>
      <p>Vinte anos não se resumem a datas — se contam em decisões.</p>
      <div className={styles.carouselWrapper}>
        <button>
          <img src={arrowLeft} alt="Botão para navegar para a esquerda" />
        </button>
        <div className={styles.cardsContainer}>
          {cardsTimeline.map((card) => (
            <div key={card.id}>
              <h3>{card.year}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
        <button>
          <img src={arrowRight} alt="Botão para navegar para a direita" />
        </button>
      </div>
    </section>
  );
};

export default Timeline;
