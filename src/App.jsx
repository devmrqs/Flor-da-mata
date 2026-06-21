// Libraries
import { BrowserRouter, Routes, Route } from "react-router-dom";

// CSS
import styles from "./App.module.css";

// Components
import Navbar from "./components/Navbar/Navbar";

// Pages:
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Products from "./pages/Products/Products";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className={styles.containerHeader}>
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Products isPage />} />
        <Route path="/sobre" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
