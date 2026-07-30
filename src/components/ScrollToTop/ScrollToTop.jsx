// Libraries
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollSmoother } from "gsap/ScrollSmoother";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Com o ScrollSmoother ativo, "window.scrollTo" muda a posição real do
    // scroll na hora, mas o smoother anima (com o "smooth" configurado) até
    // lá em vez de pular direto — daí a página parecer "subir" sozinha
    // depois de trocar de rota. O segundo argumento "false" força o pulo
    // instantâneo, sem easing.
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.scrollTo(0, false);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
