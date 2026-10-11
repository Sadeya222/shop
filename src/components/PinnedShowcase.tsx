import { useEffect, useRef } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { gsap, Observer, ScrollTrigger, scrollToSection, smootherStore } from "../lib/gsap";
import { SOLUTIONS } from "../lib/data";
import { cn } from "../utils/cn";
import SectionHeader from "./ui/SectionHeader";

/**
 * GSAP pinned panels with overscroll feedback.
 * - Panels lock/pin and the next slides over with scrubbed inertia (ScrollSmoother momentum).
 * - Velocity skew gives fluid "elastic" feedback while scrolling through the pin.
 * - Observer detects overscroll past the pin bounds and springs the stack elastically.
 */
export default function PinnedShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const observerRef = useRef<Observer | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".showcase-panel");
      const total = panels.length;
      const pinDistance = () => `+=${(total - 1) * 115}%`;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: pinDistance,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const active = Math.round(self.progress * (total - 1));
            dotsRef.current?.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("dot-active", i === active));
          },
        },
      });
      stRef.current = tl.scrollTrigger ?? null;

      panels.forEach((panel, i) => {
        if (i === 0) return;
        const prev = panels[i - 1];
        const img = panel.querySelector(".panel-img");
        tl.fromTo(panel, { yPercent: 100 }, { yPercent: 0, ease: "none", duration: 1 })
          .fromTo(prev, { scale: 1 }, { scale: 0.93, ease: "none", duration: 1, transformOrigin: "center center" }, "<")
          .fromTo(
            prev.querySelector(".panel-inner"),
            { opacity: 1 },
            { opacity: 0.25, ease: "none", duration: 1 },
            "<"
          );
        if (img) {
          tl.fromTo(img, { yPercent: 14, scale: 1.18 }, { yPercent: -8, scale: 1.04, ease: "none", duration: 1 }, "<");
        }
      });

      /* Overscroll feedback #1 — velocity-driven elastic skew (GSAP proxy technique) */
      const stack = stackRef.current!;
      const proxy = { skew: 0 };
      const skewSetter = gsap.quickSetter(stack, "skewY", "deg");
      const clampSkew = gsap.utils.clamp(-5, 5);
      ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: pinDistance,
        onUpdate: (self) => {
          const skew = clampSkew(self.getVelocity() / -450);
          if (Math.abs(skew) > Math.abs(proxy.skew)) {
            proxy.skew = skew;
            gsap.to(proxy, {
              skew: 0,
              duration: 0.9,
              ease: "power3",
              overwrite: true,
              onUpdate: () => skewSetter(proxy.skew),
            });
          }
        },
      });

      /* Overscroll feedback #2 — elastic bounce when scrolling past the pin bounds */
      const bounce = (dir: number) => {
        if (gsap.isTweening(stack)) return;
        gsap.fromTo(stack, { skewY: dir * 2.4 }, { skewY: 0, duration: 1.2, ease: "elastic.out(1, 0.32)" });
      };
      observerRef.current = Observer.create({
        target: window,
        type: "wheel,touch",
        allowClicks: true,
        preventDefault: false,
        onChangeY: (self) => {
          const st = stRef.current;
          if (!st) return;
          if (st.progress >= 0.995 && self.deltaY > 0) bounce(1);
          else if (st.progress <= 0.005 && self.deltaY < 0) bounce(-1);
        },
      });
    }, sectionRef);

    return () => {
      observerRef.current?.kill();
      ctx.revert();
    };
  }, []);

  const goToPanel = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    const y = st.start + (st.end - st.start) * (i / (SOLUTIONS.length - 1));
    smootherStore.current?.scrollTo(y, true);
  };

  return (
    <section id="solutions" ref={sectionRef} className="relative">
      <div className="mx-auto max-w-7xl px-5 pb-14 pt-24 sm:px-8 lg:pt-32">
        <SectionHeader
          eyebrow="What we build"
          title="Solar solutions for every scale"
          copy="Four crafts, one obsession — turning daylight into dependable, beautifully engineered power."
        />
      </div>

      <div ref={pinRef} className="relative h-screen overflow-hidden">
        <div ref={stackRef} className="h-full will-change-transform">
          {SOLUTIONS.map((s) => (
            <article
              key={s.id}
              className="showcase-panel absolute inset-0 overflow-hidden"
              style={{ backgroundColor: s.bg }}
            >
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -bottom-8 right-0 select-none font-display text-[26vw] font-bold leading-none lg:text-[17vw]",
                  s.dark ? "text-outline-canvas" : "text-outline-forest"
                )}
              >
                {s.index}
              </span>

              <div className="panel-inner mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-8 px-5 pb-24 pt-24 sm:px-8 lg:grid-cols-2 lg:gap-14">
                <div className={cn("relative z-10", s.dark ? "text-canvas" : "text-forest")}>
                  <p
                    className={cn(
                      "flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em]",
                      s.dark ? "text-grass" : "text-grass-600"
                    )}
                  >
                    <span className={cn("h-px w-8", s.dark ? "bg-grass" : "bg-grass-600")} />
                    {s.index} — {s.kicker}
                  </p>
                  <h3 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance sm:text-5xl lg:text-[3.3rem]">
                    {s.title}
                  </h3>
                  <p className={cn("mt-5 max-w-md text-base leading-relaxed sm:text-lg", s.dark ? "text-canvas/70" : "text-forest/70")}>
                    {s.description}
                  </p>
                  <ul className="mt-7 space-y-3">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3">
                        <span
                          className={cn(
                            "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                            s.dark ? "bg-grass text-forest" : "bg-forest text-grass"
                          )}
                        >
                          <Check className="size-3" strokeWidth={3.5} />
                        </span>
                        <span className={cn("text-sm font-medium sm:text-base", s.dark ? "text-canvas/85" : "text-forest/80")}>
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-6">
                    <div className={cn("rounded-2xl px-5 py-3.5", s.dark ? "bg-canvas/10" : "border border-forest/10 bg-white/70")}>
                      <p className="font-display text-2xl font-semibold">{s.statValue}</p>
                      <p className={cn("mt-0.5 max-w-[180px] text-[11px] font-bold uppercase leading-snug tracking-wider", s.dark ? "text-canvas/55" : "text-forest/55")}>
                        {s.statLabel}
                      </p>
                    </div>
                    <button
                      onClick={() => scrollToSection("#contact")}
                      className={cn(
                        "group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider",
                        s.dark ? "text-solar" : "text-forest"
                      )}
                    >
                      Start a project
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                <div className="panel-media relative h-[30vh] overflow-hidden rounded-[2rem] border border-forest/10 shadow-2xl shadow-forest/15 sm:h-[36vh] lg:h-[62vh]">
                  <img src={s.image} alt={s.alt} loading="lazy" className="panel-img h-full w-full object-cover will-change-transform" />
                  <div className="glass-chip absolute bottom-4 left-4 flex items-center gap-2.5 rounded-full px-4 py-2.5">
                    <span className="size-2 rounded-full bg-grass-600" />
                    <span className="text-xs font-bold text-forest">{s.kicker}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Progress dots */}
        <div ref={dotsRef} className="glass-chip absolute right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center gap-2.5 rounded-full p-2.5 sm:flex">
          {SOLUTIONS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goToPanel(i)}
              aria-label={`Go to ${s.kicker}`}
              className={cn("dot h-2.5 w-2.5 rounded-full bg-forest/30 transition-all duration-500", i === 0 && "dot-active")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
