import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText } from "../../lib/gsap";
import { cn } from "../../utils/cn";

type HeadingProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
};

/** SplitText line-masked character reveal on scroll — award-grade heading entrances. */
export function RevealHeading({ children, as = "h2", className, delay = 0 }: HeadingProps) {
  const ref = useRef<HTMLElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = as as any;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ctx: gsap.Context | undefined;
    let split: SplitText | undefined;
    let cancelled = false;

    // Split after fonts are ready so line breaks measure correctly.
    document.fonts.ready.then(() => {
      if (cancelled || !ref.current) return;
      ctx = gsap.context(() => {
        split = new SplitText(el, { type: "lines,chars", linesClass: "split-line" });
        gsap.set(el, { opacity: 1 });
        gsap.from(split.chars, {
          yPercent: 120,
          rotate: 4,
          duration: 1.15,
          delay,
          ease: "power4.out",
          stagger: 0.016,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      }, el);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
      split?.revert();
    };
  }, [delay]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={cn("opacity-0", className)}>
      {children}
    </Tag>
  );
}

type FadeProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

/** Soft fade-and-rise on scroll. */
export function FadeIn({ children, className, delay = 0, y = 40 }: FadeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        y,
        opacity: 0,
        duration: 1.1,
        delay,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
