import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowUpRight,
  BatteryCharging,
  CalendarClock,
  LayoutGrid,
  Leaf,
  PiggyBank,
  Sparkles,
  TreePine,
  Zap,
} from "lucide-react";
import { gsap, scrollToSection } from "../lib/gsap";
import { cn } from "../utils/cn";
import SectionHeader from "./ui/SectionHeader";
import MagneticButton from "./ui/MagneticButton";

const RATE = 0.32; // $/kWh national average

function compute(bill: number, sun: number, battery: boolean) {
  const dailyKWh = bill / RATE / 30;
  const kw = Math.max(1.2, dailyKWh / (sun * 0.82));
  const panels = Math.ceil(kw / 0.45);
  const annual = bill * 12 * (battery ? 0.94 : 0.9);
  const netCost = kw * 2850 * 0.7 + (battery ? 11500 : 0);
  const payback = netCost / annual;
  const co2 = ((dailyKWh * 365 * 0.7) / 1000);
  const trees = co2 * 16.5;
  const lifetime = annual * 36; // 25-yr horizon incl. utility inflation
  return { kw, panels, annual, payback, co2, trees, lifetime };
}

const FMT: Record<string, (v: number) => string> = {
  kw: (v) => v.toFixed(1),
  panels: (v) => String(Math.round(v)),
  annual: (v) => "$" + Math.round(v).toLocaleString("en-US"),
  payback: (v) => v.toFixed(1),
  co2: (v) => v.toFixed(1),
  trees: (v) => String(Math.round(v)),
  lifetime: (v) => (v >= 1e6 ? "$" + (v / 1e6).toFixed(1) + "M" : "$" + Math.round(v / 1000) + "k"),
};

