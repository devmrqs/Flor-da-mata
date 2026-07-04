// Components
import Timeline from "../../components/Timeline/Timeline";
import Seals from "../../components/Seals/Seals";

// Assets
import lotus from "../../assets/images/LotusFlower.svg";

// CSS
import styles from "./About.module.css";

const About = () => {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.textBlock}>
        <h1>
          Há duas décadas, acreditamos que a natureza pode transformar não só o
          que se vende, mas quem vende
        </h1>
      </div>
      <div className={styles.textBlock}>
        <h2>
          Desde 2006, a Flor da Mata conecta produtores e lojistas por todo o
          Brasil, distribuindo produtos naturais selecionados
        </h2>
      </div>
      <div className={styles.textBlockCenter}>
        <p>
          Mais do que fornecedores, buscamos parceiros que compartilham da mesma
          crença, saúde e natureza como caminho de transformação
        </p>
        <img src={lotus} alt="Flor de Lotus" />
      </div>
      <Timeline />
      <Seals />
    </section>
  );
};

export default About;
