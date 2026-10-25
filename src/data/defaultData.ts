export type ProjectCategory =
  | 'Mobile App'
  | 'Web Platform'
  | 'Streaming'
  | 'UI/UX'
  | 'Websites'
  | 'All';

export interface ProjectItem {
  id: string;
  title: string;
  cardTitle?: string;
  slug: string;
  category: string;
  categorySubtitle: string;
  client: string;
  year: string;
  shortDescription: string;
  overview: string;
  challenge: string;
  solution: string;
  technologies: string[];
  features: string[];
  screenshotUrl: string;
  liveUrl: string;
  featured: boolean;
  order: number;
  status: 'Published' | 'In Progress' | 'Planning' | 'Draft';
  date: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  deliverables: string[];
  iconName: string;
  imageUrl: string;
  order: number;
  updatedAt: string;
}

export interface PricingTierItem {
  id: string;
  name: string;
  price: string;
  subtitle: string;
  description: string;
  features: string[];
  highlighted: boolean;
  deliveryTime: string;
  buttonText: string;
  order: number;
  updatedAt: string;
}

export interface InquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  packageInterest: string;
  budget?: string;
  message: string;
  createdAt: string;
}

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'white-room-the-protocol',
    title: 'WHITE ROOM: THE PROTOCOL',
    cardTitle: 'WHITE ROOM: THE PROTOCOL',
    slug: 'white-room',
    category: 'Mobile App',
    categorySubtitle: 'Mobile App | Psychological Experience',
    client: 'Self-Development Venture',
    year: '2024',
    shortDescription:
      'A cinematic psychological experience designed to challenge perspectives, build self-awareness, and guide users through a journey of inner discovery.',
    overview:
      'WHITE ROOM: THE PROTOCOL is a mobile application that blends storytelling, psychology, and immersive design to create a transformative self-development experience. Designed for modern minds, it uses interactive narratives and thought-provoking scenarios to help users explore perception, build self-awareness, and challenge their own realities.',
    challenge:
      'The challenge was to translate complex psychological concepts into an engaging, accessible, and visually immersive mobile experience that motivates users to reflect, grow, and return.',
    solution:
      'Engineered a native Android application using Kotlin, Clean Architecture, and atmospheric sensory design that elevates digital self-exploration.',
    technologies: ['Android', 'Kotlin', 'Firebase', 'Gamification'],
    features: [
      'Immersive Storytelling: Cinematic narrative design that adapts to user choices',
      'Personal Growth: Guided reflections and psychological insights',
      'Premium Visual Design: A minimal, atmospheric interface built for focus',
      'Progress Tracking: Track your journey and unlock new perspectives',
    ],
    screenshotUrl: '/assets/extracted/project_whiteroom.png',
    liveUrl: 'https://meduua.com/work/white-room',
    featured: true,
    order: 1,
    status: 'Published',
    date: 'Oct 12, 2024',
    updatedAt: '2024-10-12T00:00:00.000Z',
  },
  {
    id: 'kaisel',
    title: 'Kaisel',
    cardTitle: 'Kaisel',
    slug: 'kaisel',
    category: 'Mobile App',
    categorySubtitle: 'Mobile App | AI Companion',
    client: 'Kaisel Labs',
    year: '2024',
    shortDescription:
      'A cutting-edge AI companion and personalized assistant with interactive avatar interactions, cognitive scheduling, and immersive dark visual aesthetics.',
    overview:
      'Kaisel combines advanced cognitive models with high-fidelity visual avatars, delivering empathetic conversational flow and seamless daily task orchestration.',
    challenge:
      'Ensuring real-time avatar responsiveness, expressive lighting shaders, and ultra-low latency conversational streaming on mobile hardware.',
    solution:
      'Architected with Kotlin coroutines, custom OpenGL shader rendering, and edge caching for conversational memory.',
    technologies: ['Kotlin', 'Android Native', 'AI Models', 'OpenGL'],
    features: [
      'Interactive 3D Avatar: Dynamic lighting and expressive real-time reactions',
      'Cognitive Assistant: Contextual scheduling and intelligent suggestions',
      'Ambient Focus Environment: Tailored audiovisual themes for concentration',
      'Cloud Synchronization: Real-time multi-device conversational state',
    ],
    screenshotUrl: '/assets/extracted/project_kaisel.png',
    liveUrl: 'https://meduua.com/work/kaisel',
    featured: true,
    order: 2,
    status: 'In Progress',
    date: 'Oct 8, 2024',
    updatedAt: '2024-10-08T00:00:00.000Z',
  },
  {
    id: 'sinhala-content-publishing-platform',
    title: 'Sinhala Content Publishing Platform',
    cardTitle: 'Sinhala Content Platform',
    slug: 'sinhala-content-platform',
    category: 'Web Platform',
    categorySubtitle: 'Web Platform | Content Management',
    client: 'Literary Editorial Collective',
    year: '2024',
    shortDescription:
      'A clean, responsive publishing platform and modern headless CMS engineered for native Sinhala typography and long-form editorial essays.',
    overview:
      'Crafted for writers and cultural publications, this platform pairs refined OpenType Indic typography with headless content management and instant server rendering.',
    challenge:
      'Ensuring legibility of native Sinhala characters across desktop and mobile devices without slowing down page load speeds.',
    solution:
      'Integrated Next.js with Tailwind CSS and modern headless architecture, implementing optical line-height scaling and sub-second page loads.',
    technologies: ['Next.js', 'React', 'Tailwind', 'Headless CMS'],
    features: [
      'Bespoke Sinhala Typesetting: Calibrated optical line height and ascender spacing',
      'Headless CMS Publishing: Instant draft, review, and archival pipelines',
      'Distraction-Free Reading: Warm ivory surface with balanced contrast',
      'Advanced Search & Taxonomies: Filter by topics, authors, and publication issues',
    ],
    screenshotUrl: '/assets/extracted/project_sinhala.png',
    liveUrl: 'https://meduua.com/work/sinhala-content-platform',
    featured: true,
    order: 3,
    status: 'Published',
    date: 'Sep 28, 2024',
    updatedAt: '2024-09-28T00:00:00.000Z',
  },
  {
    id: 'kaisel-iptv',
    title: 'Kaisel IPTV',
    cardTitle: 'Kaisel IPTV',
    slug: 'kaisel-iptv',
    category: 'Streaming',
    categorySubtitle: 'Streaming Platform | Video On Demand',
    client: 'Kaisel Broadcast Media',
    year: '2024',
    shortDescription:
      'A high-performance live TV, movies, and Video on Demand streaming platform engineered for seamless playback and intuitive media browsing.',
    overview:
      'Kaisel IPTV brings cinematic streaming, live television, and on-demand entertainment to modern screens with ultra-responsive UI navigation.',
    challenge:
      'Managing adaptive bitrate streaming streams without buffering artifacts across diverse connection speeds.',
    solution:
      'Built a custom video playback pipeline with ExoPlayer hardware acceleration and an intuitive carousel browsing architecture.',
    technologies: ['ExoPlayer', 'HLS Streaming', 'Kotlin', 'React'],
    features: [
      'High-Definition Streaming: Hardware-accelerated 1080p60 / 4K playback',
      'On-Demand Catalog: Smart search and instant trailer previews',
      'Electronic Program Guide: Real-time channel schedule timeline',
      'Multi-Device Support: Responsive layout across TVs, tablets, and phones',
    ],
    screenshotUrl: '/assets/extracted/project_iptv.png',
    liveUrl: 'https://meduua.com/work/kaisel-iptv',
    featured: true,
    order: 4,
    status: 'Planning',
    date: 'Sep 15, 2024',
    updatedAt: '2024-09-15T00:00:00.000Z',
  },
  {
    id: 'aurora-spatial-audio',
    title: 'Aurora Spatial Soundscape',
    cardTitle: 'Aurora Spatial Sound',
    slug: 'aurora-spatial-sound',
    category: 'Mobile App',
    categorySubtitle: 'Mobile App | Acoustic Meditation',
    client: 'Nordic Sound Labs',
    year: '2024',
    shortDescription:
      'Generative ambient soundscapes synthesized dynamically to support deep work, focus rituals, and acoustic stress relief.',
    overview:
      'Aurora combines generative audio synthesis with minimalist tactile controls, creating bespoke acoustic environments tailored to biometric circadian cycles.',
    challenge:
      'Synthesizing low-latency multi-channel spatial audio on mobile devices while conserving device battery life.',
    solution:
      'Engineered a C++ audio engine integrated via JNI with Kotlin, featuring custom binaural DSP filters and dark mode UI.',
    technologies: ['Kotlin', 'C++ Audio DSP', 'Spatial Audio', 'JNI'],
    features: [
      'Dynamic Binaural Synthesis: Custom acoustic positioning that adjusts in real time',
      'Biometric Cadence Sync: Matches auditory frequency to resting heart rate intervals',
      'Tactile Interface: Minimalist haptic dials for sound immersion adjustment',
      'Offline Capability: Full algorithmic synthesis without continuous streaming',
    ],
    screenshotUrl: '/assets/extracted/casestudy_screen1.png',
    liveUrl: 'https://meduua.com/work/aurora-spatial-sound',
    featured: true,
    order: 5,
    status: 'Published',
    date: 'Sep 02, 2024',
    updatedAt: '2024-09-02T00:00:00.000Z',
  },
  {
    id: 'monolith-headless-commerce',
    title: 'Monolith Editorial Commerce',
    cardTitle: 'Monolith Commerce',
    slug: 'monolith-commerce',
    category: 'Web Platform',
    categorySubtitle: 'Web Platform | Editorial E-Commerce',
    client: 'Atelier Maison Copenhagen',
    year: '2024',
    shortDescription:
      'An ultra-fast luxury editorial shopping platform blending high-fashion lookbooks with instant headless cart execution.',
    overview:
      'Monolith bridges the gap between editorial spreads and transactional e-commerce, offering instantaneous transitions and global currency routing.',
    challenge:
      'Maintaining 60fps editorial transitions alongside real-time global inventory synchronization and currency conversions.',
    solution:
      'Architected with Next.js edge rendering, Redis cache warming, and Stripe checkout pipelines for seamless purchasing.',
    technologies: ['Next.js', 'TypeScript', 'Tailwind', 'Stripe'],
    features: [
      'Editorial Lookbook Engine: Seamless shopping directly from high-resolution editorial spreads',
      'Sub-Second Checkout: Edge-rendered cart and dynamic localized checkout routing',
      'Global Multi-Currency: Automatic geolocation-based currency and tax formatting',
      'Headless Inventory Core: Real-time stock reservation across European distribution nodes',
    ],
    screenshotUrl: '/assets/extracted/casestudy_screen2.png',
    liveUrl: 'https://meduua.com/work/monolith-commerce',
    featured: true,
    order: 6,
    status: 'Published',
    date: 'Aug 22, 2024',
    updatedAt: '2024-08-22T00:00:00.000Z',
  },
  {
    id: 'strata-wealth-terminal',
    title: 'Strata Wealth Terminal',
    cardTitle: 'Strata Terminal',
    slug: 'strata-terminal',
    category: 'Web Platform',
    categorySubtitle: 'Web Platform | Asset Management',
    client: 'Strata Capital Geneva',
    year: '2024',
    shortDescription:
      'A private wealth intelligence dashboard delivering real-time portfolio stress testing, multi-asset analytics, and risk telemetry.',
    overview:
      'Designed for institutional wealth managers, Strata consolidates fragmented equity, debt, and real-asset portfolios into an intuitive, high-density visualization portal.',
    challenge:
      'Rendering dense financial chart feeds without frame drops while maintaining bank-grade multi-tenant access control.',
    solution:
      'Constructed using Canvas-rendered chart components, WebSocket price streaming, and strict cryptographic token gating.',
    technologies: ['React', 'TypeScript', 'WebSockets', 'Canvas API'],
    features: [
      'Real-Time Monte Carlo Simulations: Instant asset risk projections under simulated macroeconomic conditions',
      'Multi-Asset Telemetry: Unified views of global equities, bonds, private equity, and commodities',
      'High-Density Visual Hierarchy: Monospaced financial typography calibrated for fast scanning',
      'Secure Role-Based Access: Military-grade session segregation and audit logging',
    ],
    screenshotUrl: '/assets/extracted/casestudy_screen3.png',
    liveUrl: 'https://meduua.com/work/strata-terminal',
    featured: true,
    order: 7,
    status: 'Published',
    date: 'Aug 10, 2024',
    updatedAt: '2024-08-10T00:00:00.000Z',
  },
  {
    id: 'lumina-indie-cinema',
    title: 'Lumina Indie Cinema',
    cardTitle: 'Lumina Cinema',
    slug: 'lumina-cinema',
    category: 'Streaming',
    categorySubtitle: 'Streaming | Independent Cinema',
    client: 'Lumina Film Arts Society',
    year: '2024',
    shortDescription:
      'A curated video streaming destination dedicated to independent international filmmakers, festival selections, and director retrospectives.',
    overview:
      'Lumina celebrates cinematic artistry by pairing cinematic full-frame trailers with curated editorial essays and high-fidelity video streams.',
    challenge:
      'Streaming festival 4K cinematic transfers with multi-language subtitle tracks and low CDN latency globally.',
    solution:
      'Developed an adaptive HLS streaming engine with multi-track SSA/ASS subtitle rendering and personalized recommendation curation.',
    technologies: ['React', 'HLS Streaming', 'Video.js', 'Tailwind'],
    features: [
      'Curated Film Seasons: Monthly themed retrospectives selected by international film critics',
      'Lossless Audio & 4K Streams: Multi-channel surround sound with cinema-standard bitrates',
      'Director Commentary Track: Dual-channel audio commentary overlays for film enthusiasts',
      'Custom Typography Subtitles: Optical subtitle rendering designed for effortless reading',
    ],
    screenshotUrl: '/assets/extracted/casestudy_screen4.png',
    liveUrl: 'https://meduua.com/work/lumina-cinema',
    featured: true,
    order: 8,
    status: 'Published',
    date: 'Jul 29, 2024',
    updatedAt: '2024-07-29T00:00:00.000Z',
  },
  {
    id: 'elysium-sanctuary',
    title: 'Elysium Sanctuary Resort',
    cardTitle: 'Elysium Sanctuary',
    slug: 'elysium-sanctuary',
    category: 'Websites',
    categorySubtitle: 'Websites | Luxury Hospitality',
    client: 'Elysium Retreats Sri Lanka',
    year: '2024',
    shortDescription:
      'An atmospheric, luxury hospitality showcase crafted for an architectural eco-sanctuary nested along the southern coastline.',
    overview:
      'Capturing the raw natural tranquility of coastal Ceylon, Elysium presents villas, wellness rituals, and bespoke private bookings through refined editorial web storytelling.',
    challenge:
      'Balancing full-screen high-resolution environmental photography with instantaneous mobile loading and reservation conversions.',
    solution:
      'Built with optimized responsive picture tags, progressive image loading, and an intuitive date-selection reservation flow.',
    technologies: ['React', 'Tailwind', 'Framer Motion', 'TypeScript'],
    features: [
      'Immersive Villa Walkthroughs: High-resolution photo narratives with architectural specifications',
      'Direct Booking Engine: Seamless suite selection and customized wellness package add-ons',
      'Bespoke Culinary Menus: Interactive farm-to-table seasonal menus and sommelier pairings',
      'Atmospheric Audio-Visuals: Ambient ocean sounds and day-to-night lighting transitions',
    ],
    screenshotUrl: '/assets/extracted/casestudy_screen5.png',
    liveUrl: 'https://meduua.com/work/elysium-sanctuary',
    featured: true,
    order: 9,
    status: 'Published',
    date: 'Jul 14, 2024',
    updatedAt: '2024-07-14T00:00:00.000Z',
  },
  {
    id: 'chronos-circadian-health',
    title: 'Chronos Biometrics',
    cardTitle: 'Chronos Biometrics',
    slug: 'chronos-biometrics',
    category: 'Mobile App',
    categorySubtitle: 'Mobile App | Circadian Rhythm Tracker',
    client: 'Chronos BioHealth',
    year: '2024',
    shortDescription:
      'A precision wellness companion aligning modern sleep, blue-light exposure, and physical performance to natural circadian biology.',
    overview:
      'Chronos processes wearable sensor telemetry to build bespoke daily activity intervals, optimizing deep sleep phases and mental sharpness.',
    challenge:
      'Translating noisy biometric sensor data into clean, actionable daily recommendations without overwhelming the user.',
    solution:
      'Implemented on-device Kalman filtering and an elegant OLED-optimized dark UI that prevents blue light disruption at night.',
    technologies: ['Android', 'Kotlin', 'Health Connect', 'Jetpack Compose'],
    features: [
      'Circadian Window Calculator: Identifies individual peak cognitive windows and wind-down phases',
      'OLED Dark Interface: True black palette designed to protect melatonin production at night',
      'Sensor Telemetry Integration: Syncs with smart rings, watches, and smart bed sensors',
      'Privacy-First Architecture: Biometric calculations processed entirely on-device',
    ],
    screenshotUrl: '/assets/extracted/casestudy_screen6.png',
    liveUrl: 'https://meduua.com/work/chronos-biometrics',
    featured: true,
    order: 10,
    status: 'Published',
    date: 'Jun 28, 2024',
    updatedAt: '2024-06-28T00:00:00.000Z',
  },
  {
    id: 'nexus-logistics-cloud',
    title: 'Nexus Logistics Cloud',
    cardTitle: 'Nexus Logistics',
    slug: 'nexus-logistics',
    category: 'Web Platform',
    categorySubtitle: 'Web Platform | Real-Time Fleet Routing',
    client: 'Nexus Global Freight',
    year: '2024',
    shortDescription:
      'An enterprise maritime and container dispatch platform tracking multi-modal shipping fleets across Asia-Pacific logistics corridors.',
    overview:
      'Nexus provides continuous visibility into vessel positions, customs documentation status, and port turnaround times across major international hubs.',
    challenge:
      'Streaming real-time GPS telemetry from thousands of marine vessels onto interactive map projections with sub-second latency.',
    solution:
      'Engineered using WebGL map vector layers, WebSocket pub/sub telemetry pipelines, and automated customs status alerts.',
    technologies: ['React', 'WebGL', 'WebSockets', 'Node.js'],
    features: [
      'Live Vessel Tracking: Geospatial container tracking with ETA calculation engines',
      'Automated Customs Portals: Instant digital bill of lading and manifest verification',
      'Disruption Prediction: Weather and port congestion risk scoring algorithms',
      'Fleet Optimization: Fuel-efficient route planning across commercial maritime lanes',
    ],
    screenshotUrl: '/assets/extracted/casestudy_trailer_thumb.png',
    liveUrl: 'https://meduua.com/work/nexus-logistics',
    featured: true,
    order: 11,
    status: 'Published',
    date: 'Jun 10, 2024',
    updatedAt: '2024-06-10T00:00:00.000Z',
  },
  {
    id: 'vanguard-spatial-design',
    title: 'Vanguard Spatial Interface',
    cardTitle: 'Vanguard Spatial',
    slug: 'vanguard-spatial',
    category: 'UI/UX',
    categorySubtitle: 'UI/UX | Design System & Framework',
    client: 'Vanguard Labs',
    year: '2024',
    shortDescription:
      'A multi-platform spatial design system crafted for next-generation dual-screen, foldable, and augmented reality hardware.',
    overview:
      'Vanguard redefines digital interaction standards by harmonizing depth cues, adaptive surface lighting, and ergonomic thumb reach ergonomics.',
    challenge:
      'Unifying interaction models across varying screen fold angles, pen inputs, and touch gestures without sacrificing performance.',
    solution:
      'Architected a comprehensive component library with responsive posture detection and calibrated spatial sound feedback.',
    technologies: ['Figma', 'TypeScript', 'Tailwind', 'Design Systems'],
    features: [
      'Adaptive Posture Detection: Components reposition smoothly as devices unfold or tilt',
      'Calibrated Depth Physics: Micro-elevation layers that react dynamically to ambient light',
      'Accessibility-First Focus States: High-contrast focus rings and keyboard-friendly navigation',
      'Universal Token Library: Automated design token pipeline exported directly to code',
    ],
    screenshotUrl: '/assets/extracted/casestudy_dual_phones.png',
    liveUrl: 'https://meduua.com/work/vanguard-spatial',
    featured: true,
    order: 12,
    status: 'Published',
    date: 'May 24, 2024',
    updatedAt: '2024-05-24T00:00:00.000Z',
  },
  {
    id: 'solaris-clean-energy',
    title: 'Solaris Grid Intelligence',
    cardTitle: 'Solaris Energy',
    slug: 'solaris-energy',
    category: 'Web Platform',
    categorySubtitle: 'Web Platform | Renewable Telemetry',
    client: 'Solaris Green Power',
    year: '2024',
    shortDescription:
      'A commercial microgrid intelligence platform balancing solar array generation, commercial battery storage, and grid exports.',
    overview:
      'Solaris optimizes distributed solar generation assets through machine learning forecasts of solar irradiance and dynamic grid demand pricing.',
    challenge:
      'Processing high-frequency inverter sensor feeds and automating battery charge/discharge cycles in milliseconds.',
    solution:
      'Developed a fault-tolerant React dashboard with real-time time-series graphing and automated grid export trading triggers.',
    technologies: ['React', 'TypeScript', 'Time-Series DB', 'Tailwind'],
    features: [
      'Solar Generation Forecasting: Irradiance prediction models paired with satellite weather data',
      'Battery Life Optimization: Automated cycle management that preserves cell longevity',
      'Grid Arbitrage Automation: Automatic power feed-in when grid tariffs hit daily peaks',
      'Facility Telemetry: Instant diagnostic alerts for inverter and panel faults',
    ],
    screenshotUrl: '/assets/extracted/hero_devices_showcase.png',
    liveUrl: 'https://meduua.com/work/solaris-energy',
    featured: true,
    order: 13,
    status: 'Published',
    date: 'May 08, 2024',
    updatedAt: '2024-05-08T00:00:00.000Z',
  },
  {
    id: 'aethelgard-interactive',
    title: 'Aethelgard Mythos',
    cardTitle: 'Aethelgard Mythos',
    slug: 'aethelgard-mythos',
    category: 'Mobile App',
    categorySubtitle: 'Mobile App | Interactive Fiction',
    client: 'Grimoire Digital Fiction',
    year: '2024',
    shortDescription:
      'An atmospheric interactive fantasy novel with branching storylines, hand-drawn map cartography, and dynamic orchestral ambient cues.',
    overview:
      'Aethelgard weaves complex historical mythologies into an immersive digital reading experience where reader decisions permanently alter narrative arcs.',
    challenge:
      'Managing thousands of branching narrative nodes while providing seamless page turn animations and state save persistence.',
    solution:
      'Constructed with a custom state-graph parser, offline SQLite state persistence, and handcrafted parchment visual styling.',
    technologies: ['Kotlin', 'Android', 'SQLite', 'Audio Synthesis'],
    features: [
      'Branching Narrative Matrix: Hundreds of unique story outcomes based on ethical choices',
      'Interactive Cartography: Explore ancient hand-drawn maps that reveal hidden lore',
      'Adaptive Soundscapes: Dynamic ambient orchestration that changes with story tension',
      'Reading Mode Customization: Typography, parchment grain, and lighting controls',
    ],
    screenshotUrl: '/assets/extracted/home_hero_full.png',
    liveUrl: 'https://meduua.com/work/aethelgard-mythos',
    featured: true,
    order: 14,
    status: 'Published',
    date: 'Apr 20, 2024',
    updatedAt: '2024-04-20T00:00:00.000Z',
  },
  {
    id: 'zenith-atelier-architecture',
    title: 'Zenith Architecture Atelier',
    cardTitle: 'Zenith Architecture',
    slug: 'zenith-architecture',
    category: 'Websites',
    categorySubtitle: 'Websites | Modernist Architecture Studio',
    client: 'Zenith Architects Tokyo',
    year: '2024',
    shortDescription:
      'A minimalist digital portfolio showcasing architectural monographs, concrete residential forms, and urban master plans.',
    overview:
      'Reflecting the austere beauty of Japanese modernism, Zenith showcases architectural works through expansive photography, floor plans, and material studies.',
    challenge:
      'Presenting large architectural CAD blueprints and photographs with razor-sharp fidelity and smooth panning navigation.',
    solution:
      'Built with Next.js image optimization, pinch-to-zoom blueprint viewers, and balanced typographic whitespace.',
    technologies: ['React', 'Next.js', 'Tailwind', 'TypeScript'],
    features: [
      'Monograph Project Layouts: Editorial architectural narratives with material breakdowns',
      'High-Resolution Blueprint Pan: Deep zoom capabilities for CAD drawings and floor plans',
      'Project Archive Filtering: Categorize by typology, location, structural material, and year',
      'Monochrome Aesthetic: Restrained typography and palette allowing architecture to lead',
    ],
    screenshotUrl: '/assets/extracted/about_hero_full.png',
    liveUrl: 'https://meduua.com/work/zenith-architecture',
    featured: true,
    order: 15,
    status: 'Published',
    date: 'Apr 04, 2024',
    updatedAt: '2024-04-04T00:00:00.000Z',
  },
  {
    id: 'hyperion-decision-engine',
    title: 'Hyperion Predictive Core',
    cardTitle: 'Hyperion Analytics',
    slug: 'hyperion-analytics',
    category: 'Web Platform',
    categorySubtitle: 'Web Platform | Enterprise Decision Engine',
    client: 'Hyperion Data Systems',
    year: '2024',
    shortDescription:
      'An enterprise decision modeling platform enabling corporate leadership to simulate market scenarios, supply shocks, and pricing elasticity.',
    overview:
      'Hyperion consolidates internal ERP data and external market indexes, allowing executive teams to execute complex predictive simulations in seconds.',
    challenge:
      'Providing intuitive parameter tuning for complex multi-variable stochastic financial models without technical friction.',
    solution:
      'Designed an interactive scenario playground with real-time sensitivity sliders and instant visual delta comparisons.',
    technologies: ['React', 'TypeScript', 'WebAssembly', 'Tailwind'],
    features: [
      'Interactive Scenario Playground: Slide interest rates, freight costs, and demand factors',
      'Instant Visual Deltas: Clear before-and-after variance metrics across key revenue streams',
      'Executive Presentation Export: Generate boardroom-ready PDF briefs with one click',
      'Enterprise SSO Integration: Zero-trust authentication and fine-grained dataset access',
    ],
    screenshotUrl: '/assets/extracted/about_executive_studio.png',
    liveUrl: 'https://meduua.com/work/hyperion-analytics',
    featured: true,
    order: 16,
    status: 'Published',
    date: 'Mar 18, 2024',
    updatedAt: '2024-03-18T00:00:00.000Z',
  },
];

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'service-01',
    number: '01',
    title: 'Website Design & Development',
    description: 'Custom, high-performance websites designed to elevate your brand and deliver real results.',
    deliverables: ['Custom UI/UX Design', 'Responsive Web Layout', 'SEO & Performance', 'CMS Integration'],
    iconName: 'Globe',
    imageUrl: '/assets/extracted/service_web_dev.png',
    order: 1,
    updatedAt: '2026-10-01T00:00:00.000Z',
  },
  {
    id: 'service-02',
    number: '02',
    title: 'Full-Stack Web Applications',
    description: 'Scalable, secure, and feature-rich web applications built for your unique needs.',
    deliverables: ['React & Next.js SPAs', 'Backend APIs & Databases', 'Authentication & RBAC', 'Cloud Deployment'],
    iconName: 'Layers',
    imageUrl: '/assets/extracted/service_fullstack.png',
    order: 2,
    updatedAt: '2026-10-01T00:00:00.000Z',
  },
  {
    id: 'service-03',
    number: '03',
    title: 'Android App Development',
    description: 'Engaging Android applications that reach your audience and create lasting impact.',
    deliverables: ['Native Kotlin Development', 'Clean Architecture & MVVM', 'Offline Storage', 'Play Store Publishing'],
    iconName: 'Smartphone',
    imageUrl: '/assets/extracted/service_android.png',
    order: 3,
    updatedAt: '2026-10-01T00:00:00.000Z',
  },
  {
    id: 'service-04',
    number: '04',
    title: 'UI/UX Design',
    description: 'User-centered designs that are beautiful, intuitive, and built to convert.',
    deliverables: ['Wireframing & Prototyping', 'Design Systems & Tokens', 'Interaction Design', 'Usability Testing'],
    iconName: 'PenTool',
    imageUrl: '/assets/extracted/service_uiux.png',
    order: 4,
    updatedAt: '2026-10-01T00:00:00.000Z',
  },
  {
    id: 'service-05',
    number: '05',
    title: 'Custom Software Solutions',
    description: 'Tailored software to streamline operations, solve complex challenges, and fuel growth.',
    deliverables: ['Custom Workflow Automation', 'Database Engineering', 'API Integrations', 'Technical Consulting'],
    iconName: 'Settings',
    imageUrl: '/assets/extracted/service_software.png',
    order: 5,
    updatedAt: '2026-10-01T00:00:00.000Z',
  },
  {
    id: 'service-06',
    number: '06',
    title: 'Website Improvement & Optimization',
    description: 'Enhance performance, user experience, and SEO to get more from your existing website.',
    deliverables: ['Core Web Vitals Speed Boost', 'Technical SEO Audit', 'UI/UX Modernization', 'Bug Fixing & Maintenance'],
    iconName: 'BarChart3',
    imageUrl: '/assets/extracted/service_optimization.png',
    order: 6,
    updatedAt: '2026-10-01T00:00:00.000Z',
  },
];

