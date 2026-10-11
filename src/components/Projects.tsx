import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard, Pagination } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { ArrowLeft, ArrowRight, BadgeCheck, MapPin, Quote, Zap } from "lucide-react";
import { PROJECTS } from "../lib/data";
import SectionHeader from "./ui/SectionHeader";
import { FadeIn } from "./ui/Reveal";

/** Swipe-enabled project portfolio with client testimonials. */
export default function Projects() {
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <section id="projects" className="relative overflow-x-clip py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeader
            align="left"
            eyebrow="Projects & testimonials"
            title="Daylight, delivered across America"
            copy="Real installations, real bills, real people — swipe through a few of our favorite builds."
          />
          <FadeIn delay={0.2} className="flex items-center gap-3 pb-1">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous project"
              className="grid size-12 place-items-center rounded-full border-2 border-forest/15 bg-white/60 text-forest transition-all duration-300 hover:border-forest hover:bg-forest hover:text-canvas"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next project"
              className="grid size-12 place-items-center rounded-full border-2 border-forest/15 bg-white/60 text-forest transition-all duration-300 hover:border-forest hover:bg-forest hover:text-canvas"
            >
              <ArrowRight className="size-5" />
            </button>
          </FadeIn>
        </div>
      </div>

      <FadeIn delay={0.1} className="mt-14">
        <Swiper
          modules={[Autoplay, Pagination, Keyboard]}
          onSwiper={(sw) => (swiperRef.current = sw)}
          rewind
          speed={900}
          grabCursor
          keyboard={{ enabled: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ el: ".projects-pagination", clickable: true }}
          spaceBetween={26}
          slidesPerView={1.05}
          breakpoints={{ 640: { slidesPerView: 1.6 }, 1024: { slidesPerView: 2.1 }, 1360: { slidesPerView: 2.35 } }}
          className="!px-5 sm:!px-8"
        >
          {PROJECTS.map((p) => (
            <SwiperSlide key={p.id} className="!h-auto">
              <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-forest/10 bg-white transition-shadow duration-500 hover:shadow-2xl hover:shadow-forest/15">
                <div className="relative h-60 overflow-hidden sm:h-72">
                  <img
                    src={p.image}
                    alt={p.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="glass-chip absolute left-4 top-4 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold text-forest">
                    <Zap className="size-3.5 fill-solar text-solar" /> {p.capacity}
                  </span>
                  <span className="glass-chip absolute right-4 top-4 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-forest">
                    <MapPin className="size-3.5 text-grass-600" /> {p.location}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-7">
                  <Quote className="size-7 fill-solar text-solar" />
                  <p className="mt-4 flex-1 text-base leading-relaxed text-forest/85 sm:text-lg">“{p.quote}”</p>
                  <div className="mt-6 flex items-center gap-3.5 border-t border-forest/10 pt-5">
                    <img
                      src={p.avatar}
                      alt={`Portrait of ${p.person}`}
                      loading="lazy"
                      className="size-11 rounded-full border-2 border-grass object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-display text-sm font-semibold text-forest">{p.person}</p>
                      <p className="text-xs text-forest/55">{p.role}</p>
                    </div>
                    <BadgeCheck className="size-5 text-grass-600" />
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="projects-pagination mt-10 flex justify-center gap-2" />
      </FadeIn>
    </section>
  );
}
