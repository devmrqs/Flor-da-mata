import styles from "./NaturezaText.module.css";
import natureza from "../../assets/images/NATUREZA.webp";

const NaturezaText = () => {
  return (
    <div className={styles.container}>
      <img src={natureza} alt="Texto Natureza" className={styles.naturezaImg} />
    </div>
  );
};

export default NaturezaText;