export const DEFAULT_PRICING: PricingTierItem[] = [
  {
    id: 'pricing-starter',
    name: 'Starter',
    price: 'LKR 10,000',
    subtitle: 'Perfect for individuals and small businesses getting started online.',
    description: 'Essential launchpad with high-performance responsive code.',
    features: [
      'Up to 5 Pages',
      'Responsive Design (Mobile + Tablet)',
      'Contact Form',
      'Basic SEO Setup',
      '1 Month Support',
    ],
    highlighted: false,
    deliveryTime: '5–7 Days',
    buttonText: 'Get Started',
    order: 1,
    updatedAt: '2026-10-01T00:00:00.000Z',
  },
  {
    id: 'pricing-business',
    name: 'Business',
    price: 'LKR 15,000',
    subtitle: 'Ideal for growing businesses that need more features and flexibility.',
    description: 'Our most popular comprehensive digital package.',
    features: [
      'Up to 10 Pages',
      'Responsive Design (Mobile + Tablet)',
      'Contact Form & Google Maps',
      'On-Page SEO Optimization',
      'Social Media Integration',
      '3 Months Support',
    ],
    highlighted: true,
    deliveryTime: '7–12 Days',
    buttonText: 'Get Started',
    order: 2,
    updatedAt: '2026-10-01T00:00:00.000Z',
  },
  {
    id: 'pricing-premium',
    name: 'Premium',
    price: 'LKR 20,000',
    subtitle: 'A complete solution for established businesses with advanced needs.',
    description: 'Complete high-end solution with blog, news, and advanced setup.',
    features: [
      'Up to 20 Pages',
      'Responsive Design (Mobile + Tablet)',
      'Contact Form & Google Maps',
      'Advanced SEO Setup',
      'Blog / News Section',
      'Social Media Integration',
      '6 Months Support',
    ],
    highlighted: false,
    deliveryTime: '12–18 Days',
    buttonText: 'Get Started',
    order: 3,
    updatedAt: '2026-10-01T00:00:00.000Z',
  },
];
