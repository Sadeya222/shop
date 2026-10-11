import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight, ShieldCheck, Star } from "lucide-react";
import { gsap, ScrollTrigger, scrollToSection } from "../lib/gsap";
import SolarScene from "./three/SolarScene";
import MagneticButton from "./ui/MagneticButton";

const HERO_PHOTO =
  "https://images.pexels.com/photos/13558357/pexels-photo-13558357.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";

const MINI_STATS = [
  { value: "$2,140", label: "Avg. yearly savings" },
  { value: "4.9/5", label: "Customer rating", star: true },
  { value: "25 yr", label: "Full-system warranty" },
];

export default function Hero({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef(0);

  /* Initial states + scroll-driven motion */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".hero-el", { y: 60, opacity: 0 });
      gsap.set(".hero-img-card", { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(".hero-chip", { scale: 0.6, opacity: 0, y: 20 });

      gsap.to(".hero-copy", {
        yPercent: -10,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom 25%", scrub: true },
      });
      gsap.to(".hero-img-card", {
        y: -46,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(".hero-cue", {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "30% top", scrub: true },
      });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          scrollRef.current = self.progress;
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* Staggered entrance once the preloader lifts */
  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .to(".hero-img-card", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut" }, 0.1)
        .to(".hero-el", { y: 0, opacity: 1, duration: 1.15, stagger: 0.09 }, 0.35)
        .to(
          ".hero-chip",
          { scale: 1, opacity: 1, duration: 0.9, ease: "back.out(1.7)", stagger: 0.14 },
          0.95
        );
    }, sectionRef);
    return () => ctx.revert();
  }, [ready]);

  return (
    <section id="top" ref={sectionRef} className="relative overflow-hidden pt-28 lg:pt-36">
      {/* Soft daylight glows */}
      <div aria-hidden className="pointer-events-none absolute -top-40 right-[-12%] size-[560px] rounded-full bg-solar/25 blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-[-25%] left-[-10%] size-[520px] rounded-full bg-grass/25 blur-[130px]" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-5 pb-20 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:pb-28">
        {/* Copy */}
        <div className="hero-copy relative z-10 lg:col-span-6">
          <div className="hero-el inline-flex items-center gap-2.5 rounded-full border border-forest/10 bg-white/70 px-4 py-2 backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute h-full w-full animate-pulse-dot rounded-full bg-grass-600" />
              <span className="relative size-2 rounded-full bg-grass-600" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-forest/80">
              12,400+ homes powered since 2012
            </span>
          </div>

          <h1 className="mt-7 font-display text-[clamp(3rem,7.2vw,5.7rem)] font-semibold leading-[0.98] tracking-tight text-forest">
            <span className="block overflow-hidden pb-[0.16em] -mb-[0.16em]">
              <span className="hero-el block will-change-transform">Power your life</span>
            </span>
            <span className="block overflow-hidden pb-[0.18em] -mb-[0.18em]">
              <span className="hero-el block will-change-transform">
                with pure{" "}
                <span className="relative inline-block text-grass-600">
                  sunlight
                  <span aria-hidden className="absolute inset-x-0 bottom-[0.05em] -z-10 h-[0.34em] rounded-sm bg-solar/80" />
                </span>
              </span>
            </span>
          </h1>

          <p className="hero-el mt-7 max-w-lg text-lg leading-relaxed text-forest/70">
            Premium solar panels, intelligent storage and craftsmanship that treats your roof like our own — engineered to
            cut your bills by up to 70%.
          </p>

          <div className="hero-el mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton
              onClick={() => scrollToSection("#contact")}
              className="rounded-full bg-solar px-8 py-4 text-base font-bold text-forest shadow-xl shadow-solar/35 transition-colors hover:bg-solar-300"
            >
              Get your free quote <ArrowUpRight className="size-4.5" strokeWidth={2.5} />
            </MagneticButton>
            <MagneticButton
              onClick={() => scrollToSection("#solutions")}
              strength={0.25}
              className="rounded-full border-2 border-forest/15 bg-white/50 px-8 py-[14px] text-base font-bold text-forest backdrop-blur transition-colors hover:border-forest/40"
            >
              Explore solutions
            </MagneticButton>
          </div>

          <div className="hero-el mt-12 flex flex-wrap gap-x-10 gap-y-5 border-t border-forest/10 pt-7">
            {MINI_STATS.map((s) => (
              <div key={s.label}>
                <p className="flex items-center gap-1.5 font-display text-2xl font-semibold text-forest">
                  {s.value}
                  {s.star && <Star className="size-4 fill-solar text-solar" />}
                </p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-forest/55">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual — 3D solar island + daylight photo card */}
        <div className="relative lg:col-span-6">
          <div className="relative h-[500px] sm:h-[580px] lg:h-[640px]">
            <div className="absolute inset-0 z-0">
              <SolarScene scrollRef={scrollRef} ready={ready} />
            </div>

            <div className="hero-img-card absolute bottom-3 left-0 z-10 w-[50%] max-w-[285px] -rotate-2 overflow-hidden rounded-[1.5rem] border-4 border-white shadow-2xl shadow-forest/25 sm:w-[42%]">
              <img src={HERO_PHOTO} alt="Modern home with rooftop solar panels under a clear blue sky" className="aspect-[4/3] w-full object-cover" />
              <div className="glass-chip absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-2xl px-3.5 py-2.5">
                <span className="relative flex size-2.5">
                  <span className="absolute h-full w-full animate-pulse-dot rounded-full bg-grass-600" />
                  <span className="relative size-2.5 rounded-full bg-grass-600" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-forest/60">Live production</p>
                  <p className="font-display text-sm font-semibold text-forest">6.4 kW right now</p>
                </div>
              </div>
            </div>

            <div className="hero-chip glass-chip absolute right-1 top-4 z-10 rounded-2xl px-5 py-4" data-speed="0.92">
              <p className="font-display text-3xl font-semibold text-forest">−68%</p>
              <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-forest/60">Energy bills</p>
            </div>

            <div className="hero-chip glass-chip absolute bottom-28 right-2 z-10 flex items-center gap-3 rounded-2xl px-5 py-4 sm:right-6" data-speed="1.08">
              <span className="grid size-10 place-items-center rounded-xl bg-grass">
                <ShieldCheck className="size-5 text-forest" />
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-forest">25-yr warranty</p>
                <p className="text-xs text-forest/60">panels + labor</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-cue absolute bottom-7 left-1/2 z-10 -translate-x-1/2">
        <button onClick={() => scrollToSection("#solutions")} className="flex flex-col items-center gap-2.5 text-forest/60 transition-colors hover:text-forest" aria-label="Scroll to solutions">
          <span className="text-[10px] font-bold uppercase tracking-[0.32em]">Scroll</span>
          <span className="grid size-11 animate-float place-items-center rounded-full border border-forest/15 bg-white/60 backdrop-blur">
            <ArrowDown className="size-4" />
          </span>
        </button>
      </div>
    </section>
  );
}
