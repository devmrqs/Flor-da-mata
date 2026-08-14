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

// a barra de endereço do celular muda innerHeight e deslocaria os pins no
// meio da rolagem; rotação de tela continua recalculando
ScrollTrigger.config({ ignoreMobileResize: true });

// em toque o ScrollSmoother não suaviza nada (smoothTouch vem desligado), só
// deixa um wrapper fixo sendo transformado — origem do flicker no celular
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
        effects: false, // nenhum elemento usa data-speed/data-lag
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
