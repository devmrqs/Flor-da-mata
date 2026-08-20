// slug identifica o produto e localiza suas imagens (products/{categoria}/{slug}-N.jpg)
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
    slug: "cha-de-camomila",
    name: "Camomila",
    shortDescription:
      "O chá de camomila é uma bebida calmante feita a partir das flores secas da planta Matricaria chamomilla.",
    description:
      "O chá de Camomila serve principalmente para promover o relaxamento, melhorar a qualidade do sono, aliviar cólicas e ajudar na redução da ansiedade.",
    weights: ["20g", "100g"],
    details: {
      origem: "Europa e Ásia",
      tipo: "Flor",
      armazenamento: "Conservar em local fresco, seco e ao abrigo da luz.",
    },
  },
];
