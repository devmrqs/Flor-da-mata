// Assets
import natureza from "../../assets/images/NATUREZA.webp";

// CSS
import styles from "./NaturezaText.module.css";

const NaturezaText = () => {
  return (
    <div className={styles.container}>
      <img src={natureza} alt="Texto Natureza" className={styles.naturezaImg} />
    </div>
  );
};

export default NaturezaText;
