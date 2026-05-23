import styles from "./Button.module.css";

const Button = ({ label, variant }) => {
  return (
    <button
      className={`${styles.btn} ${variant === "primary" ? styles.primary : styles.secondary}`}
    >
      {label}
    </button>
  );
};

export default Button;
