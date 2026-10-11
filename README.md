# solarshop — Premium Solar Energy Website

An award-calibre marketing site for **solarshop**, a residential & commercial solar installer.
Built with React, Vite, Tailwind CSS v4, GSAP (ScrollTrigger + ScrollSmoother + Observer +
SplitText) and React Three Fiber.

## Highlights

- **Brand-strict palette** — Forest `#0F352A`, Grass `#85D050`, Solar `#FFC00A`, Canvas `#EAEFEF`.
  Zero grey utility classes anywhere.
- **Hero WebGL scene** — a floating sunny island: house with solar arrays, battery wall, wind
  turbine, trees, drifting clouds and animated energy particles. Reacts to cursor + scroll.
- **GSAP pinned panels with overscroll** — solution panels lock and slide over each other with
  scrubbed inertia, velocity skew, and elastic bounce past the pin bounds.
- **Momentum swipe sliders** — product catalog and project/testimonial carousels (Swiper.js).
- **Live savings calculator** — animated, real-time estimates.
- **Micro-interactions** — magnetic buttons, SplitText reveals, parallax, custom scrollbar.

## Tech stack

| Layer      | Tooling                                        |
| ---------- | ---------------------------------------------- |
| Framework  | React 19 + TypeScript + Vite 7                 |
| Styling    | Tailwind CSS v4 (CSS-first `@theme` config)    |
| Animation  | GSAP 3 (ScrollSmoother, ScrollTrigger, Observer, SplitText) |
| 3D         | Three.js + @react-three/fiber + @react-three/drei |
| Sliders    | Swiper 11                                      |
| Icons      | lucide-react                                   |

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build -> dist/
npm run preview  # preview the production build locally
```

## Deploying to Vercel

### Option A — Dashboard (recommended)

1. Push this project to a GitHub / GitLab / Bitbucket repository.
   Make sure `.gitignore` is committed so `node_modules/` and `dist/` are excluded.
2. Go to [vercel.com/new](https://vercel.com/new) and **Import** the repository.
3. Vercel auto-detects Vite from `vercel.json`. Confirm the settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Click **Deploy**.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel        # first-time deployment (links the project)
vercel --prod # subsequent production deployments
```

### Notes for this project

- **`vercel.json`** already declares the framework, build command, output directory and
  security headers, so the dashboard needs no manual configuration.
- **`.nvmrc`** pins Node 22, satisfying Vite 7's requirement (Node `^20.19.0 || >=22.12.0`).
- **Build output is a single self-contained `dist/index.html`** (via `vite-plugin-singlefile`).
  JavaScript, CSS and the favicon are inlined, so there are no separate asset files to upload.
- **No environment variables are required.** There is no backend or API key.
- **Remote imagery.** Photography is served from `images.pexels.com` and the logo from
  `i.postimg.cc`, so those hosts must remain reachable. To self-host instead, download the
  assets into `public/` and update the URLs in `src/lib/data.ts` (`LOGO_URL`, image fields) —
  note that the single-file plugin only inlines assets that Vite bundles, so files in `public/`
  are copied to `dist/` and referenced by absolute path (e.g. `/logo.png`).

## Project structure

```
index.html                  # fonts, meta, logo preload
vercel.json                 # Vercel build + headers config
src/
  App.tsx                   # composition + ScrollSmoother wrapper
  index.css                 # Tailwind v4 @theme (brand palette) + custom styles
  lib/
    gsap.ts                 # plugin registration + smooth-scroll helpers
    data.ts                 # all content: solutions, products, projects, logo URL
  components/
    Preloader.tsx           # splash screen
    Navbar.tsx              # frosted sticky nav + mobile overlay
    Hero.tsx                # hero with WebGL canvas
    Marquee.tsx             # trusted-by marquee
    PinnedShowcase.tsx      # GSAP pinned panels w/ overscroll
    ProductsSlider.tsx      # momentum product slider
    Calculator.tsx          # savings calculator
    WhyUs.tsx               # value props + animated stats
    Projects.tsx            # project / testimonial carousel
    Contact.tsx             # validated form
    Footer.tsx              # footer + newsletter
    three/
      SolarScene.tsx        # canvas, camera, lights, energy particles
      parts.tsx             # island, house, battery, trees, sun, clouds
      textures.ts           # procedural canvas textures (PV cells, glow, shadow)
    ui/
      Logo.tsx              # brand logo
      MagneticButton.tsx    # magnetic hover button
      Reveal.tsx            # SplitText heading + fade reveals
      SectionHeader.tsx     # section eyebrow/title/copy
```

## Brand palette (do not change)

| Token            | Hex       | Use                                  |
| ---------------- | --------- | ------------------------------------ |
| Forest Green     | `#0F352A` | deep backgrounds, headings           |
| Grass Green      | `#85D050` | eco accents, success states          |
| Solar Yellow     | `#FFC00A` | CTAs, highlights, active states      |
| Off-White Canvas | `#EAEFEF` | primary light background             |

**Rule: no greys.** Balance forest green with white space, canvas, grass and solar yellow.
All imagery must be bright, natural **daytime** photography.
