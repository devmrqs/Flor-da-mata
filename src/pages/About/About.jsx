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
  const block1Ref = useRef(null);
  const block2Ref = useRef(null);
  const centerBlockRef = useRef(null);
  const h1Ref = useRef(null);
  const h2Ref = useRef(null);
  const paragraphRef = useRef(null);
  const imgRef = useRef(null);

  useGSAP(
    () => {
      // Cada bloco de texto entra sozinho, conforme rola até ele — a seção
      // é bem alta (200vh) justamente pra dar esse respiro entre os blocos.
      // O trigger continua sendo o wrapper (com o padding), não o texto em si,
      // pra manter o mesmo ponto de disparo de antes.
      // scrub liga o progresso da revelação direto à posição do scroll — o
      // "end" é o controle de quanto scroll é necessário pra terminar de
      // aparecer (aumenta o "+=N" pra demorar mais, diminui pra ser mais rápido).
      function splitCharsReveal(textEl, triggerEl) {
        SplitText.create(textEl, {
          type: "chars, words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              scrollTrigger: {
                trigger: triggerEl,
                start: "center 40%",
                end: "+=200",
                scrub: 1,
                markers: true,
              },
              opacity: 0,
              y: 24,
              stagger: 0.015,
              ease: "power3.out",
            }),
        });
      }

      splitCharsReveal(h1Ref.current, block1Ref.current);
      splitCharsReveal(h2Ref.current, block2Ref.current);

      // Bloco final (parágrafo + lótus): prende a seção na tela até a
      // animação terminar — o scroll continua sendo "gasto" tocando a
      // revelação (via scrub), e só depois do "end" a página desprende e
      // desce normalmente pro CTA. As duas animações entram na MESMA
      // timeline pra não ter dois pins concorrendo no mesmo trigger.
      SplitText.create(paragraphRef.current, {
        type: "chars, words",
        autoSplit: true,
        onSplit: (self) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: centerBlockRef.current,
              start: "center 40%",
              end: "+=500",
              scrub: 1,
              pin: true,
            },
          });

          tl.from(self.chars, {
            opacity: 0,
            y: 24,
            stagger: 0.015,
            ease: "power3.out",
          }).from(
            imgRef.current,
            { opacity: 0, y: 20, scale: 0.8, ease: "back.out(1.6)" },
            "-=0.2",
          );

          return tl;
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section className={styles.aboutSection} ref={sectionRef}>
      <div className={styles.textBlock} ref={block1Ref}>
        <h1 ref={h1Ref}>
          Há duas décadas, acreditamos que a natureza pode transformar não só o
          que se vende, mas quem vende
        </h1>
      </div>
      <div className={styles.textBlock} ref={block2Ref}>
        <h2 ref={h2Ref}>
          Desde 2006, a Flor da Mata conecta produtores e lojistas por todo o
          Brasil, distribuindo produtos naturais selecionados
        </h2>
      </div>
      <div className={styles.textBlockCenter} ref={centerBlockRef}>
        <p ref={paragraphRef}>
          Mais do que fornecedores, buscamos parceiros que compartilham da mesma
          crença, saúde e natureza como caminho de transformação
        </p>
        <img ref={imgRef} src={lotus} alt="Flor de Lotus" />
      </div>
      {/* <Timeline />
      <Seals /> */}
      <CtaPartnership />
    </section>
  );
};

export default About;
