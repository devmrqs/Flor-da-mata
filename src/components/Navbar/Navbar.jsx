import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import logo from "../../assets/images/Logotexto.svg";
import burg from "../../assets/images/Burg.svg";
import arrowDown from "../../assets/images/arrowDown.svg";

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink to="/">
        <img
          src={logo}
          alt="Logotexto da Flor da Mata"
          className={styles.logo}
        />
      </NavLink>
      <div className={styles.container}>
        <ul className={styles.navLinks}>
          <li>
            <NavLink to="/produtos" className={styles.link}>
              Produtos
              <img src={arrowDown} alt="" className={styles.arrowDown} />
            </NavLink>
          </li>
          <li>
            <NavLink to="/encontre" className={styles.link}>
              Encontre-nos
            </NavLink>
          </li>
          <li>
            <NavLink to="/sobre" className={styles.link}>
              Sobre
            </NavLink>
          </li>
        </ul>
        <button className={styles.hamburger}>
          <img src={burg} alt="Botão do menu" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
