// Libraries
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// CSS
import styles from "./App.module.css";

// Components
import Navbar from "./components/Navbar/Navbar";
import { SvgTransitionProvider } from "./components/SVG/SvgTransition";

// Pages:
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Products from "./pages/Products/Products";
import Partnership from "./pages/Partner/Partnership";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Em aparelhos de toque o ScrollSmoother já não suaviza nada (smoothTouch vem
// desligado por padrão), mas mantém um wrapper position: fixed sendo
// transformado. Esse wrapper brigando com o scroll nativo — e com o pin do
// hero — é o que causava o flicker no celular. Sem ele, a página rola no body.
const IS_TOUCH_ONLY = window.matchMedia(
  "(hover: none) and (pointer: coarse)",
).matches;

function App() {
  const smootherRef = useRef(null);

  useGSAP(() => {
    if (!IS_TOUCH_ONLY) {
      smootherRef.current = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.2,
        // nenhum elemento usa data-speed/data-lag: ligado, só varre o DOM à toa
        effects: false,
      });
    }

    ScrollTrigger.refresh();

    // refaz o cálculo de start/end quando as imagens terminarem de carregar
    const refreshOnLoad = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") {
      refreshOnLoad();
    } else {
      window.addEventListener("load", refreshOnLoad);
    }

    return () => {
      window.removeEventListener("load", refreshOnLoad);
      smootherRef.current?.kill();
    };
  }, []);

  return (
    <BrowserRouter>
      <SvgTransitionProvider>
        <ScrollToTop />
        <div className={styles.containerHeader}>
          <Navbar />
        </div>
        <div id="smooth-wrapper" data-smooth={IS_TOUCH_ONLY ? "off" : "on"}>
          <div id="smooth-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/produtos" element={<Products isPage />} />
              <Route path="/sobre" element={<About isPage />} />
              <Route path="/seja-parceiro" element={<Partnership />} />
            </Routes>
          </div>
        </div>
      </SvgTransitionProvider>
    </BrowserRouter>
  );
}

export default App;
