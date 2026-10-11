import { useRef, useState, type FormEvent } from "react";
import { AlertCircle, ArrowUpRight, Check, CheckCircle2, Clock, Mail, MapPin, Phone } from "lucide-react";
import { gsap } from "../lib/gsap";
import { cn } from "../utils/cn";
import { FadeIn, RevealHeading } from "./ui/Reveal";
import MagneticButton from "./ui/MagneticButton";

type FormState = { name: string; email: string; phone: string; bill: string; message: string; consent: boolean };
const INITIAL: FormState = { name: "", email: "", phone: "", bill: "", message: "", consent: false };

const CONTACT_ROWS = [
  { icon: Phone, label: "Call us", value: "+1 (888) 555-0148" },
  { icon: Mail, label: "Email", value: "hello@solarshop.energy" },
  { icon: MapPin, label: "Visit", value: "2400 Sunbeam Ave, Austin, TX" },
  { icon: Clock, label: "Hours", value: "Mon – Sat · 8:00 – 18:00" },
];

const INSTALLER_PHOTO =
  "https://images.pexels.com/photos/4254164/pexels-photo-4254164.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200";

export default function Contact() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sent, setSent] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  const set = (k: keyof FormState, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (form.name.trim().length < 2) next.name = "Please tell us your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address";
    if (form.phone && !/^[+\d][\d\s().-]{6,}$/.test(form.phone)) next.phone = "Enter a valid phone number";
    if (!form.bill) next.bill = "Select an approximate range";
    if (!form.consent) next.consent = "Please agree so we can reach out";
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSent(true);
      requestAnimationFrame(() => {
        gsap.fromTo(
          successRef.current,
          { scale: 0.85, opacity: 0, y: 24 },
          { scale: 1, opacity: 1, y: 0, duration: 0.85, ease: "back.out(1.5)" }
        );
      });
    }
  };

  const fieldCls = (err?: string) =>
    cn(
      "mt-2 w-full rounded-xl border bg-canvas/50 px-4 py-3.5 text-sm text-forest outline-none transition-all placeholder:text-forest/35 focus:bg-white focus:ring-4",
      err ? "border-solar-600 focus:ring-solar/20" : "border-forest/15 focus:border-grass focus:ring-grass/20"
    );

  const Error = ({ msg }: { msg?: string }) =>
    msg ? (
      <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-solar-600">
        <AlertCircle className="size-3.5 shrink-0" /> {msg}
      </p>
    ) : null;

  return (
    <section id="contact" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <FadeIn>
          <div className="grid overflow-hidden rounded-[2.5rem] shadow-2xl shadow-forest/20 lg:grid-cols-2">
            {/* Left — forest panel */}
            <div className="relative overflow-hidden bg-forest p-8 text-canvas sm:p-12">
              <div aria-hidden className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full bg-grass/20 blur-[100px]" />
              <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-16 size-80 rounded-full bg-solar/20 blur-[100px]" />
              <div className="relative">
                <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-grass">
                  <span className="h-px w-8 bg-grass" /> Free consultation
                </p>
                <RevealHeading className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-canvas sm:text-5xl">
                  Let’s design your solar future
                </RevealHeading>
                <p className="mt-5 max-w-md leading-relaxed text-canvas/70">
                  Send a few details and a dedicated solar advisor will map your roof, model your yield and draft a savings
                  plan — within 24 hours.
                </p>

                <div className="mt-9 space-y-5">
                  {CONTACT_ROWS.map((r) => (
                    <div key={r.label} className="flex items-center gap-4">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-canvas/10">
                        <r.icon className="size-5 text-solar" strokeWidth={1.9} />
                      </span>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-canvas/50">{r.label}</p>
                        <p className="font-semibold">{r.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 overflow-hidden rounded-2xl border border-canvas/10">
                  <img
                    src={INSTALLER_PHOTO}
                    alt="Solarshop certified installer mounting a panel in bright daylight"
                    loading="lazy"
                    className="h-44 w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </div>

            {/* Right — form / success */}
            <div className="bg-white p-8 sm:p-12">
              {sent ? (
                <div ref={successRef} className="flex h-full min-h-[420px] flex-col items-center justify-center text-center">
                  <span className="grid size-20 place-items-center rounded-full bg-grass/25">
                    <CheckCircle2 className="size-10 text-grass-600" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-7 font-display text-3xl font-semibold text-forest">Request received!</h3>
                  <p className="mt-3 max-w-sm leading-relaxed text-forest/70">
                    Thanks, {form.name.split(" ")[0]}. A solar advisor will call you within 24 hours with a custom design
                    sketch and savings plan.
                  </p>
                  <button
                    onClick={() => {
                      setForm(INITIAL);
                      setSent(false);
                    }}
                    className="mt-8 text-sm font-bold uppercase tracking-wider text-grass-600 underline-offset-4 transition-colors hover:text-forest hover:underline"
                  >
                    Send another request
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ct-name" className="text-[11px] font-bold uppercase tracking-wider text-forest/60">
                        Full name *
                      </label>
                      <input
                        id="ct-name"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        placeholder="Jordan Rivera"
                        className={fieldCls(errors.name)}
                      />
                      <Error msg={errors.name} />
                    </div>
                    <div>
                      <label htmlFor="ct-email" className="text-[11px] font-bold uppercase tracking-wider text-forest/60">
                        Email *
                      </label>
                      <input
                        id="ct-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="jordan@home.com"
                        className={fieldCls(errors.email)}
                      />
                      <Error msg={errors.email} />
                    </div>
                    <div>
                      <label htmlFor="ct-phone" className="text-[11px] font-bold uppercase tracking-wider text-forest/60">
                        Phone
                      </label>
                      <input
                        id="ct-phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className={fieldCls(errors.phone)}
                      />
                      <Error msg={errors.phone} />
                    </div>
                    <div>
                      <label htmlFor="ct-bill" className="text-[11px] font-bold uppercase tracking-wider text-forest/60">
                        Monthly bill *
                      </label>
                      <select
                        id="ct-bill"
                        value={form.bill}
                        onChange={(e) => set("bill", e.target.value)}
                        className={cn(fieldCls(errors.bill), "select-arrow appearance-none pr-10", !form.bill && "text-forest/35")}
                      >
                        <option value="" disabled>
                          Select a range
                        </option>
                        <option>Under $100</option>
                        <option>$100 – $200</option>
                        <option>$200 – $350</option>
                        <option>$350 – $500</option>
                        <option>Over $500</option>
                      </select>
                      <Error msg={errors.bill} />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="ct-msg" className="text-[11px] font-bold uppercase tracking-wider text-forest/60">
                        Anything we should know?
                      </label>
                      <textarea
                        id="ct-msg"
                        rows={4}
                        value={form.message}
                        onChange={(e) => set("message", e.target.value)}
                        placeholder="Roof age, shading, EV plans…"
                        className={cn(fieldCls(), "resize-none")}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={form.consent}
                          onClick={() => set("consent", !form.consent)}
                          className={cn(
                            "mt-0.5 grid size-5.5 shrink-0 place-items-center rounded-md border-2 transition-all duration-300",
                            form.consent ? "border-grass-600 bg-grass-600" : errors.consent ? "border-solar-600" : "border-forest/25 hover:border-forest/50"
                          )}
                        >
                          {form.consent && <Check className="size-3.5 text-white" strokeWidth={3.5} />}
                        </button>
                        <p className="text-xs leading-relaxed text-forest/60">
                          I agree to be contacted about my project and accept the privacy policy. No spam, ever — just
                          sunlight.
                          {errors.consent && <span className="ml-1 font-semibold text-solar-600">{errors.consent}</span>}
                        </p>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <MagneticButton
                        type="submit"
                        onClick={() => undefined}
                        className="w-full rounded-full bg-solar px-8 py-4 text-base font-bold text-forest shadow-xl shadow-solar/30 transition-colors hover:bg-solar-300"
                        innerClassName="w-full"
                      >
                        Request my free design <ArrowUpRight className="size-4.5" strokeWidth={2.5} />
                      </MagneticButton>
                      <p className="mt-3 text-center text-xs text-forest/50">
                        Average response time: <span className="font-bold text-forest/70">3 h 42 min</span>
                      </p>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
