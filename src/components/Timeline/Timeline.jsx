// Libraries
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Data
import { cardsTimeline } from "../../data/timeline";

// CSS
import styles from "./Timeline.module.css";

gsap.registerPlugin(ScrollTrigger);

const Timeline = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const pinRef = useRef(null);
  const cardRefs = useRef([]);

  useGSAP(
    () => {
      const cards = cardRefs.current.filter(Boolean);
      if (!cards.length) return;

      // Cabeçalho e cards entram na MESMA timeline presa — o título some
      // junto com os cards no lugar do próprio "pulinho" de escala do
      // ProductModal, um de cada vez, conforme o scroll avança (e sai na
      // ordem inversa se você subir de novo).
      gsap.set(headerRef.current.children, { opacity: 0, y: 30 });
      gsap.set(cards, { opacity: 0, scale: 0.8 });

      // pinSpacing precisa ser explícito (o padrão implícito não estava
      // reservando o espaço extra de scroll aqui, possivelmente por causa
      // do ScrollSmoother) — sem isso, o pin só guardava a altura natural
      // do wrapper, ignorando a distância pedida em "end".
      gsap
        .timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top top",
            end: "+=" + (cards.length * 400 + 300),
            pin: true,
            pinSpacing: true,
            scrub: 1,
          },
        })
        .to(headerRef.current.children, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        })
        .to(cards, {
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 1.2,
          ease: "back.out(1.7)",
        });
    },
    { scope: sectionRef },
  );

  return (
    <section className={styles.timelineSection} ref={sectionRef}>
      <div className={styles.pinWrapper} ref={pinRef}>
        <div className={styles.header} ref={headerRef}>
          <span className={styles.kicker}>Nossa história</span>
          <h2>Nossa trajetória</h2>
          <p>Vinte anos não se resumem a datas — se contam em decisões.</p>
        </div>

        <div className={styles.row}>
          <div className={styles.rail} />

          {cardsTimeline.map((card, index) => (
            <div
              key={card.id}
              className={styles.card}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
            >
              <div className={styles.imagePlaceholder} />
              <span className={styles.dot} />
              <h3>{card.year}</h3>
              <strong>{card.title}</strong>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
