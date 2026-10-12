import { SampleProduct } from '../types/banner';

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  {
    id: 'headphones',
    name: 'AeroPulse ANC Wireless Headphones',
    tagline: 'Pure Acoustic Immersion. Zero Distractions.',
    url: 'https://aeropulse.audio/pro-anc',
    description: 'Next-generation wireless headphones with adaptive hybrid active noise cancellation, custom 40mm beryllium drivers, spatial audio tracking, and 45-hour battery life. Engineered for studio professionals and discerning audiophiles.',
    stylePreset: 'clean-modern',
    primaryColor: '#6366F1', // Indigo
    accentColor: '#38BDF8',  // Sky blue
    fontFamily: 'outfit',
    badgeText: 'New 2026 Release',
    ctaText: 'Shop Now',
    headline: 'Silence the World. Hear Every Detail.',
    subheadline: 'Studio-grade acoustic precision with 45-hour battery life and spatial audio.',
    headlineVariants: [
      'Silence the World. Hear Every Detail.',
      'Claim 20% Off Studio-Grade Wireless Audio.',
      'Engineered for Obsessive Sound Quality.',
    ],
    subheadlineVariants: [
      'Studio-grade acoustic precision with 45-hour battery life and spatial audio.',
      'Limited launch offer: Complimentary premium hardshell case included.',
      'Experience 40mm beryllium drivers with hybrid adaptive noise canceling.',
    ],
    ctaVariants: ['Shop Now', 'Claim 20% Off', 'Experience Sound', 'Order Today'],
    badgeVariants: ['New 2026 Release', 'Free Express Shipping', 'Audiophile Choice', '45-Hour Battery'],
    defaultBgImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><defs><radialGradient id="g1" cx="50%" cy="45%" r="60%"><stop offset="0%" stop-color="%231e1b4b"/><stop offset="50%" stop-color="%230f172a"/><stop offset="100%" stop-color="%23020617"/></radialGradient><linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%236366f1" stop-opacity="0.3"/><stop offset="100%" stop-color="%2338bdf8" stop-opacity="0.1"/></linearGradient></defs><rect width="800" height="800" fill="url(%23g1)"/><circle cx="400" cy="380" r="240" fill="url(%23glow)" filter="blur(30px)"/><circle cx="400" cy="370" r="160" stroke="%2338bdf8" stroke-width="4" stroke-opacity="0.4" fill="none"/><path d="M280 440 C 280 260, 520 260, 520 440" stroke="%23f8fafc" stroke-width="22" stroke-linecap="round" fill="none"/><rect x="250" y="400" width="60" height="110" rx="28" fill="%231e293b" stroke="%236366f1" stroke-width="6"/><rect x="490" y="400" width="60" height="110" rx="28" fill="%231e293b" stroke="%236366f1" stroke-width="6"/><circle cx="280" cy="455" r="12" fill="%2338bdf8"/><circle cx="520" cy="455" r="12" fill="%2338bdf8"/></svg>',
    visualPrompts: {
      square: 'Dramatic studio product photography of matte black wireless noise-cancelling headphones resting on an illuminated dark architectural podium, soft cyan rim light, subtle atmospheric fog, 8k commercial quality',
      landscape: 'Wide angle commercial banner photography of matte black over-ear headphones floating against deep slate background with soft indigo and cyan light leaks, crisp commercial look',
      portrait: 'Vertical commercial poster of sleek premium headphones, dramatic lighting highlighting brushed aluminum accents, minimalist luxury studio aesthetic',
      studioPureAd: 'Luxury commercial advertising shot of high-end wireless headphones with sleek metallic reflection, bold cinematic lighting, luxury tech atmosphere',
    },
  },
  {
    id: 'skincare',
    name: 'Lumina Cellular Bio-Recovery Serum',
    tagline: 'Awaken Radiance with Marine Peptides.',
    url: 'https://luminaskin.co/bio-serum',
    description: 'Dermatologist-developed overnight recovery elixir formulated with micro-encapsulated sea kelp bio-actives, multi-molecular hyaluronic acid, and niacinamide to restore barrier resilience and visibly plump skin texture.',
    stylePreset: 'minimal-luxury',
    primaryColor: '#D97706', // Amber gold
    accentColor: '#10B981',  // Emerald green
    fontFamily: 'playfair',
    badgeText: 'Dermatologist Tested',
    ctaText: 'Discover Serum',
    headline: 'Youthful Radiance, Bottled by Science.',
    subheadline: 'Restores skin barrier overnight with deep micro-encapsulated hydration.',
    headlineVariants: [
      'Youthful Radiance, Bottled by Science.',
      'Wake Up to Plump, Resilient Skin.',
      'The Gold Standard in Clean Anti-Aging.',
    ],
    subheadlineVariants: [
      'Restores skin barrier overnight with deep micro-encapsulated hydration.',
      'Formulated with 98% bioactive botanical extracts and marine peptides.',
      'Limited Edition: Enjoy a complimentary travel mist with your order.',
    ],
    ctaVariants: ['Discover Serum', 'Shop Luxury Care', 'Claim Free Gift', 'Transform Your Skin'],
    badgeVariants: ['Dermatologist Tested', '100% Clean Beauty', 'Award Winner 2026', 'Visible in 7 Days'],
    defaultBgImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><defs><linearGradient id="warmBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%232c1c11"/><stop offset="50%" stop-color="%2319130e"/><stop offset="100%" stop-color="%230c0a09"/></linearGradient><linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f59e0b"/><stop offset="100%" stop-color="%23d97706"/></linearGradient></defs><rect width="800" height="800" fill="url(%23warmBg)"/><ellipse cx="400" cy="400" rx="200" ry="260" fill="%23d97706" opacity="0.15" filter="blur(40px)"/><rect x="360" y="240" width="80" height="300" rx="16" fill="%2378350f" stroke="url(%23gold)" stroke-width="4"/><rect x="385" y="190" width="30" height="50" rx="4" fill="%23d97706"/><circle cx="400" cy="175" r="18" fill="%231c1917" stroke="%23d97706" stroke-width="3"/><rect x="375" y="320" width="50" height="90" rx="6" fill="%23fef3c7" opacity="0.9"/><line x1="385" y1="345" x2="415" y2="345" stroke="%2378350f" stroke-width="2"/><line x1="385" y1="360" x2="415" y2="360" stroke="%2378350f" stroke-width="2"/><line x1="390" y1="375" x2="410" y2="375" stroke="%2378350f" stroke-width="2"/></svg>',
    visualPrompts: {
      square: 'Editorial luxury skincare studio photograph of an amber dropper bottle on warm natural travertine stone, soft morning sunlight, delicate botanical shadow, high-end cosmetics advertising',
      landscape: 'Wide panoramic luxury cosmetic shot with amber glass serum bottle centered on textured sand pedestal, golden hour diffused illumination, editorial clean background',
      portrait: 'Vertical luxury beauty advertisement featuring amber glass dropper bottle with glistening golden serum droplet, soft bokeh backdrop, magazine cover quality',
      studioPureAd: 'Vogue editorial style beauty product display, exquisite amber bottle on marble plinth with soft warm directional light and delicate water ripple',
    },
  },
  {
    id: 'chronos-watch',
    name: 'Chronos Voyager GMT Diver Watch',
    tagline: 'Master Any Timezone. Defy the Depths.',
    url: 'https://chronos-horology.com/voyager-gmt',
    description: 'Swiss-crafted automatic GMT diver watch with ceramic bidirectional bezel, 300m water resistance, anti-magnetic sapphire crystal, and 70-hour power reserve. Built for modern adventurers across global horizons.',
    stylePreset: 'bold-impact',
    primaryColor: '#0284C7', // Oceanic Blue
    accentColor: '#F59E0B',  // Gold
    fontFamily: 'archivo',
    badgeText: 'Swiss Automatic',
    ctaText: 'Pre-Order Now',
    headline: 'Precision Beyond Limits. Built for Depth.',
    subheadline: 'Swiss automatic GMT movement with 300-meter marine water resistance.',
    headlineVariants: [
      'Precision Beyond Limits. Built for Depth.',
      'Limited First Edition: Secure Serial Number.',
      'Master 3 Timezones with Swiss Horology.',
    ],
    subheadlineVariants: [
      'Swiss automatic GMT movement with 300-meter marine water resistance.',
      'Ceramic bezel with 70-hour power reserve and scratchproof sapphire.',
      'Complimentary vulcanized rubber diving strap with every pre-order.',
    ],
    ctaVariants: ['Pre-Order Now', 'Explore Voyager', 'Secure Your Watch', 'View Specs'],
    badgeVariants: ['Swiss Automatic', '300M Diver Certified', 'Ceramic Bezel', 'Limited 500 Pieces'],
    defaultBgImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><defs><radialGradient id="sea" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%230c4a6e"/><stop offset="60%" stop-color="%23082f49"/><stop offset="100%" stop-color="%23020617"/></radialGradient></defs><rect width="800" height="800" fill="url(%23sea)"/><circle cx="400" cy="400" r="180" fill="%230f172a" stroke="%2338bdf8" stroke-width="12"/><circle cx="400" cy="400" r="150" fill="%230369a1" stroke="%23f8fafc" stroke-width="4"/><circle cx="400" cy="400" r="14" fill="%23f59e0b"/><line x1="400" y1="400" x2="400" y2="300" stroke="%23f8fafc" stroke-width="8" stroke-linecap="round"/><line x1="400" y1="400" x2="480" y2="400" stroke="%23f8fafc" stroke-width="6" stroke-linecap="round"/><line x1="400" y1="400" x2="340" y2="460" stroke="%23ef4444" stroke-width="4" stroke-linecap="round"/><rect x="350" y="160" width="100" height="60" rx="10" fill="%23334155"/><rect x="350" y="580" width="100" height="60" rx="10" fill="%23334155"/></svg>',
    visualPrompts: {
      square: 'Macro commercial watch photography of luxury diver chronograph with midnight navy blue dial, stainless steel bezel reflections, deep ocean water droplets, dramatic lighting',
      landscape: 'Wide commercial banner showing stainless steel luxury chronograph watch submerged partially in clear ocean water on dark volcanic rock, sharp professional lighting',
      portrait: 'Vertical luxury horology ad showing steel automatic watch angled toward viewer, brushed metal finishes, glowing luminous dial markers in twilight',
      studioPureAd: 'High-end Swiss watch campaign visual, macro detail on sapphire crystal face and ceramic bezel, dramatic moody studio atmosphere',
    },
  },
  {
    id: 'running-shoe',
    name: 'Velocity-X Carbon Marathon Shoe',
    tagline: 'Record-Breaking Energy Return on Every Stride.',
    url: 'https://velocityrun.com/carbon-x',
    description: 'Ultra-lightweight marathon racing shoe featuring full-length curved carbon fiber propulsion plate, supercritical nitrogen-infused foam midsole, and featherlight breathable mesh upper.',
    stylePreset: 'direct-response',
    primaryColor: '#EF4444', // Neon Red
    accentColor: '#EAB308',  // Yellow
    fontFamily: 'archivo',
    badgeText: 'Instant $40 Discount',
    ctaText: 'Claim Discount',
    headline: 'Unlock Your Fastest Marathon PR.',
    subheadline: 'Nitrogen-infused foam + carbon plate drives +8.4% propulsion efficiency.',
    headlineVariants: [
      'Unlock Your Fastest Marathon PR.',
      'Save $40 Today: The World’s Lightest Carbon Shoe.',
      'Engineered to Break 2-Hour Barriers.',
    ],
    subheadlineVariants: [
      'Nitrogen-infused foam + carbon plate drives +8.4% propulsion efficiency.',
      'Over 25,000 runners crushed their personal best this season. Order now.',
      '30-Day Risk-Free Trial with 100% Free Returns and Free Shipping.',
    ],
    ctaVariants: ['Claim Discount', 'Get $40 Off', 'Try Risk-Free', 'Run Faster Now'],
    badgeVariants: ['Instant $40 Discount', 'World Athletics Approved', '30-Day Road Trial', 'Under 180 Grams'],
    defaultBgImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><defs><linearGradient id="speed" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23450a0a"/><stop offset="50%" stop-color="%2318181b"/><stop offset="100%" stop-color="%2309090b"/></linearGradient><linearGradient id="neon" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ef4444"/><stop offset="100%" stop-color="%23eab308"/></linearGradient></defs><rect width="800" height="800" fill="url(%23speed)"/><path d="M100 650 L 700 350" stroke="%23ef4444" stroke-width="4" stroke-opacity="0.3"/><path d="M150 700 L 750 400" stroke="%23eab308" stroke-width="4" stroke-opacity="0.2"/><path d="M220 480 C 320 480, 400 440, 560 380 C 620 350, 640 400, 580 460 C 460 540, 340 520, 220 480 Z" fill="url(%23neon)"/><path d="M200 490 Q 400 550 620 470" stroke="%23ffffff" stroke-width="14" stroke-linecap="round" fill="none"/></svg>',
    visualPrompts: {
      square: 'Dynamic studio commercial photo of an aerodynamic neon athletic racing shoe floating mid-air at 45-degree angle, sharp motion particle effects, clean dark studio backdrop',
      landscape: 'Wide sports marketing banner with sleek carbon plate marathon shoe exploding with energy trails, high-contrast energetic athletic lighting, commercial grade',
      portrait: 'Vertical high-impact athletic billboard ad showing carbon shoe mid-stride, vibrant neon crimson and amber rim lighting, dark futuristic athletic track background',
      studioPureAd: 'Nike-style commercial advertising shot of ultra-light marathon runner shoe, dramatic motion blur, high contrast studio spotlight',
    },
  },
];
