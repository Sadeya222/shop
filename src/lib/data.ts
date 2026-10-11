/* ─────────────────────────────────────────────────────────────
   solarshop — content layer
   All imagery: bright, natural daylight photography (Pexels).
   ───────────────────────────────────────────────────────────── */

export type Solution = {
  id: string;
  index: string;
  kicker: string;
  title: string;
  description: string;
  bullets: string[];
  statValue: string;
  statLabel: string;
  image: string;
  alt: string;
  dark: boolean;
  bg: string;
};

export const SOLUTIONS: Solution[] = [
  {
    id: "residential",
    index: "01",
    kicker: "Residential Rooftop",
    title: "Your roof, upgraded into a private power plant",
    description:
      "Sleek all-black Tier-1 panels, engineered around your roof's geometry and your family's rhythm — designed in 3D, installed in a single day.",
    bullets: ["All-black 450W architectural panels", "AI-shaped 3D roof design & yield report", "One-day certified installation"],
    statValue: "−70%",
    statLabel: "average utility bill reduction",
    image:
      "https://images.pexels.com/photos/12284244/pexels-photo-12284244.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Contemporary home with solar panels and lush garden in bright daylight",
    dark: false,
    bg: "#eaefef",
  },
  {
    id: "commercial",
    index: "02",
    kicker: "Commercial & Agriculture",
    title: "Utility-grade harvests for business & farmland",
    description:
      "From warehouse rooftops to grazing-friendly ground mounts — we engineer megawatt-scale arrays that turn open land into predictable revenue.",
    bullets: ["Tier-1 bifacial modules, 22.8% efficiency", "Sheep-grazing compatible mounting", "PPAs, leasing & rapid depreciation"],
    statValue: "3.2 MW",
    statLabel: "single-farm array commissioned in 2024",
    image:
      "https://images.pexels.com/photos/35105457/pexels-photo-35105457.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Expansive solar farm with wind turbines under a clear blue sky",
    dark: true,
    bg: "#0f352a",
  },
  {
    id: "storage",
    index: "03",
    kicker: "Battery Storage & Backup",
    title: "Sunshine in a box — power that never blinks",
    description:
      "Stackable LiFePO4 batteries store your midday surplus and serve it back at night. Storm-watch mode charges you to full before the weather turns.",
    bullets: ["10–40 kWh stackable LiFePO4 storage", "Automatic 18-hour whole-home backup", "Storm-watch weather intelligence"],
    statValue: "18 h",
    statLabel: "of whole-home backup on a full charge",
    image:
      "https://images.pexels.com/photos/39057090/pexels-photo-39057090.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    alt: "Electrician installing a home battery storage unit in bright natural light",
    dark: false,
    bg: "#ffffff",
  },
  {
    id: "ecosystem",
    index: "04",
    kicker: "Smart Energy Ecosystem",
    title: "One app. Every watt. Total control.",
    description:
      "Panels, battery, EV charger and heat pump — orchestrated by SunIQ, our energy OS that forecasts usage and trades surplus automatically.",
    bullets: ["Solar-matched EV charging", "AI consumption & tariff forecasting", "Dynamic surplus energy trading"],
    statValue: "1 app",
    statLabel: "for the entire energy ecosystem",
    image:
      "https://images.pexels.com/photos/22032343/pexels-photo-22032343.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Energy-efficient building topped with solar panels surrounded by green trees",
    dark: false,
    bg: "#ffd44f",
  },
];

export type Product = {
  id: string;
  name: string;
  category: string;
  tag?: string;
  price: string;
  unit: string;
  image: string;
  alt: string;
  specs: { icon: "zap" | "gauge" | "shield" | "battery" | "layers" | "sun"; label: string; value: string }[];
};

