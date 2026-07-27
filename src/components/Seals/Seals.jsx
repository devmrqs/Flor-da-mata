// Data
import { seals } from "../../data/seals";

// CSS
import styles from "./Seals.module.css";

// Assets
import transgenicos from "../../assets/images/seals/transgenicos.svg";
import acucar from "../../assets/images/seals/acucar.svg";
import corantes from "../../assets/images/seals/corante.svg";
import conservantes from "../../assets/images/seals/conservantes.svg";
import naturais from "../../assets/images/seals/naturais.svg";

const sealsIcons = {
  1: transgenicos,
  2: acucar,
  3: corantes,
  4: conservantes,
  5: naturais,
};

const Seals = () => {
  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <div className={styles.intro}>
          <span className={styles.kicker}>Nossos compromissos</span>
          <h3>Qualidade que vem da natureza, chega até sua loja.</h3>
          <p>
            Selecionamos cuidadosamente o que há de melhor da natureza para
            entregar produtos puros, seguros e alinhados com o que acreditamos.
          </p>
        </div>

        <div className={styles.sealsWrap}>
          {seals.map((seal, index) => (
            <div
              key={seal.id}
              className={styles.sealCard}
              data-tone={index % 5}
            >
              <div className={styles.badgeRing}>
                <div className={styles.badge}>
                  <img src={sealsIcons[seal.id]} alt="" />
                </div>
              </div>
              <p>{seal.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Seals;
