import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BatteryCharging,
  Gauge,
  Layers,
  ShieldCheck,
  Sun,
  Zap,
} from "lucide-react";
import { PRODUCTS } from "../lib/data";
import SectionHeader from "./ui/SectionHeader";
import { FadeIn } from "./ui/Reveal";

const SPEC_ICONS = { zap: Zap, gauge: Gauge, shield: ShieldCheck, battery: BatteryCharging, layers: Layers, sun: Sun };

/** Momentum-based free-mode swipe slider for the hardware catalog. */
export default function ProductsSlider() {
  const swiperRef = useRef<SwiperClass | null>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  return (
    <section id="products" className="relative overflow-x-clip py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeader
            align="left"
            eyebrow="Product catalog"
            title="Engineered for maximum harvest"
            copy="Tier-1 hardware only — every component chosen for yield, longevity and clean aesthetics."
          />
          <FadeIn delay={0.2} className="flex items-center gap-5 pb-1">
            <div className="hidden h-1 w-40 overflow-hidden rounded-full bg-forest/10 sm:block">
              <span ref={progressRef} className="block h-full w-full origin-left scale-x-0 rounded-full bg-solar" />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Previous products"
                className="grid size-12 place-items-center rounded-full border-2 border-forest/15 bg-white/60 text-forest transition-all duration-300 hover:border-forest hover:bg-forest hover:text-canvas"
              >
                <ArrowLeft className="size-5" />
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Next products"
                className="grid size-12 place-items-center rounded-full border-2 border-forest/15 bg-white/60 text-forest transition-all duration-300 hover:border-forest hover:bg-forest hover:text-canvas"
              >
                <ArrowRight className="size-5" />
              </button>
            </div>
          </FadeIn>
        </div>
      </div>

      <FadeIn delay={0.1} className="mt-14">
        <Swiper
          modules={[FreeMode]}
          onSwiper={(sw) => (swiperRef.current = sw)}
          onProgress={(_, p) => {
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
          }}
          freeMode={{ enabled: true, momentum: true, momentumBounceRatio: 0.5 }}
          speed={750}
          grabCursor
          spaceBetween={24}
          slidesPerView={1.12}
          breakpoints={{ 640: { slidesPerView: 2.15 }, 1024: { slidesPerView: 3.1 }, 1360: { slidesPerView: 3.35 } }}
          className="px-5! sm:px-8!"
        >
          {PRODUCTS.map((p) => (
            <SwiperSlide key={p.id} className="h-auto!">
              <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-forest/10 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-forest/15">
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {p.tag && (
                    <span className="absolute left-4 top-4 rounded-full bg-solar px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-forest shadow-lg shadow-solar/40">
                      {p.tag}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-grass-600">{p.category}</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-forest">{p.name}</h3>

                  <ul className="mt-5 space-y-2.5 border-y border-forest/10 py-4">
                    {p.specs.map((s) => {
                      const Icon = SPEC_ICONS[s.icon];
                      return (
                        <li key={s.label} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2.5 text-forest/65">
                            <Icon className="size-4 text-grass-600" />
                            {s.label}
                          </span>
                          <span className="font-semibold text-forest">{s.value}</span>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="mt-auto flex items-center justify-between pt-5">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-forest/50">from</p>
                      <p className="font-display text-2xl font-semibold text-forest">
                        {p.price} <span className="text-xs font-medium text-forest/50">{p.unit}</span>
                      </p>
                    </div>
                    <button
                      aria-label={`Configure ${p.name}`}
                      onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                      className="grid size-11 place-items-center rounded-full bg-forest text-canvas transition-colors duration-300 group-hover:bg-solar group-hover:text-forest"
                    >
                      <ArrowUpRight className="size-4.5" strokeWidth={2.25} />
                    </button>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </FadeIn>
    </section>
  );
}
