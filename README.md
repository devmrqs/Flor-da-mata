<div align="center">
<!-- Sugestão: um banner 1280x400 com a marca nova sobre fundo em tom terroso -->
<img src="./src/assets/images/LogotextoB.svg" alt="Flor da Mata" width="100%" />

# Flor da Mata

**Rebrand e site institucional B2B para uma distribuidora de produtos naturais**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)](https://gsap.com)
[![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)](https://figma.com)

</div>

## Sobre o projeto

Protótipo de redesign institucional para a **Flor da Mata**, distribuidora de produtos naturais. O site cobre duas funções B2B, sem e-commerce nem pagamento:

- **Catálogo de produtos** para lojistas, organizado por categoria
- **Formulário de candidatura a parceria**, para novos lojistas se cadastrarem como revendedores

Funcionalidades de backend (envio real de formulários, autenticação, histórico de pedidos) ficam fora deste protótipo — são escopo pago separado.

## Identidade visual

| Cor                                                                   | Hex       | Uso                              |
| --------------------------------------------------------------------- | --------- | -------------------------------- |
| ![#5D673C](https://placehold.co/16x16/5D673C/5D673C.png) Olive green  | `#5D673C` | cor primária, textos de destaque |
| ![#FFFEFA](https://placehold.co/16x16/FFFEFA/FFFEFA.png?text=+) Cream | `#FFFEFA` | fundo                            |
| ![#B5713F](https://placehold.co/16x16/B5713F/B5713F.png) Terracota    | `#B5713F` | acentos, hover, CTA              |

- **Tipografia:** [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) (títulos editoriais) + [DM Sans](https://fonts.google.com/specimen/DM+Sans) (corpo e navegação)
- **Estética:** editorial, quente, artesanal — interações expressivas inspiradas no [MindMarket](https://mindmarket.com/)

## Stack

- [React](https://react.dev) + [Vite](https://vitejs.dev)
- [React Router](https://reactrouter.com)
- CSS Modules
- [GSAP](https://gsap.com) (`useGSAP`, ScrollTrigger, ScrollSmoother)

### Entrada da Home (Hero)

Timeline única e encadeada: título "A" desce, "NATUREZA" sobe com fade, slogan, botões e seta pulando — cada etapa começa antes da anterior terminar.

<img src="./docs/gifs/hero-entrance.gif" alt="Animação de entrada do Hero na Home" width="100%" />

### Pin revelando o Products

Ao rolar a partir do topo, o Hero fica temporariamente pinado (encolhendo e com fade) enquanto o card de Products sobe naturalmente por cima.

<img src="./docs/gifs/hero-pin-products.gif" alt="Scroll pin do Hero revelando a seção Products" width="100%" />

### Navbar

Links entram com stagger ao carregar a página; hover é CSS puro (cor + leve scale com overshoot).

<img src="./docs/gifs/navbar-entrance.gif" alt="Entrada dos links da Navbar" width="100%" />

### Carrossel de categorias + Modal de produto

Auto-scroll contínuo via `requestAnimationFrame`, pausando ao expandir um card ou abrir o modal de produto.

<img src="./docs/gifs/category-carousel.gif" alt="Auto-scroll do carrossel de categorias e expansão de card, galeria e seleção de gramagem no modal de produto" width="100%" />

### ScrollSmoother

Suavização de scroll aplicada ao site inteiro via `ScrollSmoother`.

<img src="./docs/gifs/scroll-smoother.gif" alt="Scroll suavizado pela página" width="100%" />

## Estrutura de páginas

| Página   | Rota             | Descrição                                      |
| -------- | ---------------- | ---------------------------------------------- |
| Home     | `/`              | Hero animado + destaque de categorias/produtos |
| Products | `/produtos`      | Catálogo completo, filtrado por categoria      |
| About    | `/sobre`         | História da marca, timeline e selos            |
| Partner  | `/seja-parceiro` | Formulário de candidatura a parceria           |

## Categorias de produto

Chás & Ervas · Grãos e Cereais · Naturais Funcionais · Sementes · Farinhas e Farelos · Soja & Derivados · Elixires Xaropes e Óleos · Cápsulas e Suplementos · Beleza e Cuidados · Snacks e Açúcares

## Como rodar localmente

```bash
npm install
npm run dev
```

Outros scripts disponíveis: `npm run build`, `npm run preview`, `npm run lint`.

## Autor

Desenvolvido por **Ângelo Marques Ferreira** — protótipo para a Flor da Mata.
