# Flor da Mata — Contexto do Projeto

Portfólio de Ângelo (dev júnior, Rio de Janeiro): redesign institucional B2B para a Flor da Mata, distribuidora de produtos naturais onde ele trabalha no setor de produção. Cliente/dono: Márcio. Objetivo: apresentar um protótipo funcional e polido; funcionalidades de backend (formulários, autenticação, histórico de pedidos) são escopo pago separado, caso aceito.

O site cobre duas funções B2B: catálogo de produtos para lojistas, e formulário de candidatura a parceria. Sem e-commerce nem pagamento.

## Identidade visual

- **Paleta:** Olive green `#5D673C`, cream `#FFFEFA`, terracota `#B5713F`
- **Tipografia:** Cormorant Garamond (títulos editoriais), DM Sans (corpo/navegação)
- **Estética:** editorial, quente, artesanal; interações expressivas inspiradas no MindMarket

## Stack

React (Vite), React Router, CSS Modules, GSAP (+ ScrollTrigger, ScrollSmoother)

## Convenções de código

- Nomes de arquivos/componentes/funções em inglês; copy de UI em português
- `rem` para tipografia/espaçamento; `px` só para bordas e sombras
- Ordem de imports: Libraries → Hooks → Data → Components → Assets → CSS
- Componentes como arrow function (padrão `rafce`)
- Commits: Conventional Commits em português imperativo (ex.: `feat: adiciona componente Navbar`)

## Categorias de produto (10)

Chás & Ervas, Grãos e Cereais, Naturais Funcionais, Sementes, Farinhas e Farelos, Soja & Derivados, Elixires Xaropes e Óleos, Cápsulas e Suplementos, Beleza e Cuidados, Snacks e Açúcares

## Arquitetura — decisões importantes

### Imagens de produto
- **Vite não permite importar imagens dentro de arquivos de dados** (`data/products/*.js`) — sempre importar em componentes e mapear por id/slug.
- Sistema atual: `src/utils/productImages.js` usa `import.meta.glob("../assets/images/products/*/*.{jpg,jpeg,png,webp}", { eager: true })`.
- Convenção de pastas: `src/assets/images/products/{categoria-slug}/{produto-slug}-N.jpg`.
- Cada categoria (`data/categories.js`) precisa de `slug` (nome da pasta). Cada produto precisa de `slug` próprio (nome do arquivo). Os dois são independentes e ambos obrigatórios.
- `ProductsList` passa `categorySlug={category.slug}` para `ProductModal`.

### CategoryCarousel
- Auto-scroll via `requestAnimationFrame` (não CSS `@keyframes`, não scroll infinito controlado por JS com `isLocked` — abordagens abandonadas).
- Lista de categorias triplicada para o loop funcionar.
- **Bug histórico ("teletransporte"):** key baseada só em `category.id` ativava 3 cópias simultâneas do card expandido. Fix: key única `${category.id}-${index}`.
- Auto-scroll pausa quando um card é expandido ou modal está aberto.

### ProductModal
- Galeria com thumbnails, seleção de gramagem em cards.
- Bug de renderização resolvido com `clip-path: inset(0 round 28px)` (border-radius sozinho não bastava — problema de subpixel).
- Estado (`selectedWeight`, `activeImage`) inicializado direto no `useState`, não resetado via `useEffect` — usa `key={selectedProduct?.id ?? "closed"}` no componente pai para forçar remount ao trocar de produto (evita o lint `react-hooks/set-state-in-effect`).

### Regra geral de React
Prefira inicializar estado direto no `useState` + usar prop `key` para forçar remount, em vez de `setState` dentro de `useEffect` para resetar estado quando uma prop muda.

## GSAP — padrões e lições aprendidas

Documentação completa das animações em `ANIMATIONS.md` (mesma pasta). Resumo das regras que mais importam:

1. **CSS puro para hovers simples** (cor, scale leve). GSAP só quando há sequenciamento, scroll, ou controle programático fino.
2. **`useGSAP` + `scope`** sempre, para limpeza automática e escopo de seletor.
3. **`clearProps`** ao final de animações cujo estilo inline pode conflitar com `:hover` do CSS depois.
4. **Nunca `pin` e redimensionar (`width`/`height`) o mesmo elemento no ScrollTrigger.** Quebra as medições internas. Solução usada no projeto: pinar um elemento sem redimensioná-lo (só `scale`/`opacity`), deixar o elemento seguinte rolar livremente por cima com `pinSpacing: false`.
5. **`ScrollTrigger.refresh()`** após imagens/layout assíncrono carregarem — sem isso, `start`/`end` podem ser calculados com a página ainda "incompleta", gerando valores de pixel muito menores que o real.
6. **Testar efeitos de scroll complexos isolados** (HTML solto, fora do projeto, com CDN do GSAP) antes de aplicar no código real.
7. **`ScrollSmoother`** exige estrutura `#smooth-wrapper` / `#smooth-content` envolvendo as `Routes` inteiras (ver `App.jsx`), e CSS global específico — `padding-top` da Navbar fixa deve estar no `#smooth-content`, não no `body`.

## Pendências conhecidas

- Chás & Ervas: catálogo ainda incompleto (mais produtos a cadastrar)
- Timeline do About: redesign com cards escalonados no scroll (GSAP) — ainda não iniciado
- Seals do About: redesign pendente (parece footer hoje)
- Hambúrguer da Navbar: sem função (planejado: contato, endereço, Instagram; versão logada futura)
- Responsividade geral: `heroProducts` com `1740px` fixo é dívida técnica conhecida
- Transição animada do CTA → `/seja-parceiro` (DrawSVG, gratuito desde abr/2025)
