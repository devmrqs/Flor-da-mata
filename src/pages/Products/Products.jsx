// Components
import Button from "../../components/Button/Button";
import CategoryCarousel from "../../components/CategoryCarousel/CategoryCarousel";

// CSS
import styles from "./Products.module.css";

const Products = ({ isPage = false }) => {
  return (
    <section
      className={`${styles.products} ${isPage ? styles.productsPage : ""}`}
    >
      <div className={styles.heroProducts}>
        <div className={styles.textHero}>
          <p className={styles.label}>Conheça todos os nossos</p>
          <h2>Produtos</h2>
        </div>
        <p className={styles.labelTwo}>
          Da natureza direto para a sua prateleira — são 10 categorias, com mais
          de 100 produtos selecionados.
        </p>

        <Button
          label="Solicitar orçamento"
          variant="primary"
          icon="arrow"
          size="small"
        />
      </div>
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <strong>+100</strong>
          <p>Produtos selecionados</p>
        </div>
        <div className={styles.statItem}>
          <strong>10</strong>
          <p>Categorias de Produtos</p>
        </div>
        <div className={styles.statItem}>
          <strong>20</strong>
          <p>Anos no mercado</p>
        </div>
        <div className={styles.statItem}>
          <strong>100%</strong>
          <p>Natural</p>
        </div>
      </div>
      <div className={styles.introCarousel}>
        <p className={styles.label}>Nosso catálogo</p>
        <h3>Explore por categoria</h3>
        <p className={styles.labelTwo}>
          Passe o mouse sobre cada categoria para conhecer mais
        </p>
      </div>
      <CategoryCarousel />
    </section>
  );
};

export default Products;
