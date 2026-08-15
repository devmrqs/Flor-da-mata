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

      const mm = gsap.matchMedia();

      // desktop: cards lado a lado, revelados um a um com a seção presa
      mm.add("(min-width: 64rem)", () => {
        gsap.set(headerRef.current.children, { opacity: 0, y: 30 });
        gsap.set(cards, { opacity: 0, scale: 0.8 });

        // pinSpacing explícito, senão o pin ignora o "end" pedido
        gsap
          .timeline({
            scrollTrigger: {
              trigger: pinRef.current,
              start: "top top",
              end: "+=" + (cards.length * 400 + 300),
              pin: true,
              pinSpacing: true,
              scrub: 1,
              // último pin da página: recalcula depois dos que estão acima
              refreshPriority: 1,
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
      });

      // vertical: os 5 cards passam de uma tela, então não dá para prender a
      // seção — cada um aparece ao entrar na viewport
      mm.add("(max-width: 63.99rem)", () => {
        gsap.from(headerRef.current.children, {
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        });

        cards.forEach((card) => {
          const trigger = {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          };

          // imagem e texto entram separados, como na seção de parceria: o card
          // inteiro de uma vez não dá a sensação de surgimento gradual
          gsap.from(card.querySelector(`.${styles.imagePlaceholder}`), {
            scrollTrigger: trigger,
            opacity: 0,
            y: 40,
            scale: 0.96,
            duration: 0.7,
            ease: "power3.out",
            clearProps: "transform",
          });

          gsap.from(
            card.querySelectorAll(`.${styles.dot}, h3, strong, p`),
            {
              scrollTrigger: trigger,
              opacity: 0,
              y: 24,
              duration: 0.5,
              stagger: 0.15,
              ease: "power3.out",
              clearProps: "transform",
            },
          );
        });
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
