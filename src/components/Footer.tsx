import { useState, type FormEvent, type SVGProps } from "react";
import { ArrowUpRight, Check, Sun } from "lucide-react";
import { scrollToSection } from "../lib/gsap";
import { FadeIn } from "./ui/Reveal";
import Logo from "./ui/Logo";

/* Brand marks (lucide no longer ships brand icons) */
const brandProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const InstagramIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...brandProps} {...p}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
const FacebookIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...brandProps} {...p}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const XIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...brandProps} {...p}>
    <path d="M4 4l16 16M20 4L4 20" />
  </svg>
);
const LinkedinIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...brandProps} {...p}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const YoutubeIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...brandProps} {...p}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

const COLUMNS = [
  { title: "Solutions", links: ["Residential rooftop", "Commercial & farm", "Battery backup", "EV charging", "Monitoring app"] },
  { title: "Company", links: ["About us", "Careers", "Projects", "Reviews", "Press kit"] },
  { title: "Support", links: ["Contact", "FAQ", "Financing", "Warranty", "Service & repair"] },
];

const SOCIALS = [
  { icon: InstagramIcon, label: "Instagram" },
  { icon: FacebookIcon, label: "Facebook" },
  { icon: XIcon, label: "X" },
  { icon: LinkedinIcon, label: "LinkedIn" },
  { icon: YoutubeIcon, label: "YouTube" },
];

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (e: FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <footer className="relative overflow-hidden bg-forest text-canvas">
      <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 size-[560px] -translate-x-1/2 rounded-full bg-grass/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-5 pt-20 sm:px-8">
        <div className="grid gap-12 pb-16 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <button
              onClick={() => scrollToSection("#top")}
              className="flex items-center transition-transform duration-500 hover:scale-[1.03]"
              aria-label="solarshop — back to top"
            >
              <Logo plate imgClassName="h-10 sm:h-11" />
            </button>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-canvas/60">
              Premium solar systems designed, installed and monitored by one accountable team — since 2012.
            </p>
            <div className="mt-7 flex gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#top"
                  aria-label={s.label}
                  onClick={(e) => e.preventDefault()}
                  className="grid size-10 place-items-center rounded-full border border-canvas/15 text-canvas/70 transition-all duration-300 hover:border-solar hover:bg-solar hover:text-forest"
                >
                  <s.icon className="size-4.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-grass">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#top"
                      onClick={(e) => e.preventDefault()}
                      className="text-sm text-canvas/65 transition-colors hover:text-solar"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-grass">Stay charged</p>
            <p className="mt-5 text-sm text-canvas/60">One bright idea per month. No noise.</p>
            {subscribed ? (
              <p className="mt-4 flex items-center gap-2 rounded-xl border border-grass/30 bg-grass/15 px-4 py-3 text-sm font-semibold text-grass">
                <Check className="size-4" strokeWidth={3} /> You’re on the list!
              </p>
            ) : (
              <form onSubmit={subscribe} className="mt-4 flex overflow-hidden rounded-xl border border-canvas/15 bg-canvas/5 focus-within:border-grass/60">
                <input
                  type="email"
                  required
                  placeholder="you@home.com"
                  aria-label="Email for newsletter"
                  className="w-full bg-transparent px-4 py-3 text-sm text-canvas outline-none placeholder:text-canvas/40"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="grid w-12 shrink-0 place-items-center bg-solar text-forest transition-colors hover:bg-solar-300"
                >
                  <ArrowUpRight className="size-4.5" strokeWidth={2.5} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Watermark */}
        <FadeIn y={60} className="select-none">
          <p
            aria-hidden
            className="bg-gradient-to-r from-grass/40 via-canvas/25 to-solar/40 bg-clip-text text-center font-display text-[clamp(4rem,14.5vw,13rem)] font-bold leading-[0.85] tracking-tight text-transparent"
          >
            solarshop
          </p>
        </FadeIn>

        {/* Bottom bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-canvas/10 py-7 text-xs text-canvas/50">
          <p>© {new Date().getFullYear()} Solarshop Energy Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#top" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-solar">
              Privacy
            </a>
            <a href="#top" onClick={(e) => e.preventDefault()} className="transition-colors hover:text-solar">
              Terms
            </a>
          </div>
          <p className="flex items-center gap-1.5">
            Made with sunlight in Austin, TX <Sun className="size-3.5 text-solar" />
          </p>
        </div>
      </div>
    </footer>
  );
}
