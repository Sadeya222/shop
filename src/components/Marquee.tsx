import { Sun } from "lucide-react";
import { BRANDS } from "../lib/data";
import { FadeIn } from "./ui/Reveal";

/** Trusted-by marquee with edge fade, pauses on hover. */
export default function Marquee() {
  const row = [...BRANDS, ...BRANDS];
  return (
    <section aria-label="Trusted by" className="border-y border-forest/10 bg-white/70 py-7 backdrop-blur">
      <FadeIn y={16}>
        <p className="mb-5 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-forest/50">
          Powering the boldest energy brands
        </p>
      </FadeIn>
      <div className="marquee-mask overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-16 pr-16 hover:[animation-play-state:paused]">
          {row.map((b, i) => (
            <div key={`${b}-${i}`} className="flex items-center gap-16">
              <span className="whitespace-nowrap font-display text-2xl font-semibold tracking-tight text-forest/55">
                {b}
              </span>
              <Sun className="size-4 shrink-0 text-solar" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
