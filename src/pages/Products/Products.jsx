// Libraries
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Components
import Button from "../../components/Button/Button";
import CategoryCarousel from "../../components/CategoryCarousel/CategoryCarousel";
import Seals from "../../components/Seals/Seals.jsx";
import CtaPartnership from "../../components/CtaPartnership/CtaPartnership.jsx";

// CSS
import styles from "./Products.module.css";

gsap.registerPlugin(ScrollTrigger);

const Products = ({ isPage = false }) => {
  const sectionRef = useRef(null);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const introRef = useRef(null);

  useGSAP(
    () => {
      // Hero: label → título → texto de apoio → botão
      gsap
        .timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        })
        .from(`.${styles.textHero} .${styles.label}`, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power3.out",
        })
        .from(
          `.${styles.textHero} h2`,
          { opacity: 0, y: 40, duration: 0.6, ease: "power3.out" },
          "-=0.35",
        )
        .from(
          `.${styles.heroProducts} .${styles.labelTwo}`,
          { opacity: 0, y: 30, duration: 0.5, ease: "power3.out" },
          "-=0.3",
        )
        .from(
          `.${styles.heroProducts} button`,
          { opacity: 0, y: 25, duration: 0.5, ease: "power3.out" },
          "-=0.3",
        );

      // StatsBar: números sobem em stagger
      gsap.from(`.${styles.statItem}`, {
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
      });

      // Intro do carrossel: label → título → texto de apoio
      gsap
        .timeline({
          scrollTrigger: {
            trigger: introRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
        .from(`.${styles.introCarousel} .${styles.label}`, {
          opacity: 0,
          y: 25,
          duration: 0.5,
          ease: "power3.out",
        })
        .from(
          `.${styles.introCarousel} h3`,
          { opacity: 0, y: 30, duration: 0.5, ease: "power3.out" },
          "-=0.3",
        )
        .from(
          `.${styles.introCarousel} .${styles.labelTwo}`,
          { opacity: 0, y: 20, duration: 0.4, ease: "power3.out" },
          "-=0.25",
        );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={`${styles.products} ${isPage ? styles.productsPage : ""}`}
    >
      <div className={styles.heroProducts} ref={heroRef}>
        <div className={styles.textHero}>
          <p className={styles.label}>Conheça todos os nossos</p>
          <h2>Produtos</h2>
        </div>
        <p className={styles.labelTwo}>
          Da natureza direto para a sua prateleira — são 10 categorias, com mais
          de 100 produtos selecionados.
        </p>

        <Button
          label="Solicitar orçamento"
          variant="primary"
          icon="arrow"
          size="small"
        />
      </div>
      <div className={styles.statsBar} ref={statsRef}>
        <div className={styles.statItem}>
          <strong>+100</strong>
          <p>Produtos selecionados</p>
        </div>
        <div className={styles.statItem}>
          <strong>10</strong>
          <p>Categorias de Produtos</p>
        </div>
        <div className={styles.statItem}>
          <strong>20</strong>
          <p>Anos no mercado</p>
        </div>
        <div className={styles.statItem}>
          <strong>100%</strong>
          <p>Natural</p>
        </div>
      </div>
      <div className={styles.introCarousel} ref={introRef}>
        <p className={styles.label}>Nosso catálogo</p>
        <h3>Explore por categoria</h3>
        <p className={styles.labelTwo}>
          PASSE O MOUSE SOBRE CADA CATEGORIA PARA CONHECER MAIS
        </p>
      </div>
      <CategoryCarousel />
      <Seals />
      {isPage && <CtaPartnership />}
    </section>
  );
};

export default Products;
