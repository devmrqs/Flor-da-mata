import Button from "../../components/Button/Button";
import NaturezaText from "../../components/NaturezaText/NaturezaText";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <main>
      <section className={styles.main}>
        <p className={styles.textA}>A</p>
        <NaturezaText />
        <p className={styles.textSlogan}>Nos leva até você!</p>
        <div className={styles.containerBtn}>
          <Button label="Solicitar orçamento" variant="primary" icon="arrow" />
          <Button
            label="Entrar em contato"
            variant="secondary"
            icon="whatsapp"
          />
        </div>
      </section>
    </main>
  );
};

export default Home;
