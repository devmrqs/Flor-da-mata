import Button from "../../components/Button/Button";
import NaturezaText from "../../components/NaturezaText/NaturezaText";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <main>
      <section>
        <p>A</p>
        <NaturezaText />
        <p>Nos leva até você!</p>
        <div className={styles.containerBtn}>
          <Button label="Solicitar orçamento" variant="primary" />
          <Button label="Entrar em contato" variant="secondary" />
        </div>
      </section>
    </main>
  );
};

export default Home;
