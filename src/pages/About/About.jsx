import styles from "./About.module.css";

import lotus from "../../assets/images/LotusFlower.svg";
import Timeline from "../../components/Timeline/Timeline";
import Seals from "../../components/Seals/Seals";

const About = () => {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.textBlock}>
        <h1>
          Há duas décadas levando
          <br />
          produtos naturais até a sua casa
        </h1>
      </div>
      <div className={styles.textBlock}>
        <h2>
          Uma história construída com
          <br />
          propósito, cuidado e respeito à natureza
        </h2>
      </div>
      <div className={styles.textBlockCenter}>
        <p>
          Desde 2006, a Flor da Mata conecta produtores, qualidade e tradição
          <br />
          para abastecer nossos parceiros pelo Brasil com produtos naturais
          selecionados{" "}
        </p>
        <img src={lotus} alt="Flor de Lotus" />
      </div>
      <Timeline />
      <Seals />
    </section>
  );
};

export default About;
