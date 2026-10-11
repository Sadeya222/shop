import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import Logo from "./ui/Logo";

type Props = {
  onReveal: () => void;
  onDone: () => void;
};

/** Bright solar-yellow brand loader with the official logo, counter + curtain lift. */
export default function Preloader({ onReveal, onDone }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const counter = { v: 0 };

    const tl = gsap.timeline({
      defaults: { ease: "power4.out" },
      onComplete: onDone,
    });

    tl.fromTo(".pre-logo", { scale: 0.6, opacity: 0, y: 30 }, { scale: 1, opacity: 1, y: 0, duration: 1.1, ease: "back.out(1.5)" }, 0.15)
      .fromTo(".pre-tag", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7 }, 0.85)
      .to(
        counter,
        {
          v: 100,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: () => {
            if (countRef.current) countRef.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        },
        0.4
      )
      .fromTo(".pre-bar-fill", { scaleX: 0 }, { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0.4)
      // Hand over to the hero just as the curtain starts lifting
      .call(() => onReveal(), undefined, "+=0.1")
      .to(root, { yPercent: -100, duration: 0.95, ease: "power4.inOut" }, "+=0.05");

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={rootRef} className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-solar px-6">
      <div className="pre-logo rounded-[2rem] bg-canvas px-8 py-6 shadow-2xl shadow-forest/25 sm:px-10 sm:py-7">
        <Logo imgClassName="h-12 sm:h-16" />
      </div>

      <p className="pre-tag mt-8 text-center text-xs font-bold uppercase tracking-[0.35em] text-forest/60">
        Power your life with sunlight
      </p>

      <div className="mt-10 flex w-56 flex-col items-center gap-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-forest/15">
          <div className="pre-bar-fill h-full w-full origin-left rounded-full bg-forest" />
        </div>
        <span ref={countRef} className="font-display text-sm font-semibold tabular-nums text-forest/70">
          000
        </span>
      </div>
    </div>
  );
}
