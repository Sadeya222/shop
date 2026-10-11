import { useRef, type MouseEvent, type ReactNode } from "react";
import { gsap } from "../../lib/gsap";
import { cn } from "../../utils/cn";

type Props = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  strength?: number;
  onClick?: () => void;
  ariaLabel?: string;
  type?: "button" | "submit";
};

/** Magnetic button — leans toward the cursor, springs back elastically. */
export default function MagneticButton({ children, className, innerClassName, strength = 0.35, onClick, ariaLabel, type = "button" }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    gsap.to(el, { x: x * strength, y: y * strength, duration: 0.5, ease: "power3.out" });
    gsap.to(innerRef.current, { x: x * strength * 0.3, y: y * strength * 0.3, duration: 0.5, ease: "power3.out" });
  };

  const onLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.4)" });
    gsap.to(innerRef.current, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      className={cn("inline-flex cursor-pointer items-center justify-center", className)}
    >
      <span ref={innerRef} className={cn("inline-flex items-center justify-center gap-2", innerClassName)}>
        {children}
      </span>
    </button>
  );
}
