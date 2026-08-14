import { ScrollSmoother } from "gsap/ScrollSmoother";

// as travas se aninham: o ProductModal abre por dentro do CategorySheet
let lockCount = 0;

// em toque o ScrollSmoother nem é criado (ver App.jsx): cai no overflow
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
