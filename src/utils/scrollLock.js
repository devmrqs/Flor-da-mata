import { ScrollSmoother } from "gsap/ScrollSmoother";

// Contador porque as travas se aninham: o ProductModal abre por dentro do
// CategorySheet, e fechar o de cima não pode destravar a página com o de
// baixo ainda aberto.
let lockCount = 0;

// Com o ScrollSmoother ligado basta pausá-lo. Em aparelhos de toque ele nem
// é criado (ver App.jsx), então a trava vai no overflow do documento.
export function lockScroll() {
  lockCount += 1;
  if (lockCount > 1) return;

  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.paused(true);
    return;
  }

  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
}

export function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;

  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.paused(false);
    return;
  }

  document.documentElement.style.overflow = "";
  document.body.style.overflow = "";
}
