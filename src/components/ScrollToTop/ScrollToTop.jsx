// Libraries
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollSmoother } from "gsap/ScrollSmoother";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // false = pulo instantâneo, sem o easing do smoother
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