export default function Calculator() {
  const [bill, setBill] = useState(160);
  const [sun, setSun] = useState(4.8);
  const [battery, setBattery] = useState(true);

  const vals = useRef({ kw: 5, panels: 11, annual: 1728, payback: 7.4, co2: 6.5, trees: 107, lifetime: 62208 });
  const refs = useRef<Record<string, HTMLSpanElement | null>>({});

  useEffect(() => {
    const targets = compute(bill, sun, battery);
    (Object.keys(targets) as (keyof typeof targets)[]).forEach((k) => {
      gsap.to(vals.current, {
        [k]: targets[k],
        duration: 0.9,
        ease: "power2.out",
        overwrite: "auto",
        onUpdate: () => {
          const el = refs.current[k];
          if (el) el.textContent = FMT[k](vals.current[k]);
        },
      });
    });
  }, [bill, sun, battery]);

  const billPct = ((bill - 40) / 460) * 100;
  const sunPct = ((sun - 3) / 3.5) * 100;
  const sunRegion = sun < 4.5 ? "Moderate sun — Northeast" : sun < 5.5 ? "Strong sun — Midwest" : "Excellent sun — Southwest";
  const solarPct = battery ? 6 : 10;
  const solarBill = Math.round(bill * (solarPct / 100));

  return (
    <section id="calculator" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-forest p-7 sm:p-10 lg:p-14">
          {/* Daylight glows on deep green */}
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-solar/20 blur-[110px]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 size-96 rounded-full bg-grass/20 blur-[110px]" />

          <div className="relative">
            <SectionHeader
              dark
              align="left"
              eyebrow="Savings calculator"
              title="See what sunlight saves you"
              copy="Drag the sliders — your estimate updates in real time, federal incentives included."
            />

            <div className="mt-12 grid gap-10 lg:grid-cols-5 lg:gap-12">
              {/* Controls */}
              <div className="space-y-9 lg:col-span-2">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <label htmlFor="calc-bill" className="text-sm font-bold uppercase tracking-wider text-canvas/70">
                      Monthly electric bill
                    </label>
                    <span className="rounded-full bg-solar/15 px-3.5 py-1 font-display text-sm font-semibold text-solar">
                      ${bill}
                    </span>
                  </div>
                  <input
                    id="calc-bill"
                    type="range"
                    min={40}
                    max={500}
                    step={5}
                    value={bill}
                    onChange={(e) => setBill(+e.target.value)}
                    style={{ "--fill": `${billPct}%` } as CSSProperties}
                  />
                </div>

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <label htmlFor="calc-sun" className="text-sm font-bold uppercase tracking-wider text-canvas/70">
                    Peak sun hours / day
                    </label>
                    <span className="rounded-full bg-grass/15 px-3.5 py-1 font-display text-sm font-semibold text-grass">
                      {sun.toFixed(1)} h
                    </span>
                  </div>
                  <input
                    id="calc-sun"
                    type="range"
                    min={3}
                    max={6.5}
                    step={0.1}
                    value={sun}
                    onChange={(e) => setSun(+e.target.value)}
                    style={{ "--fill": `${sunPct}%` } as CSSProperties}
                  />
                  <p className="mt-3 flex items-center gap-2 text-xs font-medium text-canvas/55">
                    <Zap className="size-3.5 text-solar" /> {sunRegion}
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-canvas/10 bg-canvas/5 p-5">
                  <div className="flex items-center gap-3.5">
                    <span className="grid size-11 place-items-center rounded-xl bg-grass/20 text-grass">
                      <BatteryCharging className="size-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-canvas">Add battery storage</p>
                      <p className="text-xs text-canvas/55">Backup power + deeper night savings</p>
                    </div>
                  </div>
                  <button
                    role="switch"
                    aria-checked={battery}
                    aria-label="Toggle battery storage"
                    onClick={() => setBattery((v) => !v)}
                    className={cn(
                      "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300",
                      battery ? "bg-grass" : "bg-canvas/20"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-1 size-5 rounded-full bg-white shadow transition-all duration-300",
                        battery ? "left-6" : "left-1"
                      )}
                    />
                  </button>
                </div>

                <p className="flex items-center gap-2 text-xs font-medium text-canvas/55">
                  <Sparkles className="size-3.5 text-solar" />
                  Federal 30% ITC already applied to your estimate.
                </p>
              </div>

              {/* Results */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="col-span-2 rounded-2xl bg-solar p-5 text-forest sm:col-span-1">
                    <PiggyBank className="size-5" />
                    <p className="mt-3 font-display text-3xl font-semibold xl:text-4xl">
                      <span ref={(el) => void (refs.current["annual"] = el)}>{FMT.annual(vals.current.annual)}</span>
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-forest/70">saved per year</p>
                  </div>

                  <div className="rounded-2xl border border-canvas/10 bg-white/[0.06] p-5 text-canvas">
                    <Zap className="size-5 text-grass" />
                    <p className="mt-3 font-display text-3xl font-semibold xl:text-4xl">
                      <span ref={(el) => void (refs.current["kw"] = el)}>{FMT.kw(vals.current.kw)}</span>
                      <span className="text-lg text-canvas/60"> kW</span>
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-canvas/55">system size</p>
                  </div>

                  <div className="rounded-2xl border border-canvas/10 bg-white/[0.06] p-5 text-canvas">
                    <LayoutGrid className="size-5 text-grass" />
                    <p className="mt-3 font-display text-3xl font-semibold xl:text-4xl">
                      <span ref={(el) => void (refs.current["panels"] = el)}>{FMT.panels(vals.current.panels)}</span>
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-canvas/55">panels</p>
                  </div>

                  <div className="rounded-2xl border border-canvas/10 bg-white/[0.06] p-5 text-canvas">
                    <CalendarClock className="size-5 text-grass" />
                    <p className="mt-3 font-display text-3xl font-semibold xl:text-4xl">
                      <span ref={(el) => void (refs.current["payback"] = el)}>{FMT.payback(vals.current.payback)}</span>
                      <span className="text-lg text-canvas/60"> yrs</span>
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-canvas/55">payback time</p>
                  </div>

                  <div className="rounded-2xl border border-canvas/10 bg-white/[0.06] p-5 text-canvas">
                    <Leaf className="size-5 text-grass" />
                    <p className="mt-3 font-display text-3xl font-semibold xl:text-4xl">
                      <span ref={(el) => void (refs.current["co2"] = el)}>{FMT.co2(vals.current.co2)}</span>
                      <span className="text-lg text-canvas/60"> t</span>
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-canvas/55">CO₂ offset / yr</p>
                  </div>

                  <div className="col-span-2 rounded-2xl border border-canvas/10 bg-white/[0.06] p-5 text-canvas sm:col-span-1">
                    <TreePine className="size-5 text-grass" />
                    <p className="mt-3 font-display text-3xl font-semibold xl:text-4xl">
                      <span ref={(el) => void (refs.current["trees"] = el)}>{FMT.trees(vals.current.trees)}</span>
                    </p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-canvas/55">trees equivalent</p>
                  </div>
                </div>

                {/* Bill comparison bars */}
                <div className="mt-6 rounded-2xl border border-canvas/10 bg-white/[0.06] p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-canvas/55">Projected monthly cost</p>
                  <div className="mt-4 space-y-3.5">
                    <div className="flex items-center gap-4">
                      <span className="w-20 shrink-0 text-xs font-bold uppercase tracking-wider text-canvas/60">Grid only</span>
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-canvas/10">
                        <div className="h-full w-full rounded-full bg-solar-600" />
                      </div>
                      <span className="w-14 shrink-0 text-right font-display text-sm font-semibold text-canvas">${bill}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="w-20 shrink-0 text-xs font-bold uppercase tracking-wider text-canvas/60">With solar</span>
                      <div className="h-3 flex-1 overflow-hidden rounded-full bg-canvas/10">
                        <div className="h-full rounded-full bg-grass transition-all duration-700" style={{ width: `${solarPct}%` }} />
                      </div>
                      <span className="w-14 shrink-0 text-right font-display text-sm font-semibold text-grass">${solarBill}</span>
                    </div>
                  </div>
                  <p className="mt-5 border-t border-canvas/10 pt-4 font-display text-sm font-medium text-canvas/75">
                    25-year net savings:{" "}
                    <span className="font-semibold text-solar">
                      <span ref={(el) => void (refs.current["lifetime"] = el)}>{FMT.lifetime(vals.current.lifetime)}</span>
                    </span>{" "}
                    after equipment & install.
                  </p>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-5">
                  <MagneticButton
                    onClick={() => scrollToSection("#contact")}
                    className="rounded-full bg-solar px-7 py-3.5 text-sm font-bold text-forest shadow-xl shadow-solar/25 transition-colors hover:bg-solar-300"
                  >
                    Lock in this estimate <ArrowUpRight className="size-4" strokeWidth={2.5} />
                  </MagneticButton>
                  <span className="text-xs font-medium text-canvas/55">Free 30-min design consultation · No obligation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
