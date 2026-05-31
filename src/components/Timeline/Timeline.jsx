// Libraries
import { useState } from "react";

// Data
import { cardsTimeline } from "../../data/timeline";

// Assets
import arrowLeft from "../../assets/images/arrowLeft.svg";
import arrowRight from "../../assets/images/arrowRight.svg";

// CSS
import styles from "./Timeline.module.css";

const Timeline = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const getVisibleCards = () => {
    const total = cardsTimeline.length;
    const prev = (activeIndex - 1 + total) % total;
    const next = (activeIndex + 1) % total;
    return [
      cardsTimeline[prev],
      cardsTimeline[activeIndex],
      cardsTimeline[next],
    ];
  };

  return (
    <section className={styles.timelineSection}>
      <h2>Nossa trajetória</h2>
      <p>Vinte anos não se resumem a datas — se contam em decisões.</p>
      <div className={styles.carouselWrapper}>
        <button
          className={styles.btnNav}
          onClick={() =>
            setActiveIndex(
              (activeIndex - 1 + cardsTimeline.length) % cardsTimeline.length,
            )
          }
        >
          <img src={arrowLeft} alt="Botão para navegar para a esquerda" />
        </button>
        <div className={styles.cardsContainer}>
          {getVisibleCards().map((card, index) => (
            <div
              key={card.id}
              className={index === 1 ? styles.cardActive : styles.card}
            >
              <h3>{card.year}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
        <button
          className={styles.btnNav}
          onClick={() =>
            setActiveIndex((activeIndex + 1) % cardsTimeline.length)
          }
        >
          <img src={arrowRight} alt="Botão para navegar para a direita" />
        </button>
      </div>
    </section>
  );
};

export default Timeline;
