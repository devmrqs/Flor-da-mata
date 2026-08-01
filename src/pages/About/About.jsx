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
      // Só na rota solo (/sobre) a página abre com esse bloco como primeira
      // coisa na tela — sem ele, ficava em branco até o usuário rolar o
      // bastante pra entrar no pin do texto (que só revela com scroll).
      // Embutido na Home isso não é problema (tem Hero+Products antes), por
      // isso só roda quando isPage. Toca na hora, sem esperar scroll nem a
      // fonte carregar — é um parágrafo simples, não tem SplitText aqui
      // então não sofre do bug de reflow que o resto do componente tem.
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

      // O h1/h2/p usam DM Sans (Google Fonts, display:swap — ver global.css).
      // Se o SplitText mede/quebra as linhas ANTES da fonte terminar de
      // carregar, o texto reflui pra quebras diferentes quando ela troca
      // (FOUT) e os offsets de y já aplicados por char ficam presos na
      // posição antiga — o texto aparece "picotado". "document.fonts.ready"
      // sozinho não é suficiente aqui: ele só espera fontes que o navegador
      // JÁ começou a carregar, e nesse ponto (logo no mount) o DM Sans ainda
      // pode nem ter sido solicitado. "document.fonts.load(...)" força esse
      // carregamento — usa peso 400 (não 200, o peso real do texto) porque
      // o Chromium não casa document.fonts.load() com um peso arbitrário
      // contra uma fonte variável (DM Sans é servida com weight "100 1000",
      // uma faixa); 400 corresponde ao mesmo arquivo variável, então ainda
      // aguarda o download real. contextSafe garante que os tweens criados
      // aqui dentro (fora do corpo síncrono do useGSAP) ainda sejam
      // revertidos certinho quando o componente desmontar.
      //
      // "cancelled" evita rodar o setup() duas vezes: em dev, o StrictMode
      // monta -> limpa -> monta de novo antes da Promise de fonte resolver,
      // e sem essa guarda as DUAS montagens acabam chamando setup() (a
      // limpeza da primeira já rodou antes dela sequer ter criado algo pra
      // reverter), gerando dois SplitText/duas timelines brigando pelos
      // mesmos chars.
      let cancelled = false;
      const setup = contextSafe(() => {
        // Os 3 blocos ficam empilhados na mesma posição (centro da tela) — só
        // um aparece por vez, texto revelado por caractere (SplitText), depois
        // some pra dar lugar ao próximo. Tudo preso (pin) num scroll bem mais
        // curto do que os ~200vh de blocos separados que tinha antes.
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
        // "end" aumentado de 2800 pra 3400 pra abrir espaço extra pro charsIn
        // mais pesado, sem espremer a saída e a pausa de leitura entre blocos.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: pinRef.current,
              start: "top top",
              end: "+=3400",
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
