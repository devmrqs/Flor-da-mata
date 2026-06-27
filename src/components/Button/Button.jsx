// Assets
import arrowIcon from "../../assets/images/arrowDiagonal.svg";
import whatsappIcon from "../../assets/images/whatsapp.svg";

// CSS
import styles from "./Button.module.css";

const Button = ({ label, variant, icon, size }) => {
  return (
    <button
      className={`${styles.btn} ${variant === "primary" ? styles.primary : styles.secondary} ${size === "small" ? styles.small : ""} ${size === "v-small" ? styles.vsmall : ""}`}
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
