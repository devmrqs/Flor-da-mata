// Libraries
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Components
import Button from "../../components/Button/Button";
import NaturezaText from "../../components/NaturezaText/NaturezaText";

// Pages
import About from "../About/About";
import Products from "../Products/Products";

// Assets
import arrowEndding from "../../assets/images/arrowEndding.svg";

// CSS
import styles from "./Home.module.css";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef(null);
  const arrowRef = useRef(null);

  useGSAP(
    () => {
      window.scrollTo(0, 0);
      const tl = gsap.timeline({ delay: 0.2 });

      tl.from(`.${styles.textA}`, {
        opacity: 0,
        y: -30,
        duration: 0.6,
        ease: "power3.out",
      })
        .from(
          `.${styles.naturezaWrapper}`,
          { opacity: 0, y: 40, duration: 0.5, ease: "power3.out" },
          "-=0.3",
        )
        .from(
          `.${styles.textSlogan}`,
          { opacity: 0, y: 30, duration: 0.5, ease: "power3.out" },
          "-=0.4",
        )
        .from(
          `.${styles.containerBtn} > *`,
          {
            opacity: 0,
            y: 25,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.3",
        )
        .from(
          `.${styles.enddingPage}`,
          { opacity: 0, y: 20, duration: 0.5, ease: "power3.out" },
          "-=0.2",
        );

      gsap.to(arrowRef.current, {
        y: 4,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1.5,
      });

      // pin só é criado depois da entrada terminar, evita brigar de opacidade
      tl.eventCallback("onComplete", () => {
        const pinTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "+=100%",
            pin: true,
            pinSpacing: false,
            scrub: 0.8,
            invalidateOnRefresh: true,
            // barra de endereço do celular some/aparece e muda a altura da
            // viewport: sem isso o ScrollTrigger recalcula e dá tranco no pin
            ignoreMobileResize: true,
          },
        });

        pinTl.to(heroRef.current, {
          scale: 0.92,
          opacity: 0.6,
          ease: "none",
          duration: 0.85,
        });

        ScrollTrigger.refresh();
      });
    },
    { scope: heroRef },
  );

  return (
    <main>
      <section className={styles.main} ref={heroRef}>
        <div className={styles.heroContent}>
          <p className={styles.textA}>A</p>
          <div className={styles.naturezaWrapper}>
            <NaturezaText />
          </div>
          <p className={styles.textSlogan}>Nos leva até você!</p>
          <div className={styles.containerBtn}>
            <Button
              label="Solicitar orçamento"
              variant="primary"
              icon="arrow"
            />
            <Button
              label="Entrar em contato"
              variant="secondary"
              icon="whatsapp"
            />
          </div>
        </div>
        <div className={styles.enddingPage}>
          <p>Nossos produtos</p>
          <img
            ref={arrowRef}
            src={arrowEndding}
            alt="Seta destinando a sessão produtos"
          />
        </div>
      </section>
      <Products />
      <About />
    </main>
  );
};

export default Home;
