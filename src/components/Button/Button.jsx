import styles from "./Button.module.css";
import arrowIcon from "../../assets/images/arrowDiagonal.svg";
import whatsappIcon from "../../assets/images/whatsapp.svg";

const Button = ({ label, variant, icon }) => {
  return (
    <button
      className={`${styles.btn} ${variant === "primary" ? styles.primary : styles.secondary}`}
    >
      <div className={styles.spacer} />
      {label}
      <div className={variant === "primary" ? styles.arrowWrapper : ""}>
        <img
          src={icon === "arrow" ? arrowIcon : whatsappIcon}
          alt=""
          className={variant === "secondary" ? styles.wppWrapper : ""}
        />
      </div>
    </button>
  );
};

export default Button;
