// Components
import Button from "../../components/Button/Button";

// CSS
import styles from "./Partnership.module.css";

const Partnership = ({ isPage = false }) => {
  return (
    <section
      className={`${styles.partnership} ${isPage ? styles.partnershipPage : ""}`}
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
              Quase duas décadas de experiência conectando produtores e lojistas
              por todo o país.
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
