// Libraries
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Components
import Timeline from "../../components/Timeline/Timeline";
import CtaPartnership from "../../components/CtaPartnership/CtaPartnership";

// Assets
import lotus from "../../assets/images/LotusFlower.svg";
import arrowEndding from "../../assets/images/arrowEndding.svg";

// CSS
import styles from "./About.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const About = ({ isPage = false }) => {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const h1Ref = useRef(null);
  const h2Ref = useRef(null);
  const paragraphRef = useRef(null);
  const imgRef = useRef(null);
  const pageHeroRef = useRef(null);
  const pageHeroArrowRef = useRef(null);

  useGSAP(
    (_context, contextSafe) => {
      // só na rota solo (/sobre) — evita tela em branco antes do scroll
      if (isPage) {
        gsap.from(pageHeroRef.current.children, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.12,
          delay: 0.2,
          ease: "power3.out",
        });

        gsap.to(pageHeroArrowRef.current, {
          y: 6,
          duration: 0.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1,
        });
      }

      // espera a fonte carregar de verdade antes do SplitText medir (evita FOUT/reflow)
      // cancelled evita rodar o setup duas vezes (StrictMode monta/limpa/monta)
      let cancelled = false;
      const setup = contextSafe(() => {
        // 3 blocos empilhados no centro, revelados um por vez (char a char) e presos via pin
        const split1 = SplitText.create(h1Ref.current, {
          type: "chars, words",
        });
        const split2 = SplitText.create(h2Ref.current, {
          type: "chars, words",
        });
        const split3 = SplitText.create(paragraphRef.current, {
          type: "chars, words",
        });

        gsap.set([split1.chars, split2.chars, split3.chars], {
          opacity: 0,
          y: 24,
        });
        gsap.set(imgRef.current, { opacity: 0, y: 20, scale: 0.8 });

        const charsIn = {
          opacity: 1,
          y: 0,
          stagger: 0.025,
          duration: 0.65,
          ease: "power3.out",
        };
        // saída mais longa que a entrada, senão some rápido demais no scrub
        const charsOut = {
          opacity: 0,
          y: -20,
          stagger: 0.02,
          duration: 0.8,
          ease: "sine.inOut",
        };

        // pinSpacing explícito, senão o pin ignora o "end" pedido
        gsap
          .timeline({
            scrollTrigger: {
              trigger: pinRef.current,
              start: "top top",
              // proporcional à tela: 3400px fixos eram ~3,6 telas no desktop,
              // mas viravam 5 telas de rolagem num celular
              end: () => "+=" + window.innerHeight * 3.6,
              invalidateOnRefresh: true,
              pin: true,
              pinSpacing: true,
              scrub: 1,
            },
          })
          .to(split1.chars, charsIn)
          .to(split1.chars, charsOut, "+=0.5")
          .to(split2.chars, charsIn)
          .to(split2.chars, charsOut, "+=0.5")
          .to(split3.chars, charsIn)
          .to(
            imgRef.current,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.4,
              ease: "back.out(1.6)",
            },
            "-=0.2",
          );

        ScrollTrigger.refresh();
      });

      Promise.all([
        document.fonts.load('1rem "DM Sans"'),
        document.fonts.ready,
      ]).then(() => {
        if (!cancelled) setup();
      });

      return () => {
        cancelled = true;
      };
    },
    { scope: sectionRef },
  );

  return (
    <section className={styles.aboutSection} ref={sectionRef}>
      {isPage && (
        <div className={styles.pageHero} ref={pageHeroRef}>
          <p className={styles.pageHeroLabel}>Sobre nós</p>
          <p className={styles.pageHeroText}>
            Role para conhecer a jornada da Flor da Mata
          </p>
          <img ref={pageHeroArrowRef} src={arrowEndding} alt="" />
        </div>
      )}

      <div className={styles.introPin} ref={pinRef}>
        <div className={styles.introBlock}>
          <h1 ref={h1Ref}>
            Há duas décadas, acreditamos que a natureza pode transformar não só
            o que se vende, mas quem vende
          </h1>
        </div>
        <div className={styles.introBlock}>
          <h2 ref={h2Ref}>
            Desde 2006, a Flor da Mata conecta produtores e lojistas por todo o
            Brasil, distribuindo produtos naturais selecionados
          </h2>
        </div>
        <div className={styles.introBlock}>
          <p ref={paragraphRef}>
            Mais do que fornecedores, buscamos parceiros que compartilham da
            mesma crença, saúde e natureza como caminho de transformação
          </p>
          <img ref={imgRef} src={lotus} alt="Flor de Lotus" />
        </div>
      </div>

      <Timeline />
      <CtaPartnership />
    </section>
  );
};

export default About;
