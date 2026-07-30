// Libraries
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Data
import { seals } from "../../data/seals";

// CSS
import styles from "./Seals.module.css";

// Assets
import transgenicos from "../../assets/images/seals/transgenicos.svg";
import acucar from "../../assets/images/seals/acucar.svg";
import corantes from "../../assets/images/seals/corante.svg";
import conservantes from "../../assets/images/seals/conservantes.svg";
import naturais from "../../assets/images/seals/naturais.svg";

gsap.registerPlugin(ScrollTrigger);

const sealsIcons = {
  1: transgenicos,
  2: acucar,
  3: corantes,
  4: conservantes,
  5: naturais,
};

const Seals = () => {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
        .from(`.${styles.kicker}`, {
          opacity: 0,
          y: 16,
          duration: 0.4,
          ease: "power3.out",
        })
        .from(
          `.${styles.intro} h3`,
          { opacity: 0, y: 24, duration: 0.55, ease: "power3.out" },
          "-=0.25",
        )
        .from(
          `.${styles.intro} p`,
          { opacity: 0, y: 18, duration: 0.45, ease: "power3.out" },
          "-=0.3",
        )
        .from(
          `.${styles.sealCard}`,
          {
            opacity: 0,
            y: 30,
            scale: 0.92,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "transform",
          },
          "-=0.25",
        );
    },
    { scope: sectionRef },
  );

  return (
    <section className={styles.container} ref={sectionRef}>
      <div className={styles.card}>
        <div className={styles.intro}>
          <span className={styles.kicker}>Nossos compromissos</span>
          <h3>Qualidade que vem da natureza, chega até sua loja.</h3>
          <p>
            Selecionamos cuidadosamente o que há de melhor da natureza para
            entregar produtos puros, seguros e alinhados com o que acreditamos.
          </p>
        </div>

        <div className={styles.sealsWrap}>
          {seals.map((seal, index) => (
            <div
              key={seal.id}
              className={styles.sealCard}
              data-tone={index % 5}
            >
              <div className={styles.badgeRing}>
                <div className={styles.badge}>
                  <img src={sealsIcons[seal.id]} alt="" />
                </div>
              </div>
              <p>{seal.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Seals;