export const PRODUCTS: Product[] = [
  {
    id: "panel",
    name: "SolarMax X6 Panel",
    category: "Monocrystalline · Bifacial",
    tag: "Best seller",
    price: "$315",
    unit: "per panel",
    image:
      "https://images.pexels.com/photos/18306342/pexels-photo-18306342.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    alt: "Close-up of black solar panels capturing bright sunlight",
    specs: [
      { icon: "zap", label: "Power output", value: "450 W" },
      { icon: "gauge", label: "Efficiency", value: "22.8%" },
      { icon: "shield", label: "Warranty", value: "25 yrs" },
    ],
  },
  {
    id: "inverter",
    name: "HybridEdge 8k Inverter",
    category: "Hybrid · Wi-Fi monitoring",
    tag: "New",
    price: "$1,890",
    unit: "per unit",
    image:
      "https://images.pexels.com/photos/37929911/pexels-photo-37929911.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    alt: "High-efficiency residential power inverter in a bright utility room",
    specs: [
      { icon: "zap", label: "Output", value: "8 kW" },
      { icon: "gauge", label: "Efficiency", value: "97.6%" },
      { icon: "battery", label: "Battery-ready", value: "Yes" },
    ],
  },
  {
    id: "battery",
    name: "VoltCore 10 Battery",
    category: "LiFePO4 · Stackable",
    price: "$4,290",
    unit: "per unit",
    image:
      "https://images.pexels.com/photos/38040016/pexels-photo-38040016.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    alt: "Neatly arranged lithium battery modules on a bright surface",
    specs: [
      { icon: "battery", label: "Capacity", value: "10 kWh" },
      { icon: "layers", label: "Cycles", value: "6,000" },
      { icon: "shield", label: "Warranty", value: "10 yrs" },
    ],
  },
  {
    id: "optimizer",
    name: "SunIQ Optimizer",
    category: "Per-panel MPPT",
    tag: "Staff pick",
    price: "$58",
    unit: "per panel",
    image:
      "https://images.pexels.com/photos/15751136/pexels-photo-15751136.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    alt: "Solar panel array close-up on a bright sunny day",
    specs: [
      { icon: "gauge", label: "Harvest gain", value: "+18%" },
      { icon: "sun", label: "Shade response", value: "Real-time" },
      { icon: "shield", label: "Warranty", value: "25 yrs" },
    ],
  },
  {
    id: "mounting",
    name: "AuraTrack Rail System",
    category: "Aero anodized aluminum",
    price: "$0.12",
    unit: "per watt",
    image:
      "https://images.pexels.com/photos/13963757/pexels-photo-13963757.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    alt: "Modern blue solar panels mounted on a rooftop against a clear sky",
    specs: [
      { icon: "shield", label: "Wind rating", value: "180 mph" },
      { icon: "layers", label: "Rail profile", value: "Aero" },
      { icon: "shield", label: "Warranty", value: "25 yrs" },
    ],
  },
  {
    id: "commercial-kit",
    name: "ProGrid Commercial Kit",
    category: "Utility-scale · 500 kW+",
    price: "Custom",
    unit: "per project",
    image:
      "https://images.pexels.com/photos/14096753/pexels-photo-14096753.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Expansive solar power plant in the desert under bright daylight",
    specs: [
      { icon: "zap", label: "Scale", value: "0.5–5 MW" },
      { icon: "gauge", label: "Tracker yield", value: "+24%" },
      { icon: "battery", label: "Grid services", value: "Enabled" },
    ],
  },
];

export type Project = {
  id: string;
  name: string;
  location: string;
  capacity: string;
  quote: string;
  person: string;
  role: string;
  avatar: string;
  image: string;
  alt: string;
};

