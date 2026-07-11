// Components
import Button from "../../components/Button/Button";
import NaturezaText from "../../components/NaturezaText/NaturezaText";

// Pages
import About from "../About/About";
import Products from "../Products/Products";

// CSS
import styles from "./Home.module.css";

import arrowEndding from "../../assets/images/arrowEndding.svg";
import Partnership from "../Partner/Partnership";

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
        <div className={styles.enddingPage}>
          <p>Nossos produtos</p>
          <img src={arrowEndding} alt="Seta destinando a sessão produtos" />
        </div>
      </section>
      <Products />
      <About />
    </main>
  );
};

export default Home;
