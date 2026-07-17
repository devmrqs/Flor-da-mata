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

// Pages:
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Products from "./pages/Products/Products";
import Partnership from "./pages/Partner/Partnership";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

function App() {
  const smootherRef = useRef(null);

  useGSAP(() => {
    smootherRef.current = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.2,
      effects: true,
    });

    ScrollTrigger.refresh();

    return () => {
      smootherRef.current?.kill();
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className={styles.containerHeader}>
        <Navbar />
      </div>
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/produtos" element={<Products isPage />} />
            <Route path="/sobre" element={<About />} />
            <Route path="/seja-parceiro" element={<Partnership />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
