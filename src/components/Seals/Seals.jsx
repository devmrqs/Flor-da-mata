// Data
import { seals } from "../../data/seals";

// CSS
import styles from "./Seals.module.css";

// Assets
import transgenicos from "../../assets/images/seals/transgenicos.svg";
import acucar from "../../assets/images/seals/acucar.svg";
import corantes from "../../assets/images/seals/corante.svg";
import conservantes from "../../assets/images/seals/conservantes.svg";

const sealsIcons = {
  1: transgenicos,
  2: acucar,
  3: corantes,
  4: conservantes,
};

const Seals = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textWrap}>
        <h3>Apenas ingredientes selecionados</h3>
        <p>
          Todos os nossos produtos são selecionados e seguem as normas da
          vigilância sanitária. Garantindo qualidade e segurança no seu dia a
          dia.
        </p>
      </div>
      <div className={styles.sealsWrap}>
        {seals.map((seal) => (
          <div key={seal.id} className={styles.sealContainer}>
            <div className={styles.circle}>
              <img src={sealsIcons[seal.id]} alt={seal.label} />
            </div>
            <p>{seal.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Seals;
