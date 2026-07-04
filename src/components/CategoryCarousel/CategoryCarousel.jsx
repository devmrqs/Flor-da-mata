import { useState } from "react";

// Hooks
import { useDragScroll } from "../../hooks/useDragScroll.js";

// Data
import { categories } from "../../data/categories.js";

// Components
import ProductsList from "../ProductsList/ProductsList.jsx";

// Assets
import arrow from "../../assets/images/cards-products/arrowProducts.svg";
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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { ref, onMouseDown, hasDragged } = useDragScroll(categories.length);
  const loopedCategories = [...categories, ...categories, ...categories];

  function handleSelectCategory(category) {
    if (selectedCategory?.id === category.id) {
      setSelectedCategory(null);
      return;
    }
    setSelectedCategory(category);
  }

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.track} ref={ref} onMouseDown={onMouseDown}>
        {loopedCategories.map((category, index) => {
          const isActive = selectedCategory?.id === category.id;

          return (
            <div
              key={`${category.id}-${index}`}
              className={`${styles.cardWrapper} ${isActive ? styles.expandedCard : ""}`}
            >
              <button
                className={`${styles.card} ${isActive ? styles.activeCard : ""}`}
                onClick={() => {
                  if (hasDragged.current) return;
                  handleSelectCategory(category);
                }}
                type="button"
              >
                <img
                  src={categoryImages[category.id]}
                  alt={category.title}
                  className={styles.cardImage}
                />
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h4>{category.title}</h4>
                    <img src={arrow} alt="" className={styles.arrowCard} />
                  </div>
                  <p>{category.description}</p>
                </div>
              </button>

              {isActive && (
                <ProductsList
                  category={category}
                  categoryImage={categoryImages[category.id]}
                  variant="insideCard"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryCarousel;
