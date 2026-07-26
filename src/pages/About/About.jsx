// Libraries
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Components
import Timeline from "../../components/Timeline/Timeline";
import Seals from "../../components/Seals/Seals";
import CtaPartnership from "../../components/CtaPartnership/CtaPartnership";

// Assets
import lotus from "../../assets/images/LotusFlower.svg";

// CSS
import styles from "./About.module.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

const About = () => {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const h1Ref = useRef(null);
  const h2Ref = useRef(null);
  const paragraphRef = useRef(null);
  const imgRef = useRef(null);

  useGSAP(
    () => {
      // Os 3 blocos ficam empilhados na mesma posição (centro da tela) — só
      // um aparece por vez, texto revelado por caractere (SplitText), depois
      // some pra dar lugar ao próximo. Tudo preso (pin) num scroll bem mais
      // curto do que os ~200vh de blocos separados que tinha antes.
      const split1 = SplitText.create(h1Ref.current, { type: "chars, words" });
      const split2 = SplitText.create(h2Ref.current, { type: "chars, words" });
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
        stagger: 0.015,
        duration: 0.4,
        ease: "power3.out",
      };
      // Como a timeline inteira é presa ao scroll (scrub), a duração real
      // de cada trecho é o quanto de scroll o usuário faz naquele pedaço —
      // não segundos de verdade. Com charsOut do mesmo tamanho do charsIn,
      // um scroll rápido normal cobria a fatia inteira da saída em poucos
      // px, então ela sempre parecia "sumir" de vez, não importa a easing.
      // Deixando a saída bem mais longa (duration/stagger maiores) que a
      // entrada, ela passa a ocupar uma fatia bem maior do scroll total —
      // mesmo scrollando rápido, dá tempo de ver o texto se dissolvendo.
      const charsOut = {
        opacity: 0,
        y: -20,
        stagger: 0.02,
        duration: 0.8,
        ease: "sine.inOut",
      };

      // pinSpacing precisa ser explícito nesse projeto — sem isso o pin só
      // reserva a altura natural do wrapper, ignorando o "end" pedido.
      // "end" aumentado de 2200 pra 2800 pra abrir espaço extra pro charsOut
      // mais longo, sem espremer a entrada e a pausa de leitura entre blocos.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top top",
            end: "+=2800",
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
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.6)" },
          "-=0.2",
        );
    },
    { scope: sectionRef },
  );

  return (
    <section className={styles.aboutSection} ref={sectionRef}>
      <div className={styles.introPin} ref={pinRef}>
        <div className={styles.introBlock}>
          <h1 ref={h1Ref}>
            Há duas décadas, acreditamos que a natureza pode transformar não só
            o que se vende, mas quem vende
          </h1>
        </div>
        <div className={styles.introBlock}>
          <h2 ref={h2Ref}>
            Desde 2006, a Flor da Mata conecta produtores e lojistas por todo
            o Brasil, distribuindo produtos naturais selecionados
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
      {/* <Seals /> */}
      <CtaPartnership />
    </section>
  );
};

export default About;
