# Animações GSAP — Flor da Mata

Documento de referência rápida para as animações GSAP implementadas no projeto. Cada seção explica o efeito, os arquivos envolvidos, e o raciocínio por trás das decisões técnicas.

---

## 1. Button — hover "engolindo" o texto

**Arquivo:** `src/components/Button/Button.jsx`

**Efeito:** ao passar o mouse, o texto encolhe até sumir, o espaçamento fecha, e o círculo da seta cresce até preencher o botão inteiro (variante `primary`).

**Mecânica:**
- `useRef()` em cada parte animada: `btnRef`, `arrowWrapperRef`, `textRef`, `spacerRef`.
- `playEnterAnimation()` / `playLeaveAnimation()`: duas funções nomeadas, separando claramente entrada e saída.
- No hover, três animações em paralelo:
  1. Texto e spacer encolhem (`width: 0`, `opacity: 0`, `margin: 0`) — libera espaço real no layout, não só esconde visualmente.
  2. `gap` do botão fecha (`gap: 0`).
  3. Círculo da seta ganha `flexGrow: 1` — como é item de um container `flex`, ele toma o espaço liberado automaticamente.
- `gsap.killTweensOf()` no início de cada função: evita que hovers rápidos (entra/sai/entra) criem animações conflitantes.
- `clearProps` nos callbacks `onComplete`: remove o estilo inline que o GSAP grava, devolvendo controle ao CSS.
- Constantes no topo do arquivo (`DURATION_MAIN`, `EASE_MAIN`, `EASE_SOFT`) centralizam os valores de timing.

**Lição:** `flexGrow` é preferível a `width` fixo quando o tamanho final depende do espaço liberado por elementos vizinhos — deixa o próprio Flexbox calcular.

---

## 2. Navbar — entrada dos links + hover

**Arquivo:** `src/components/Navbar/Navbar.jsx`, `Navbar.module.css`

**Entrada (ao carregar a página):**
- `useGSAP()` com `scope: navRef`.
- `gsap.from()` nos links (seletor `` `.${styles.link}` ``), vindo de `x: 30, opacity: 0` até a posição normal — simula "saem de trás do hambúrguer".
- `stagger: 0.12`: cada link entra um pouco depois do anterior.
- `clearProps: "transform"`: sem isso, o `:hover` em CSS não conseguia sobrescrever o `transform` que o GSAP deixa gravado como estilo inline (prioridade de CSS).

**Hover dos links — CSS puro, não GSAP:**
```css
.link {
  transition:
    color 0.3s ease,
    transform 0.35s cubic-bezier(0.34, 1.2, 0.64, 1);
}

.link:hover {
  color: #b5713f;
  transform: scale(1.06);
}
```
Decisão consciente: hover simples (cor + leve scale) não precisa da robustez do GSAP. A curva `cubic-bezier` customizada dá a sensação de "crescimento orgânico" (leve overshoot antes de assentar).

---

## 3. Home — entrada do Hero

**Arquivo:** `src/pages/Home/Home.jsx`, `Home.module.css`

**Timeline única, com sobreposição entre etapas:**
```
"A" desce (y: -30 → 0)
  → "-=0.3" → NATUREZA sobe com fade
    → "-=0.4" → Slogan sobe com fade
      → "-=0.3" → Botões sobem juntos (sem stagger entre eles)
        → "-=0.2" → "Nossos produtos" + seta sobem
```
Os valores negativos (`"-=0.3"`) fazem cada etapa começar antes da anterior terminar — cria fluidez em vez de pausas secas entre elementos.

**Seta pulando (loop contínuo):**
```javascript
gsap.to(arrowRef.current, {
  y: 4,
  duration: 0.5,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  delay: 1.5, // só começa depois que a entrada termina
});
```
`yoyo: true` faz o movimento ir e voltar suavemente, em vez de "pular" de volta ao início.

**Bug resolvido:** o wrapper do `NaturezaText` precisava de `display: flex` (não `display: contents`) — elementos com `display: contents` não geram uma "caixa" visual própria, então `opacity`/`transform` do GSAP não tinham efeito nele.

---

## 4. Home — pin revelando o Products

**Arquivo:** `src/pages/Home/Home.jsx`

**Efeito:** ao rolar a partir do topo, a seção Hero da Home fica temporariamente presa na tela (com leve encolhimento e fade), enquanto o card verde do Products sobe naturalmente por cima dela.

