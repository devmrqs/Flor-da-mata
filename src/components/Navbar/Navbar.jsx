// Libraries
import { useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// Assets
import logo from "../../assets/images/Logotexto.svg";
import burg from "../../assets/images/Burg.svg";

// CSS
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const navRef = useRef(null);

  const handleLogoClick = () => {
    navigate("/");
    window.scrollTo(0, 0);
  };

  useGSAP(
    () => {
      gsap.from(`.${styles.link}`, {
        opacity: 0,
        x: 30,
        duration: 0.3,
        stagger: 0.1,
        delay: 0.1,
        ease: "power2.out",
        clearProps: "transform",
      });
    },
    { scope: navRef },
  );

  return (
    <nav className={styles.navbar} ref={navRef}>
      <NavLink to="/" onClick={handleLogoClick}>
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
            </NavLink>
          </li>
          <li>
            <NavLink to="/sobre" className={styles.link}>
              Sobre
            </NavLink>
          </li>
          <li>
            <NavLink to="/seja-parceiro" className={styles.link}>
              Seja Parceiro
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
