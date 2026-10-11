import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { gsap, scrollToSection, smootherStore } from "../lib/gsap";
import { cn } from "../utils/cn";
import Logo from "./ui/Logo";
import MagneticButton from "./ui/MagneticButton";

const LINKS = [
  { label: "Solutions", href: "#solutions" },
  { label: "Products", href: "#products" },
  { label: "Calculator", href: "#calculator" },
  { label: "Why Solarshop", href: "#why-us" },
  { label: "Projects", href: "#projects" },
];

export default function Navbar({ ready }: { ready: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  /* Entrance */
  useEffect(() => {
    if (!ready || !navRef.current) return;
    gsap.fromTo(navRef.current, { yPercent: -130 }, { yPercent: 0, duration: 1.1, ease: "power4.out" });
  }, [ready]);

  /* Frosted glass + hide-on-scroll-down */
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 48);
      const nav = navRef.current;
      if (nav && !open) {
        const d = y - last;
        if (d > 6 && y > 180) gsap.to(nav, { yPercent: -140, duration: 0.55, ease: "power3.out" });
        else if (d < -6 || y < 180) gsap.to(nav, { yPercent: 0, duration: 0.55, ease: "power3.out" });
      }
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  /* Mobile overlay choreography */
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const links = overlay.querySelectorAll(".overlay-link");
    if (open) {
      gsap.set(overlay, { visibility: "visible" });
      gsap
        .timeline()
        .to(overlay, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "power4.inOut" })
        .fromTo(links, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.07, ease: "power4.out" }, "-=0.28");
      smootherStore.current?.paused(true);
    } else {
      gsap
        .timeline()
        .to(links, { y: 40, opacity: 0, duration: 0.28, stagger: 0.03, ease: "power2.in" })
        .to(overlay, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.6, ease: "power4.inOut" }, "-=0.05")
        .set(overlay, { visibility: "hidden" });
      smootherStore.current?.paused(false);
    }
  }, [open]);

  /* Escape closes menu */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const goTo = (href: string) => {
    if (open) {
      setOpen(false);
      window.setTimeout(() => scrollToSection(href), 520);
    } else {
      scrollToSection(href);
    }
  };

  return (
    <>
      <header ref={navRef} className="fixed inset-x-0 top-0 z-[90]">
        <div className={cn("mx-auto w-full max-w-7xl px-4 transition-all duration-500 sm:px-6", scrolled && !open ? "py-3" : "py-4")}>
          <div
            className={cn(
              "flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 transition-all duration-500 sm:px-5",
              scrolled && !open
                ? "border-forest/10 bg-canvas/80 shadow-xl shadow-forest/10 backdrop-blur-xl"
                : "border-transparent bg-transparent"
            )}
          >
            {/* Logo */}
            <button
              onClick={() => smootherStore.current?.scrollTo(0, true)}
              className="group flex items-center transition-transform duration-500 hover:scale-[1.03]"
              aria-label="solarshop — back to top"
            >
              <Logo
                imgClassName="h-8 sm:h-9"
                className={cn("transition-all duration-500", open && "rounded-xl bg-canvas px-3 py-1.5")}
              />
            </button>

            {/* Desktop links */}
            <nav className="hidden items-center gap-8 lg:flex">
              {LINKS.map((l) => (
                <button
                  key={l.href}
                  onClick={() => goTo(l.href)}
                  className="group relative py-1 text-sm font-semibold text-forest/75 transition-colors hover:text-forest"
                >
                  {l.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-solar transition-transform duration-400 group-hover:scale-x-100" />
                </button>
              ))}
            </nav>

            {/* Right cluster */}
            <div className="flex items-center gap-3">
              <MagneticButton
                onClick={() => goTo("#contact")}
                className="hidden rounded-full bg-solar px-6 py-3 text-sm font-bold text-forest shadow-lg shadow-solar/35 transition-colors hover:bg-solar-300 sm:inline-flex"
              >
                Get a quote <ArrowUpRight className="size-4" strokeWidth={2.5} />
              </MagneticButton>
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Close menu" : "Open menu"}
                className={cn(
                  "grid size-11 place-items-center rounded-full border backdrop-blur transition-colors lg:hidden",
                  open ? "border-canvas/25 bg-canvas/10 text-canvas" : "border-forest/15 bg-white/70 text-forest"
                )}
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen mobile overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[85] flex flex-col bg-forest px-7 pb-10 pt-28 sm:px-10"
        style={{ clipPath: "inset(0% 0% 100% 0%)", visibility: "hidden" }}
      >
        <nav className="flex flex-col">
          {LINKS.map((l, i) => (
            <button key={l.href} onClick={() => goTo(l.href)} className="overlay-link group flex items-center justify-between border-b border-canvas/10 py-5 text-left">
              <span className="font-display text-4xl font-semibold text-canvas transition-colors group-hover:text-solar sm:text-5xl">
                {l.label}
              </span>
              <span className="font-display text-sm font-semibold text-grass">0{i + 1}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
          <a href="tel:+18885550148" className="overlay-link flex items-center gap-3 text-sm font-semibold text-canvas/85">
            <span className="grid size-9 place-items-center rounded-full bg-solar">
              <Phone className="size-4 text-forest" />
            </span>
            +1 (888) 555-0148
          </a>
          <span className="overlay-link text-[10px] font-bold uppercase tracking-[0.32em] text-canvas/50">
            Power your life with sunlight
          </span>
        </div>
      </div>
    </>
  );
}