```javascript
tl.eventCallback("onComplete", () => {
  const pinTl = gsap.timeline({
    scrollTrigger: {
      trigger: heroRef.current,
      start: "top top",
      end: "+=100%",
      pin: true,
      pinSpacing: false,
      scrub: 0.8,
      invalidateOnRefresh: true,
    },
  });

  pinTl.to(heroRef.current, {
    scale: 0.92,
    opacity: 0.6,
    ease: "none",
    duration: 0.85,
  });

  ScrollTrigger.refresh();
});
```

**Decisões-chave:**
- `pinSpacing: false`: não reserva espaço extra após o pin soltar — permite que o Products (seção seguinte) role livremente por cima da Home pinada, em vez de esperar.
- `pin` só é criado **depois** que a timeline de entrada termina (`tl.eventCallback("onComplete", ...)`) — evita que duas animações de opacidade no mesmo elemento (entrada + pin) brigem entre si ao mesmo tempo.
- `scrub: 0.8` (não `true`): dá uma leve suavização/inércia ao movimento, em vez de travar exatamente no pixel do scroll.
- `Products.jsx` não tem nenhum código GSAP — o efeito inteiro é resolvido do lado da Home, sem precisar redimensionar o card verde.

**Lição mais importante da sessão:** nunca `pin` e animar `width`/`height` no mesmo elemento simultaneamente — isso quebra as medições internas do ScrollTrigger (o aviso da própria documentação do GSAP). A solução foi pinar a Home (sem redimensionar, só `scale`/`opacity`) e deixar o Products rolar por cima dela naturalmente, sem manipulação de tamanho em nenhum dos dois lados.

**Bugs anteriores descartados** (para referência futura, caso o efeito precise de retrabalho):
- Elemento com `position: fixed` **dentro** de um elemento pinado: o `transform` que o ScrollTrigger aplica no wrapper pinado vira o novo *containing block*, quebrando o `fixed` do filho.
- `start`/`end` calculados antes das imagens terminarem de carregar, resultando em valores de pixel muito menores que o real (ex.: `start: 183` quando deveria ser `800+`). Corrigido com `ScrollTrigger.refresh()` após o carregamento estabilizar.

---

## 5. ScrollSmoother — suavização do scroll do site inteiro

**Arquivo:** `src/App.jsx`, CSS global (`index.css`)

```javascript
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

useGSAP(() => {
  smootherRef.current = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.2,
    effects: true,
  });

  ScrollTrigger.refresh();

  return () => smootherRef.current?.kill();
}, []);
```

```jsx
<div id="smooth-wrapper">
  <div id="smooth-content">
    <Routes>...</Routes>
  </div>
</div>
```

**CSS global obrigatório:**
```css
#smooth-wrapper {
  overflow: hidden;
}

#smooth-content {
  overflow: visible;
  width: 100%;
  padding-top: 125px; /* espaço para a Navbar fixa */
}
```

**Bugs resolvidos:**
- `html, body { height: 100%; }` cortava o fim da página — o `ScrollSmoother` precisa que o `body` tenha a altura real do conteúdo inteiro para calcular corretamente até onde rolar. Removido.
- `padding-top` estava no `body`, mas como `#smooth-wrapper` vira `position: fixed` (ignorando padding do pai), o respiro para a Navbar sumiu. Movido para dentro do `#smooth-content`.
- A Navbar (já `position: fixed`) ficou **fora** do `#smooth-wrapper` — não precisa participar do sistema de scroll suavizado.

---

## Princípios gerais aprendidos

1. **CSS puro quando possível.** Hover simples (cor, scale leve) não precisa de GSAP — reserve a biblioteca para sequenciamento complexo, scroll, ou controle programático fino.
2. **`useGSAP` + `scope`** evita vazamento de memória e limita a busca por seletores ao container certo.
3. **`clearProps`** é essencial sempre que uma animação GSAP precisa "devolver" o controle ao CSS (ex.: para um `:hover` funcionar depois de uma animação de entrada).
4. **Nunca pin + redimensionar o mesmo elemento.** Separe: um elemento fica fixo/pinado sem mudar de tamanho, outro (diferente) anima livremente.
5. **`ScrollTrigger.refresh()`** depois que imagens/layout assíncrono terminam de carregar evita cálculos de posição errados.
6. **Testar efeitos de scroll complexos isolados** (HTML simples, fora do projeto) antes de aplicar no código real — economiza tempo de debug quando múltiplas variáveis (Navbar, outras animações, CSS Modules) competem ao mesmo tempo.
