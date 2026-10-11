import { useEffect, useRef } from "react";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Leaf,
  ShieldCheck,
  Sun,
  Wallet,
} from "lucide-react";
import { gsap } from "../lib/gsap";
import { STATS, WHY_US } from "../lib/data";
import { cn } from "../utils/cn";
import SectionHeader from "./ui/SectionHeader";
import { FadeIn } from "./ui/Reveal";

const ICONS = { shield: ShieldCheck, badge: BadgeCheck, sun: Sun, activity: Activity, leaf: Leaf, wallet: Wallet };

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: value,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = Math.round(obj.v).toLocaleString("en-US");
      },
      scrollTrigger: { trigger: el, start: "top 92%", once: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value]);
  return (
    <div className="text-center sm:text-left">
      <p className="font-display text-4xl font-semibold tracking-tight text-forest sm:text-5xl">
        <span ref={ref}>0</span>
        <span className="text-grass-600">{suffix}</span>
      </p>
      <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-forest/55">{label}</p>
    </div>
  );
}

export default function WhyUs() {
  return (
    <section id="why-us" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="Why Solarshop"
          title="The difference is in the details"
          copy="We obsess over the things other installers cut corners on — because a solar system should outlive your mortgage."
        />

        {/* Stats band */}
        <FadeIn className="mt-16">
          <div className="grid grid-cols-2 gap-10 rounded-[2rem] border border-forest/10 bg-white/70 px-8 py-10 backdrop-blur lg:grid-cols-4">
            {STATS.map((s) => (
              <Stat key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </div>
        </FadeIn>

        {/* Cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_US.map((item, i) => {
            const Icon = ICONS[item.icon];
            const dark = i % 3 === 0;
            return (
              <FadeIn key={item.title} delay={(i % 3) * 0.1} y={44}>
                <article
                  className={cn(
                    "group flex h-full flex-col rounded-[1.75rem] p-8 transition-all duration-500 hover:-translate-y-2",
                    dark
                      ? "bg-forest text-canvas shadow-xl shadow-forest/20 hover:shadow-2xl hover:shadow-forest/30"
                      : "border border-forest/10 bg-white text-forest hover:shadow-2xl hover:shadow-forest/15"
                  )}
                >
                  <span
                    className={cn(
                      "grid size-13 place-items-center rounded-2xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110",
                      dark ? "bg-solar text-forest" : "bg-forest text-solar"
                    )}
                  >
                    <Icon className="size-6" strokeWidth={1.9} />
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">{item.title}</h3>
                  <p className={cn("mt-3 flex-1 text-sm leading-relaxed sm:text-base", dark ? "text-canvas/70" : "text-forest/70")}>
                    {item.copy}
                  </p>
                  <span
                    className={cn(
                      "mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]",
                      dark ? "text-solar" : "text-grass-600"
                    )}
                  >
                    Learn more
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" strokeWidth={2.5} />
                  </span>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
