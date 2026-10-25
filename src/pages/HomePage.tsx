import React from 'react';
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
import { PinnedFeaturedProjects } from '../components/PinnedFeaturedProjects';

interface HomePageProps {
  onNavigate: (page: PageRoute, projectSlug?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { projects } = usePortfolio();
  const archiveGridRef = React.useRef<HTMLElement | null>(null);

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

  // Featured projects for the GSAP ScrollTrigger pinned showcase (6 flagship projects)
  const featuredShowcaseProjects = React.useMemo(() => {
    const featured = projects.filter((p) => p.featured);
    if (featured.length >= 4) {
      return featured.slice(0, 6);
    }
    return displayedProjects.slice(0, 6);
  }, [projects, displayedProjects]);

  const handleScrollToGrid = () => {
    if (archiveGridRef.current) {
      archiveGridRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const capabilities = [
    { label: 'Web Development', icon: Monitor },
    { label: 'Android Apps', icon: Smartphone },
    { label: 'UI/UX Design', icon: LayoutGrid },
    { label: 'Custom Software', icon: Code2 },
    { label: 'Optimization', icon: Database },
    { label: 'Support', icon: Headphones },
  ];

  return (
    <div className="bg-[#0b1210] text-[#f5f2eb]">
      {/* 01 — Hero Section matching Screen 01 */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#1b2b24]">
        {/* Subtle ambient luxury backdrop gradient */}
        <div className="absolute inset-0 bg-radial-[at_top_right] from-[#16382e]/25 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Typography & CTAs */}
            <div className="lg:col-span-6 space-y-6">
              {/* Studio Kicker */}
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-medium tracking-[0.22em] uppercase text-[#a3b899]">
                <span>Independent Digital Development Studio</span>
                <span className="text-[#c9a66b]">—</span>
                <span>Sri Lanka</span>
              </div>

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

      {/* 01A — GSAP ScrollTrigger Pinned Featured Projects Showcase (starts right when end of Hero hits top of screen) */}
      <PinnedFeaturedProjects
        projects={featuredShowcaseProjects}
        onNavigate={onNavigate}
        onScrollToGrid={handleScrollToGrid}
      />

      {/* 01B — Complete Selected Projects Archive (4-Column x 4-Row Grid, resumes after pin releases) */}
      <section ref={archiveGridRef} className="bg-[#f5f2eb] text-[#111715] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#111715]/15">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#64748b]">
                <span>Complete Index</span>
                <span className="w-8 h-[1px] bg-[#64748b]/40" />
              </div>
              <h2 className="font-serif-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[#111715]">
                Selected Projects
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed pt-1">
                A closer look at some of our recent work. From immersive mobile apps to powerful
                content platforms, each project is built with purpose.
              </p>
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

          {/* 16 Projects in 4-Column and 4-Row Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
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
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
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
      </section>
    </div>
  );
};
