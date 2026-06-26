import { useState } from "react";

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

  function handleSelectCategory(category) {
    if (selectedCategory?.id === category.id) {
      setSelectedCategory(null);
      return;
    }
    setSelectedCategory(category);
  }

  return (
    <>
      <div className={styles.carouselContainer}>
        <div className={styles.track}>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.card} ${
                selectedCategory?.id === category.id ? styles.activeCard : ""
              }`}
              onClick={() => handleSelectCategory(category)}
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
          ))}
        </div>
      </div>

      {selectedCategory && (
        <div className={styles.productsListWrapper}>
          <ProductsList
            category={selectedCategory}
            categoryImage={categoryImages[selectedCategory.id]}
          />
        </div>
      )}
    </>
  );
};

export default CategoryCarousel;