export const PROJECTS: Project[] = [
  {
    id: "henderson",
    name: "The Henderson Residence",
    location: "Austin, TX",
    capacity: "12.4 kW",
    quote:
      "Our July bill went from $284 to $19. The design consultation felt like hiring an architect, not a contractor.",
    person: "Sarah Henderson",
    role: "Homeowner",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    image:
      "https://images.pexels.com/photos/37083400/pexels-photo-37083400.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Rooftop solar panels on a home against a bright blue sky",
  },
  {
    id: "meadowfield",
    name: "Meadowfield Solar Farm",
    location: "Fresno, CA",
    capacity: "3.2 MW",
    quote:
      "Solarshop delivered a megawatt-class array three weeks ahead of schedule. Our sheep still graze under the panels.",
    person: "Marcus Reed",
    role: "Farm Director",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    image:
      "https://images.pexels.com/photos/9893727/pexels-photo-9893727.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Aerial view of a vast solar farm generating renewable energy in daylight",
  },
  {
    id: "cedar-ridge",
    name: "Cedar Ridge Community",
    location: "Boulder, CO",
    capacity: "240 kW",
    quote:
      "Forty-two homes, one shared array, zero headaches. The community dashboard makes our savings visible every single day.",
    person: "Elena Vasquez",
    role: "HOA President",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    image:
      "https://images.pexels.com/photos/6233727/pexels-photo-6233727.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "A row of houses with solar panels on their rooftops in sunshine",
  },
  {
    id: "bluewater",
    name: "Bluewater Vineyard Estate",
    location: "Napa, CA",
    capacity: "480 kW",
    quote:
      "The winery runs entirely on sunshine from May to September. Guests tour the array more than the cellars now.",
    person: "Jean-Pierre Moreau",
    role: "Estate Owner",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    image:
      "https://images.pexels.com/photos/13804966/pexels-photo-13804966.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Aerial shot of a solar energy farm in bright daylight",
  },
  {
    id: "harbor",
    name: "Harbor Business Park",
    location: "Newark, NJ",
    capacity: "1.1 MW",
    quote:
      "Twelve rooftops, one PPA, immediate positive cash flow. Solarshop's engineering team is simply on another level.",
    person: "David Okafor",
    role: "Property Manager",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    image:
      "https://images.pexels.com/photos/11644973/pexels-photo-11644973.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
    alt: "Team installing solar panels on a large rooftop under a clear sky",
  },
];

export const WHY_US = [
  {
    icon: "shield",
    title: "25-Year Performance Warranty",
    copy: "Every kit is backed by a quarter-century guarantee on panels, inverters and workmanship — in writing.",
  },
  {
    icon: "badge",
    title: "NABCEP Master Installers",
    copy: "Our in-house crews average 11 years of certified experience. No subcontractors, no shortcuts.",
  },
  {
    icon: "sun",
    title: "Tier-1 Panels Only",
    copy: "We install the top 3% of manufactured panels — 22.8% efficiency with all-black architectural styling.",
  },
  {
    icon: "activity",
    title: "SunIQ Smart Monitoring",
    copy: "Watch every watt in real time from anywhere. Alerts go out before you'd ever notice a dip.",
  },
  {
    icon: "leaf",
    title: "Genuine Eco Impact",
    copy: "Your array offsets ~7 tons of CO₂ every year — we plant 10 trees for each project completed.",
  },
  {
    icon: "wallet",
    title: "$0-Down Financing",
    copy: "From 2.99% APR with flexible terms. Most homeowners are cash-flow positive from month one.",
  },
] as const;

export const STATS = [
  { value: 12400, suffix: "+", label: "Installations completed" },
  { value: 486, suffix: " GWh", label: "Clean energy generated" },
  { value: 98, suffix: "%", label: "Customer satisfaction" },
  { value: 32, suffix: "", label: "States serviced" },
];

export const BRANDS = ["EcoVolt", "GreenGrid", "SunHaus", "TerraWatt", "HelioCore", "BrightLeaf", "SolNova", "Watt&Co"];

/** Official solarshop logo (transparent PNG). */
export const LOGO_URL = "https://i.postimg.cc/zGtTYwkz/Likley-Logo-removebg-preview.png";
