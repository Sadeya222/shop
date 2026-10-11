import { FadeIn, RevealHeading } from "./Reveal";
import { cn } from "../../utils/cn";

type Props = {
  eyebrow: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
};

/** Consistent section intro: eyebrow chip + split-reveal heading + copy. */
export default function SectionHeader({ eyebrow, title, copy, align = "center", dark = false, className }: Props) {
  const centered = align === "center";
  return (
    <div className={cn(centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl text-left", className)}>
      <FadeIn y={24}>
        <span
          className={cn(
            "inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em]",
            dark ? "border-canvas/20 bg-canvas/10 text-solar" : "border-forest/15 bg-white/60 text-forest"
          )}
        >
          <span className={cn("size-1.5 rounded-full", dark ? "bg-solar" : "bg-grass-600")} />
          {eyebrow}
        </span>
      </FadeIn>
      <RevealHeading
        className={cn(
          "mt-6 font-display text-4xl font-semibold leading-[1.04] tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]",
          dark ? "text-canvas" : "text-forest"
        )}
      >
        {title}
      </RevealHeading>
      {copy && (
        <FadeIn delay={0.15} y={24}>
          <p className={cn("mt-6 text-base leading-relaxed sm:text-lg", dark ? "text-canvas/70" : "text-forest/70")}>{copy}</p>
        </FadeIn>
      )}
    </div>
  );
}
