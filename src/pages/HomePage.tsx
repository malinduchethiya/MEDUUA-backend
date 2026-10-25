import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  ExternalLink,
  Monitor,
  Smartphone,
  LayoutGrid,
  Code2,
  Database,
  Headphones,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { PageRoute } from '../components/Layout';
import { DEFAULT_PROJECTS } from '../data/defaultData';
import { SvgSphereAnimation } from '../components/SvgSphereAnimation';

gsap.registerPlugin(ScrollTrigger);

interface HomePageProps {
  onNavigate: (page: PageRoute, projectSlug?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { projects } = usePortfolio();

  const selectedSectionRef = useRef<HTMLElement | null>(null);
  const galleryViewportRef = useRef<HTMLDivElement | null>(null);
  const galleryTrackRef = useRef<HTMLDivElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect reduced-motion preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Exactly 16 projects arranged in 4 columns and 4 rows as requested
  const displayedProjects = React.useMemo(() => {
    const list: typeof projects = [...projects];
    for (const defProj of DEFAULT_PROJECTS) {
      if (list.length >= 16) break;
      if (!list.some((p) => p.id === defProj.id || p.slug === defProj.slug)) {
        list.push(defProj);
      }
    }
    while (list.length < 16 && list.length > 0) {
      const clone = {
        ...list[list.length % (projects.length || 1)],
        id: `proj-slot-${list.length + 1}`,
      };
      list.push(clone);
    }
    return list.slice(0, 16);
  }, [projects]);

  // GSAP ScrollTrigger Pinned Gallery Interaction for Selected Projects
  useEffect(() => {
    const sectionEl = selectedSectionRef.current;
    const viewportEl = galleryViewportRef.current;
    const trackEl = galleryTrackRef.current;

    if (!sectionEl || !viewportEl || !trackEl || prefersReducedMotion) {
      if (trackEl) {
        gsap.set(trackEl, { clearProps: 'transform' });
      }
      return;
    }

    // Dynamically calculate the exact scrolling distance from the gallery's actual content dimensions
    const getScrollDistance = () => {
      if (!viewportEl || !trackEl) return 0;
      const trackHeight = trackEl.scrollHeight;
      const viewportHeight = viewportEl.clientHeight;
      return Math.max(0, trackHeight - viewportHeight);
    };

    const ctx = gsap.context(() => {
      gsap.set(trackEl, { y: 0 });

      gsap.to(trackEl, {
        y: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          pin: true,
          scrub: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
        },
      });
    }, sectionEl);

    // Recalculate dimensions on resize or when gallery content dimensions change
    let resizeTimer: number | undefined;
    const handleResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });
      resizeObserver.observe(trackEl);
      resizeObserver.observe(viewportEl);
    }

    return () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      ctx.revert();
    };
  }, [displayedProjects, prefersReducedMotion]);

  const capabilities = [
    { label: 'Web Development', icon: Monitor },
    { label: 'Android Apps', icon: Smartphone },
    { label: 'UI/UX Design', icon: LayoutGrid },
    { label: 'Custom Software', icon: Code2 },
    { label: 'Optimization', icon: Database },
    { label: 'Support', icon: Headphones },
  ];

  return (
    <div className="bg-[#0b1210] text-[#f5f2eb] overflow-x-hidden">
      {/* 01 — Hero Section matching Screen 01 */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#1b2b24]">
        {/* Subtle ambient luxury backdrop gradient */}
        <div className="absolute inset-0 bg-radial-[at_top_right] from-[#16382e]/25 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Typography & CTAs */}
            <div className="lg:col-span-6 space-y-6">
              {/* Main Headline */}
              <h1 className="font-serif-editorial text-4xl sm:text-6xl lg:text-[4.4rem] font-bold leading-[1.08] tracking-tight text-[#f5f2eb]">
                Digital<br />
                Experiences.<br />
                Built to<br />
                <span className="text-[#c9a66b]">Stand Apart.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed max-w-xl font-normal">
                From beautiful business websites to ambitious software products, MEDUUA
                transforms ideas into thoughtfully engineered digital experiences.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="px-6 py-3.5 bg-[#c9a66b] text-[#0b1210] text-xs font-bold rounded hover:bg-[#d8b77e] transition-colors flex items-center gap-2 cursor-pointer shadow-lg whitespace-nowrap shrink-0"
                >
                  <span>Start Your Project</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('projects')}
                  className="px-6 py-3.5 bg-[#121c18] border border-[#23382f] text-[#f5f2eb] text-xs font-semibold rounded hover:border-[#c9a66b] hover:text-[#c9a66b] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Explore Our Work
                </button>
              </div>
            </div>

            {/* Right Column: CodePen Home SVG Sphere Animation with anime.js */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <SvgSphereAnimation />
            </div>
          </div>

          {/* Capabilities Pill Strip */}
          <div className="mt-14 pt-8 border-t border-[#1b2b24]/90 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs text-[#94a3b8]">
            {capabilities.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-2.5 py-1 px-1.5 rounded hover:text-[#f5f2eb] transition-colors"
                >
                  <span className="p-1.5 rounded bg-[#13201b] border border-[#23382f] text-[#c9a66b] shrink-0">
                    <Icon className="w-3.5 h-3.5 stroke-[1.8]" />
                  </span>
                  <span className="font-medium text-[#cbd5e1] truncate">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 01B — Selected Projects (Pinned Scroll Gallery with GSAP ScrollTrigger) */}
      <section
        ref={selectedSectionRef}
        className={`bg-[#f5f2eb] text-[#111715] ${
          prefersReducedMotion
            ? 'py-16 lg:py-24'
            : 'h-screen overflow-hidden flex flex-col pt-20 pb-8 lg:pt-24 lg:pb-10'
        }`}
      >
        <div className="max-w-7xl w-full mx-auto px-6 flex flex-col flex-1 min-h-0">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#111715]/15 shrink-0 bg-[#f5f2eb] relative z-10">
            <div className="space-y-2 max-w-2xl">
              <h2 className="font-serif-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[#111715]">
                Selected Projects
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#111715] hover:text-[#c9a66b] transition-colors cursor-pointer shrink-0"
            >
              <span>View All Work</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pinned Gallery Viewport Container */}
          <div
            ref={galleryViewportRef}
            className={
              prefersReducedMotion
                ? 'pt-10'
                : 'flex-1 min-h-0 overflow-hidden relative pt-8'
            }
          >
            {/* Existing 16 Projects in 4-Column and 4-Row Grid */}
            <div
              ref={galleryTrackRef}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch will-change-transform pb-4"
            >
              {displayedProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => onNavigate('case-study', proj.slug)}
                  className="group cursor-pointer flex flex-col space-y-3"
                >
                  {/* Screenshot Container with Rounded Rect & External Link Badge */}
                  <div className="relative aspect-[16/9.8] rounded-xl overflow-hidden bg-[#0c1613] border border-[#d6cfc0] shadow-sm group-hover:shadow-md transition-shadow">
                    <img
                      src={proj.screenshotUrl}
                      alt={proj.title}
                      onLoad={() => ScrollTrigger.refresh()}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white/90 group-hover:bg-[#c9a66b] group-hover:text-[#0b1210] transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Typography info */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                        {proj.category}
                      </span>
                      <span className="text-[10px] text-[#94a3b8] font-mono-tabular">
                        {proj.year}
                      </span>
                    </div>
                    <h3 className="font-serif-editorial text-sm sm:text-[15px] font-bold text-[#111715] group-hover:text-[#c9a66b] transition-colors line-clamp-1 uppercase">
                      {proj.cardTitle || proj.title}
                    </h3>
                    <p className="text-xs text-[#64748b] truncate font-medium">
                      {proj.categorySubtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
