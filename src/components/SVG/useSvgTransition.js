import { createContext, useContext } from "react";

export const SvgTransitionContext = createContext(null);

export const useSvgTransition = () => {
  const ctx = useContext(SvgTransitionContext);
  if (!ctx) {
    throw new Error(
      "useSvgTransition precisa ser usado dentro de um SvgTransitionProvider",
    );
  }
  return ctx;
};
