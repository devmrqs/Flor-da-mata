// slug é o identificador único do produto (usado como key e pra achar as
// imagens em src/assets/images/products/{categoria}/{slug}-N.jpg) — não
// precisa de um "id" numérico separado.
export default [
  {
    slug: "cha-de-alcachofra",
    name: "Alcachofra",
    shortDescription:
      "O chá de alcachofra é uma bebida medicinal feita a partir das folhas e talo da planta Cynara Scolymus.",
    description:
      "O chá de Alcachofra serve principalmente para auxiliar a digestão, estimular a produção de bile no fígado e ajudar no controle do colesterol.",
    weights: ["20g", "100g"],
    details: {
      origem: "Brasil",
      tipo: "Folha e Talo",
      armazenamento: "Conservar em local fresco, seco e ao abrigo da luz.",
    },
  },
  {
    slug: "cha-de-alcachofra",
    name: "Alcachofra",
    shortDescription:
      "O chá de alcachofra é uma bebida medicinal feita a partir das folhas e talo da planta Cynara Scolymus.",
    description:
      "O chá de Alcachofra serve principalmente para auxiliar a digestão, estimular a produção de bile no fígado e ajudar no controle do colesterol.",
    weights: ["20g", "150g"],
    details: {
      origem: "Brasil",
      tipo: "Folha e Talo",
      armazenamento: "Conservar em local fresco, seco e ao abrigo da luz.",
    },
  },
];
