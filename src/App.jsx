import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import styles from "./App.module.css";

function App() {
  return (
    <BrowserRouter>
      <div className={styles.containerHeader}>
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
