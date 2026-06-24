// Data
import { categories } from "../../data/categories.js";

// Assets
import arrow from "../../assets/images/cards-products/arrowProducts.svg";

// Cards
import chas from "../../assets/images/cards-products/chaservas.png";
import graos from "../../assets/images/cards-products/graos.png";
import naturais from "../../assets/images/cards-products/naturais.png";
import sementes from "../../assets/images/cards-products/sementes.png";
import farinhas from "../../assets/images/cards-products/farinhas.png";
import soja from "../../assets/images/cards-products/soja.png";
import elixis from "../../assets/images/cards-products/elixis.png";
import capsulas from "../../assets/images/cards-products/capsulas.png";
import beleza from "../../assets/images/cards-products/beleza.png";
import snacks from "../../assets/images/cards-products/snacks.png";

// CSS
import styles from "./CategoryCarousel.module.css";

const categoryImages = {
  1: chas,
  2: graos,
  3: naturais,
  4: sementes,
  5: farinhas,
  6: soja,
  7: elixis,
  8: capsulas,
  9: beleza,
  10: snacks,
};

const CategoryCarousel = () => {
  return (
    <div className={styles.carouselContainer}>
      <div className={styles.track}>
        {categories.map((category) => (
          <div key={category.id} className={styles.card}>
            <img
              src={categoryImages[category.id]}
              alt={category.title}
              className={styles.cardImage}
            />
            <div className={styles.cardContent}>
              <div className={styles.cardHeader}>
                <h4>{category.title}</h4>
                <img src={arrow} alt="Seta para acessar o card do produto." />
              </div>
              <p>{category.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCarousel;
