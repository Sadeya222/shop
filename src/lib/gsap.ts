import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { Observer } from "gsap/Observer";
import { SplitText } from "gsap/SplitText";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Observer, SplitText, ScrollToPlugin);

gsap.defaults({ ease: "power3.out", duration: 0.9 });

/** Singleton holder so the navbar / buttons can drive smooth scrollTo. */
export const smootherStore: { current: ScrollSmoother | null } = { current: null };

export const scrollToSection = (target: string) => {
  const smoother = smootherStore.current;
  if (smoother) {
    smoother.scrollTo(target, true, "top top+=84");
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
};

export { gsap, ScrollTrigger, ScrollSmoother, Observer, SplitText, ScrollToPlugin };
