import { useEffect, useState } from "react";
import { ScrollSmoother, ScrollTrigger, smootherStore } from "./lib/gsap";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import PinnedShowcase from "./components/PinnedShowcase";
import ProductsSlider from "./components/ProductsSlider";
import Calculator from "./components/Calculator";
import WhyUs from "./components/WhyUs";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  const [revealed, setRevealed] = useState(false);
  const [preloaderGone, setPreloaderGone] = useState(false);

  /* Momentum smooth scrolling with overscroll handling + parallax effects */
  useEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.3,
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
    });
    smootherStore.current = smoother;
    smoother.paused(true);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      smoother.kill();
      smootherStore.current = null;
    };
  }, []);

  return (
    <>
      {!preloaderGone && (
        <Preloader
          onReveal={() => {
            smootherStore.current?.paused(false);
            setRevealed(true);
          }}
          onDone={() => setPreloaderGone(true)}
        />
      )}

      <Navbar ready={revealed} />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Hero ready={revealed} />
            <Marquee />
            <PinnedShowcase />
            <ProductsSlider />
            <Calculator />
            <WhyUs />
            <Projects />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
