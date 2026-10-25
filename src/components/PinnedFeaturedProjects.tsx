import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ExternalLink, Layers } from 'lucide-react';
import { ProjectItem } from '../data/defaultData';
import { PageRoute } from './Layout';

gsap.registerPlugin(ScrollTrigger);

interface PinnedFeaturedProjectsProps {
  projects: ProjectItem[];
  onNavigate: (page: PageRoute, projectSlug?: string) => void;
  onScrollToGrid?: () => void;
}

export const PinnedFeaturedProjects: React.FC<PinnedFeaturedProjectsProps> = ({
  projects,
  onNavigate,
  onScrollToGrid,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const slideTextRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slideImageWrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const slideImageInnerRefs = useRef<(HTMLImageElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Detect OS / browser reduced-motion preference
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

  // Build GSAP ScrollTrigger pin & scrub timeline
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl || prefersReducedMotion || projects.length <= 1) {
      return;
    }

    const total = projects.length;
    const ctx = gsap.context(() => {
      // Initialize initial states for all slides (compositor-only: transform & opacity)
      projects.forEach((_, idx) => {
        const textEl = slideTextRefs.current[idx];
        const imgWrapEl = slideImageWrapRefs.current[idx];
        const imgInnerEl = slideImageInnerRefs.current[idx];

        if (idx === 0) {
          if (textEl) gsap.set(textEl, { autoAlpha: 1, yPercent: 0 });
          if (imgWrapEl) gsap.set(imgWrapEl, { autoAlpha: 1, yPercent: 0, scale: 1 });
          if (imgInnerEl) gsap.set(imgInnerEl, { scale: 1 });
        } else {
          if (textEl) gsap.set(textEl, { autoAlpha: 0, yPercent: 28 });
          if (imgWrapEl) gsap.set(imgWrapEl, { autoAlpha: 0, yPercent: 18, scale: 0.94 });
          if (imgInnerEl) gsap.set(imgInnerEl, { scale: 1.12 });
        }
      });

      if (progressFillRef.current) {
        gsap.set(progressFillRef.current, { scaleX: 1 / total, transformOrigin: 'left center' });
      }

      // Create master scrubbed timeline pinned right when the end of the Hero section hits the top of the screen
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * (total - 0.15) * 0.92)}`,
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const rawIdx = Math.min(
              total - 1,
              Math.max(0, Math.floor(self.progress * total))
            );
            setActiveIndex(rawIdx);
          },
        },
      });

      scrollTriggerRef.current = tl.scrollTrigger || null;

      // Initial dwell so the first featured project is admired right as pinning engages
      tl.to({}, { duration: 0.35 });

      // Step through each subsequent project showcase smoothly
      for (let i = 0; i < total - 1; i++) {
        const currentText = slideTextRefs.current[i];
        const nextText = slideTextRefs.current[i + 1];
        const currentImgWrap = slideImageWrapRefs.current[i];
        const nextImgWrap = slideImageWrapRefs.current[i + 1];
        const currentImgInner = slideImageInnerRefs.current[i];
        const nextImgInner = slideImageInnerRefs.current[i + 1];

        const label = `transition-${i}`;
        tl.addLabel(label);

        // Outgoing project text & image
        if (currentText) {
          tl.to(
            currentText,
            {
              autoAlpha: 0,
              yPercent: -28,
              duration: 0.85,
              ease: 'power2.inOut',
            },
            label
          );
        }

        if (currentImgWrap) {
          tl.to(
            currentImgWrap,
            {
              autoAlpha: 0,
              yPercent: -14,
              scale: 1.04,
              duration: 0.9,
              ease: 'power2.inOut',
            },
            label
          );
        }

        if (currentImgInner) {
          tl.to(
            currentImgInner,
            {
              scale: 1.08,
              duration: 0.9,
              ease: 'power2.inOut',
            },
            label
          );
        }

        // Incoming project image & text
        if (nextImgWrap) {
          tl.fromTo(
            nextImgWrap,
            { autoAlpha: 0, yPercent: 18, scale: 0.94 },
            {
              autoAlpha: 1,
              yPercent: 0,
              scale: 1,
              duration: 0.95,
              ease: 'power2.out',
            },
            `${label}+=0.12`
          );
        }

        if (nextImgInner) {
          tl.fromTo(
            nextImgInner,
            { scale: 1.12 },
            {
              scale: 1,
              duration: 1.05,
              ease: 'power2.out',
            },
            `${label}+=0.12`
          );
        }

        if (nextText) {
          tl.fromTo(
            nextText,
            { autoAlpha: 0, yPercent: 28 },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.9,
              ease: 'power2.out',
            },
            `${label}+=0.18`
          );
        }

        // Update progress bar fill
        if (progressFillRef.current) {
          tl.to(
            progressFillRef.current,
            {
              scaleX: (i + 2) / total,
              duration: 0.95,
              ease: 'none',
            },
            label
          );
        }

        // Dwell pause on the newly revealed project before transitioning to the next
        tl.to({}, { duration: 0.45 });
      }
    }, sectionEl);

    return () => {
      scrollTriggerRef.current = null;
      ctx.revert();
    };
  }, [projects, prefersReducedMotion]);

  // Allow clicking a step index to smoothly scroll to that project inside the pinned range
  const handleJumpToSlide = (targetIdx: number) => {
    const st = scrollTriggerRef.current;
    if (!st || prefersReducedMotion) {
      setActiveIndex(targetIdx);
      return;
    }
    const total = projects.length;
    if (total <= 1) return;
    const progress = (targetIdx + 0.35) / total;
    const targetScroll = st.start + (st.end - st.start) * Math.min(0.98, Math.max(0.02, progress));
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  if (projects.length === 0) return null;

  // Accessible fallback layout when user prefers reduced motion
  if (prefersReducedMotion) {
    return (
      <section
        aria-label="Featured Projects Showcase"
        className="bg-[#f5f2eb] text-[#111715] py-16 lg:py-24 border-b border-[#111715]/15"
      >
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#111715]/15">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#64748b]">
                <span>Featured Work Showcase</span>
                <span className="w-8 h-[1px] bg-[#64748b]/40" />
              </div>
              <h2 className="font-serif-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[#111715]">
                Selected Case Studies
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                Reduced motion mode active — displaying all featured project showcases in a static editorial stack.
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

          <div className="space-y-12">
            {projects.map((proj, idx) => (
              <div
                key={proj.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#ede8dd] border border-[#d6cfc0] rounded-2xl p-6 sm:p-8"
              >
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-[#64748b] font-mono-tabular">
                    <span className="font-bold text-[#111715]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="uppercase tracking-wider">{proj.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{proj.year}</span>
                  </div>
                  <h3 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#111715]">
                    {proj.title}
                  </h3>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {proj.shortDescription || proj.overview}
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onNavigate('case-study', proj.slug)}
                      className="px-5 py-2.5 bg-[#0b1210] text-[#f5f2eb] text-xs font-bold rounded hover:bg-[#c9a66b] hover:text-[#0b1210] transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>Explore Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <div
                    onClick={() => onNavigate('case-study', proj.slug)}
                    className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#0c1613] border border-[#d6cfc0] cursor-pointer"
                  >
                    <img
                      src={proj.screenshotUrl}
                      alt={proj.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Featured Projects Pinned Showcase"
      className="relative w-full h-screen min-h-[620px] bg-[#f5f2eb] text-[#111715] overflow-hidden flex flex-col justify-between pt-16 pb-6 sm:pt-20 sm:pb-8 border-b border-[#111715]/15 select-none"
    >
      {/* Subtle architectural grid lines & ambient warm paper texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 85% 20%, rgba(201, 166, 107, 0.16), transparent 55%)',
        }}
      />

      {/* Top Editorial Header Bar inside Pinned Viewport */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 relative z-20 shrink-0">
        <div className="flex items-center justify-between gap-4 pb-3 sm:pb-4 border-b border-[#111715]/15">
          <div className="flex items-center gap-3">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase text-[#64748b]">
              Featured Work
            </span>
            <span className="hidden sm:inline-block w-6 h-[1px] bg-[#111715]/25" />
            <span className="hidden sm:inline-block font-serif-editorial text-sm sm:text-base font-bold text-[#111715]">
              Selected Showcases
            </span>
          </div>

          {/* Right controls: Project Counter + Jump to Grid / All Work */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 font-mono-tabular text-xs sm:text-sm font-bold text-[#111715]">
              <span className="text-[#a67c37]">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-[#94a3b8]">/</span>
              <span className="text-[#64748b]">
                {String(projects.length).padStart(2, '0')}
              </span>
            </div>

            {onScrollToGrid && (
              <button
                type="button"
                onClick={onScrollToGrid}
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#111715] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Layers className="w-3.5 h-3.5 text-[#a67c37]" />
                <span>Full 16-Project Index</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111715] hover:text-[#a67c37] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>View All Work</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Center Stage: Overlapping Pinned Project Slides (Text Left, Showcase Visual Right) */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 flex-1 relative z-10 flex items-center my-2 sm:my-4 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 w-full h-full items-center">
          {/* Left Column: Stacked Project Narrative Panels */}
          <div className="lg:col-span-5 relative h-[250px] sm:h-[300px] lg:h-[420px] flex items-center">
            {projects.map((proj, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <div
                  key={proj.id}
                  ref={(el) => {
                    slideTextRefs.current[idx] = el;
                  }}
                  style={{
                    pointerEvents: isCurrent ? 'auto' : 'none',
                  }}
                  className="absolute inset-0 flex flex-col justify-center space-y-3 sm:space-y-4 lg:space-y-5 pr-2"
                >
                  {/* Editorial Index & Unboxed Metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-medium text-[#64748b]">
                    <span className="font-mono-tabular font-bold text-[#a67c37]">
                      0{idx + 1}.
                    </span>
                    <span className="uppercase tracking-[0.14em] font-bold text-[#111715]">
                      {proj.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{proj.client}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular">{proj.year}</span>
                  </div>

                  {/* Project Headline */}
                  <h2 className="font-serif-editorial text-2xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-[#111715] leading-[1.1] text-balance">
                    {proj.title}
                  </h2>

                  {/* Project Subtitle */}
                  <p className="text-xs sm:text-sm font-semibold text-[#a67c37] tracking-wide">
                    {proj.categorySubtitle}
                  </p>

                  {/* Project Description */}
                  <p className="text-xs sm:text-sm lg:text-[15px] text-[#334155] leading-relaxed line-clamp-3 sm:line-clamp-4 max-w-xl">
                    {proj.shortDescription || proj.overview}
                  </p>

                  {/* Clean Unboxed Technology Stack */}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="hidden sm:flex flex-wrap items-center gap-2 pt-1 text-xs text-[#64748b]">
                      <span className="font-semibold text-[#111715]">Stack:</span>
                      {proj.technologies.map((tech, tIdx) => (
                        <React.Fragment key={tech}>
                          <span>{tech}</span>
                          {tIdx < proj.technologies.length - 1 && (
                            <span aria-hidden="true" className="text-[#94a3b8]">
                              ·
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onNavigate('case-study', proj.slug)}
                      className="px-5 py-2.5 sm:px-6 sm:py-3 bg-[#0b1210] text-[#f5f2eb] text-xs font-bold rounded hover:bg-[#c9a66b] hover:text-[#0b1210] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md whitespace-nowrap shrink-0"
                    >
                      <span>View Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {proj.liveUrl && (
                      <button
                        type="button"
                        onClick={() => onNavigate('case-study', proj.slug)}
                        className="px-4 py-2.5 sm:px-5 sm:py-3 bg-transparent border border-[#111715]/25 text-[#111715] text-xs font-semibold rounded hover:border-[#111715] transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <span>Project Details</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Stacked High-Resolution Visual Showcases */}
          <div className="lg:col-span-7 relative h-[220px] sm:h-[310px] lg:h-[440px] flex items-center justify-center">
            {projects.map((proj, idx) => {
              const isCurrent = idx === activeIndex;
              return (
                <div
                  key={proj.id}
                  ref={(el) => {
                    slideImageWrapRefs.current[idx] = el;
                  }}
                  onClick={() => onNavigate('case-study', proj.slug)}
                  style={{
                    pointerEvents: isCurrent ? 'auto' : 'none',
                  }}
                  className="group absolute inset-0 w-full h-full rounded-2xl overflow-hidden bg-[#0c1613] border border-[#d6cfc0] shadow-[0_24px_60px_rgba(11,18,16,0.18)] cursor-pointer"
                >
                  <img
                    ref={(el) => {
                      slideImageInnerRefs.current[idx] = el;
                    }}
                    src={proj.screenshotUrl}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover will-change-transform"
                  />

                  {/* Subtle gradient scrim at bottom for caption legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1210]/70 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Top-Right Case Study Action Affordance */}
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#0b1210]/75 backdrop-blur-md border border-white/15 flex items-center justify-center text-[#f5f2eb] group-hover:bg-[#c9a66b] group-hover:text-[#0b1210] transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </div>

                  {/* Bottom-Left Showcase Frame Label */}
                  <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between gap-4 text-[#f5f2eb]">
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <span className="font-mono-tabular text-[#c9a66b] font-bold">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span aria-hidden="true" className="text-white/40">
                        /
                      </span>
                      <span className="truncate font-semibold">{proj.cardTitle || proj.title}</span>
                    </div>
                    <span className="text-[11px] text-[#cbd5e1] hidden sm:inline">
                      Click to open full case study →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Scrub Progress Bar & Interactive Step Selector */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 relative z-20 shrink-0 space-y-3">
        {/* Continuous Scrub Bar */}
        <div className="w-full h-[2px] bg-[#111715]/15 rounded-full overflow-hidden">
          <div
            ref={progressFillRef}
            className="h-full w-full bg-[#a67c37] origin-left will-change-transform"
          />
        </div>

        {/* Step Navigation Buttons */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5 sm:gap-3">
            {projects.map((proj, idx) => {
              const active = idx === activeIndex;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => handleJumpToSlide(idx)}
                  className={`px-2.5 py-1 rounded text-xs font-mono-tabular transition-colors cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    active
                      ? 'bg-[#111715] text-[#f5f2eb] font-bold'
                      : 'text-[#64748b] hover:text-[#111715] hover:bg-[#111715]/5'
                  }`}
                >
                  <span>{String(idx + 1).padStart(2, '0')}</span>
                  <span className="hidden md:inline font-sans font-medium max-w-[120px] truncate">
                    {proj.cardTitle || proj.title}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="text-[11px] text-[#64748b] hidden sm:inline whitespace-nowrap shrink-0">
            Scroll to transition projects · Unpins after {String(projects.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  );
};

export default PinnedFeaturedProjects;
