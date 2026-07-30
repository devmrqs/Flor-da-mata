// Libraries
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Hooks
import { useSvgTransition } from "../../components/SVG/useSvgTransition";

// Components
import Button from "../../components/Button/Button";

// CSS
import styles from "./Partnership.module.css";

gsap.registerPlugin(ScrollTrigger);

// Textos sempre entram de baixo pra cima (padrão usado em Seals/CategoryCarousel);
// as imagens (placeholders) entram da direita pra esquerda, independente do
// lado em que o bloco fica na tela (rows alternadas via .reverse).
const textIn = { opacity: 0, y: 24, duration: 0.5, ease: "power3.out" };
const imageIn = { opacity: 0, x: 100, duration: 0.7, ease: "power3.out" };

const Partnership = ({ isPage = false }) => {
  const sectionRef = useRef(null);
  const { onReveal, isTransitioning } = useSvgTransition();

  useGSAP(
    () => {
      function revealOnScroll(targets, vars, triggerEl) {
        gsap.from(targets, {
          ...vars,
          stagger: vars.stagger ?? 0.1,
          clearProps: "transform",
          scrollTrigger: {
            trigger: triggerEl,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }

      const heroTextTargets = `.${styles.label}, .${styles.hero} h1, .${styles.heroSubtext}`;
      const heroImageTargets = `.${styles.heroImagePlaceholder}`;

      function playHeroReveal() {
        revealOnScroll(heroTextTargets, textIn, `.${styles.hero}`);
        revealOnScroll(heroImageTargets, imageIn, `.${styles.hero}`);
      }

      // Se chegou aqui pela transição do SVG (CTA do About/Products), o
      // "playOut" ainda tá rodando por cima. Precisa esconder o hero JÁ (senão
      // ele fica visível por baixo do SVG encolhendo) e só animar pra dentro
      // quando o "playOut" terminar — por isso usa set+to aqui, não from()
      // (from() capturaria o valor já escondido como destino e não animaria
      // nada). Chegando direto (URL/refresh), não há SVG rodando: revela na
      // hora, do jeito padrão (from + ScrollTrigger).
      let unsubscribe;
      if (isTransitioning.current) {
        gsap.set(heroTextTargets, { opacity: 0, y: 24 });
        gsap.set(heroImageTargets, { opacity: 0, x: 100 });

        unsubscribe = onReveal(() => {
          gsap.to(heroTextTargets, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "transform",
          });
          gsap.to(heroImageTargets, {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
            clearProps: "transform",
          });
        });
      } else {
        playHeroReveal();
      }

      // Motivos
      revealOnScroll(
        `.${styles.reasons} > .${styles.sectionLabel}`,
        textIn,
        `.${styles.reasons}`,
      );

      gsap.utils.toArray(`.${styles.reasonRow}`).forEach((row) => {
        revealOnScroll(
          row.querySelectorAll(
            `.${styles.reasonNumber}, .${styles.reasonText} h3, .${styles.reasonText} p`,
          ),
          { ...textIn, stagger: 0.2 },
          row,
        );
        revealOnScroll(
          row.querySelector(`.${styles.reasonImagePlaceholder}`),
          imageIn,
          row,
        );
      });

      // Como funciona + Formulário
      revealOnScroll(
        `.${styles.applyIntro} > *`,
        textIn,
        `.${styles.applyBlock}`,
      );
      revealOnScroll(
        `.${styles.form} > *`,
        { ...textIn, stagger: 0.2 },
        `.${styles.applyBlock}`,
      );

      // Contato
      revealOnScroll(
        `.${styles.contactBlock} > p`,
        textIn,
        `.${styles.contactBlock}`,
      );

      return () => unsubscribe?.();
    },
    { scope: sectionRef },
  );

  return (
    <section
      className={`${styles.partnership} ${isPage ? styles.partnershipPage : ""}`}
      ref={sectionRef}
    >
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.label}>Quer fazer parte da</p>
          <h1>Flor da Mata?</h1>
          <p className={styles.heroSubtext}>
            Leve os produtos Flor da Mata para a sua loja e faça parte de uma
            rede que já leva natureza e qualidade a lojistas por todo o Brasil.
          </p>
        </div>
        <div className={styles.heroImagePlaceholder} />
      </div>

      {/* Motivos — blocos assimétricos alternados */}
      <div className={styles.reasons}>
        <p className={styles.sectionLabel}>Por que ser parceiro?</p>

        <div className={styles.reasonRow}>
          <span className={styles.reasonNumber}>01</span>
          <div className={styles.reasonText}>
            <h3>Preços especiais</h3>
            <p>
              Condições comerciais pensadas para quem revende, não para o
              consumidor final.
            </p>
          </div>
          <div className={styles.reasonImagePlaceholder} />
        </div>

        <div className={`${styles.reasonRow} ${styles.reverse}`}>
          <span className={styles.reasonNumber}>02</span>
          <div className={styles.reasonImagePlaceholder} />
          <div className={styles.reasonText}>
            <h3>Catálogo completo</h3>
            <p>
              10 categorias de produtos naturais selecionados, de chás a
              suplementos.
            </p>
          </div>
        </div>

        <div className={styles.reasonRow}>
          <span className={styles.reasonNumber}>03</span>
          <div className={styles.reasonText}>
            <h3>Tradição e confiança</h3>
            <p>
              Duas décadas de experiência conectando produtores e lojistas por
              todo o país.
            </p>
          </div>
          <div className={styles.reasonImagePlaceholder} />
        </div>

        <div className={`${styles.reasonRow} ${styles.reverse}`}>
          <span className={styles.reasonNumber}>04</span>
          <div className={styles.reasonImagePlaceholder} />
          <div className={styles.reasonText}>
            <h3>Suporte próximo</h3>
            <p>
              Um time pronto para apresentar produtos e condições assim que seu
              cadastro for aprovado.
            </p>
          </div>
        </div>
      </div>

      {/* Como funciona + Formulário */}
      <div className={styles.applyBlock}>
        <div className={styles.applyIntro}>
          <p className={styles.sectionLabel}>Como funciona</p>
          <h2>Um processo simples e cuidadoso</h2>
          <p className={styles.applyText}>
            Cada parceria é construída com cuidado — por isso, analisamos todo
            cadastro com atenção antes de darmos o próximo passo juntos. Esse
            canal é exclusivo para pessoa jurídica, com condições comerciais
            especiais e pedido mínimo.
          </p>
        </div>

        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Nome" required />
          <input type="email" placeholder="E-mail" required />
          <input type="tel" placeholder="Telefone" required />
          <input type="text" placeholder="CNPJ" required />
          <Button
            label="Enviar cadastro"
            variant="primary"
            icon="arrow"
            size="small"
          />
        </form>
      </div>

      {/* Contato */}
      <div className={styles.contactBlock}>
        <p>Alguma dúvida antes de começar?</p>
        <p>
          Fale com a gente em{" "}
          <a href="mailto:flordamatacontato@devmrqs.com">
            flordamatacontato@devmrqs.com
          </a>{" "}
          ou pelo telefone <strong>(21) XXXXX-XXXX</strong>, de segunda a sexta,
          das 8h às 17h30.
        </p>
        <p>
          Ou nos siga no Instagram <a>@flordamata</a>
        </p>
      </div>
    </section>
  );
};

export default Partnership;
