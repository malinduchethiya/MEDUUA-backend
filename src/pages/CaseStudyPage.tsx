import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Smartphone,
  Code2,
  Brain,
  Calendar,
  Sparkles,
  BarChart2,
  ShieldCheck,
  Play,
  X,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { PageRoute } from '../components/Layout';

interface CaseStudyPageProps {
  projectSlug: string | null;
  onNavigate: (page: PageRoute, projectSlug?: string) => void;
}

export const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ projectSlug, onNavigate }) => {
  const { projects } = usePortfolio();
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);

  const currentIndex = Math.max(
    0,
    projects.findIndex((p) => p.slug === projectSlug || p.id === projectSlug)
  );
  const project = projects[currentIndex] || projects[0];

  const appScreenshots = [
    { title: 'Cover Screen', image: '/assets/extracted/casestudy_screen1.png' },
    { title: 'Choose Your Path', image: '/assets/extracted/casestudy_screen2.png' },
    { title: 'Reflection Screen', image: '/assets/extracted/casestudy_screen3.png' },
    { title: 'Progress & Clarity', image: '/assets/extracted/casestudy_screen4.png' },
    { title: 'Insights & Notes', image: '/assets/extracted/casestudy_screen5.png' },
    { title: 'Settings & Privacy', image: '/assets/extracted/casestudy_screen6.png' },
  ];

  return (
    <div className="bg-[#0b1210] text-[#f5f2eb]">
      {/* 03A — Dark Hero Section matching Screen 03 */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pb-24 border-b border-[#1b2b24]">
        <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-8">
          {/* Back link */}
          <button
            type="button"
            onClick={() => onNavigate('projects')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#94a3b8] hover:text-[#c9a66b] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Projects</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Title, Subtitle, Tags & Metrics */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase text-[#a3b899]">
                <span>Project Case Study</span>
                <span className="text-[#c9a66b]">—</span>
                <span>Mobile Application</span>
              </div>

              <h1 className="font-serif-editorial text-4xl sm:text-6xl lg:text-[4.75rem] font-bold tracking-tight text-[#f5f2eb] leading-[1.08]">
                WHITE ROOM:<br />
                <span className="text-[#c9a66b]">THE PROTOCOL</span>
              </h1>

              <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed max-w-xl">
                A cinematic psychological experience designed to challenge perspectives, build
                self-awareness, and guide users through a journey of inner discovery.
              </p>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#14231e] border border-[#273d34] text-[#cbd5e1]">
                  Android App
                </span>
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#14231e] border border-[#273d34] text-[#cbd5e1]">
                  Psychological Experience
                </span>
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#14231e] border border-[#273d34] text-[#cbd5e1]">
                  Self-Development
                </span>
              </div>

              {/* 4 Metrics in a row matching Screen 03 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-[#1b2b24]">
                <div>
                  <p className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#f5f2eb]">
                    150K+
                  </p>
                  <p className="text-[11px] font-medium text-[#94a3b8] mt-0.5">Downloads</p>
                </div>
                <div>
                  <p className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#c9a66b]">
                    4.8 ★
                  </p>
                  <p className="text-[11px] font-medium text-[#94a3b8] mt-0.5">Average Rating</p>
                </div>
                <div>
                  <p className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#f5f2eb]">
                    Featured
                  </p>
                  <p className="text-[11px] font-medium text-[#94a3b8] mt-0.5">Google Play</p>
                </div>
                <div>
                  <p className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#f5f2eb]">
                    Global
                  </p>
                  <p className="text-[11px] font-medium text-[#94a3b8] mt-0.5">Audience</p>
                </div>
              </div>
            </div>

            {/* Right Dual Phones Mockup matching Screen 03 */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md drop-shadow-2xl">
                <img
                  src="/assets/extracted/casestudy_dual_phones.png"
                  alt="WHITE ROOM: THE PROTOCOL App Interface Mockups"
                  className="w-full h-auto object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03B — Warm Ivory Body Area matching Screen 03 */}
      <section className="bg-[#f5f2eb] text-[#111715] py-16 lg:py-24 space-y-16">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {/* Top 3 Columns: Overview | Video Trailer | Challenge */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Col 1: Project Overview */}
            <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#64748b]">
                  <span>Project Overview</span>
                  <span className="w-8 h-[1px] bg-[#64748b]/40" />
                </div>
                <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#111715]">
                  An Interactive Journey Within
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  WHITE ROOM: THE PROTOCOL is a mobile application that blends storytelling,
                  psychology, and immersive design to create a transformative self-development
                  experience. Designed for modern minds, it uses interactive narratives and
                  thought-provoking scenarios to help users explore perception, build self-awareness,
                  and challenge their own realities.
                </p>
              </div>
            </div>

            {/* Col 2: Video Trailer Card */}
            <div className="lg:col-span-4 flex items-center">
              <div
                onClick={() => setTrailerModalOpen(true)}
                className="w-full relative aspect-video rounded-xl overflow-hidden bg-[#0c1613] shadow-md border border-[#d6cfc0] group cursor-pointer"
              >
                <img
                  src="/assets/extracted/casestudy_trailer_thumb.png"
                  alt="Watch Project Trailer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-[#c9a66b] text-[#0b1210] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-semibold text-white/90">
                  <span>Watch Project Trailer</span>
                  <span className="font-mono-tabular">01:24</span>
                </div>
              </div>
            </div>

            {/* Col 3: The Challenge */}
            <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#64748b]">
                  <span>The Challenge</span>
                  <span className="w-8 h-[1px] bg-[#64748b]/40" />
                </div>
                <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#111715]">
                  Turning Inner Exploration Into an Engaging Experience
                </h2>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  The challenge was to translate complex psychological concepts into an engaging,
                  accessible, and visually immersive mobile experience that motivates users to
                  reflect, grow, and return.
                </p>
              </div>
            </div>
          </div>

          {/* Specifications Row: 4 Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 sm:p-7 rounded-2xl bg-[#ffffff] border border-[#e5dfd3] shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#f5f2eb] border border-[#e2dcd0] flex items-center justify-center text-[#111715]">
                <Smartphone className="w-5 h-5 text-[#c9a66b]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                  Platform
                </p>
                <p className="text-sm font-bold text-[#111715]">Android</p>
                <p className="text-[11px] text-[#64748b]">Mobile App</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#f5f2eb] border border-[#e2dcd0] flex items-center justify-center text-[#111715]">
                <Code2 className="w-5 h-5 text-[#c9a66b]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                  Tech Stack
                </p>
                <p className="text-sm font-bold text-[#111715]">Kotlin</p>
                <p className="text-[11px] text-[#64748b]">Android Native</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#f5f2eb] border border-[#e2dcd0] flex items-center justify-center text-[#111715]">
                <Brain className="w-5 h-5 text-[#c9a66b]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                  Category
                </p>
                <p className="text-sm font-bold text-[#111715]">Self-Development</p>
                <p className="text-[11px] text-[#64748b]">Mental Wellness</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#f5f2eb] border border-[#e2dcd0] flex items-center justify-center text-[#111715]">
                <Calendar className="w-5 h-5 text-[#c9a66b]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                  Year
                </p>
                <p className="text-sm font-bold text-[#111715]">2024</p>
                <p className="text-[11px] text-[#64748b]">Launch</p>
              </div>
            </div>
          </div>

          {/* Key Features: 2x2 Grid matching Screen 03 */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#64748b]">
              <span>Key Features</span>
              <span className="w-8 h-[1px] bg-[#64748b]/40" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#ffffff] border border-[#e5dfd3] rounded-2xl p-6 space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#f5f2eb] flex items-center justify-center text-[#c9a66b]">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="font-serif-editorial text-base font-bold text-[#111715]">
                  Immersive Storytelling
                </h3>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  Cinematic narrative design that adapts to user choices.
                </p>
              </div>

              <div className="bg-[#ffffff] border border-[#e5dfd3] rounded-2xl p-6 space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#f5f2eb] flex items-center justify-center text-[#c9a66b]">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <h3 className="font-serif-editorial text-base font-bold text-[#111715]">
                  Personal Growth
                </h3>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  Guided reflections and psychological insights.
                </p>
              </div>

              <div className="bg-[#ffffff] border border-[#e5dfd3] rounded-2xl p-6 space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#f5f2eb] flex items-center justify-center text-[#c9a66b]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif-editorial text-base font-bold text-[#111715]">
                  Premium Visual Design
                </h3>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  A minimal, atmospheric interface built for focus.
                </p>
              </div>

              <div className="bg-[#ffffff] border border-[#e5dfd3] rounded-2xl p-6 space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#f5f2eb] flex items-center justify-center text-[#c9a66b]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-serif-editorial text-base font-bold text-[#111715]">
                  Progress Tracking
                </h3>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  Track your journey and unlock new perspectives.
                </p>
              </div>
            </div>
          </div>

          {/* 03C — App Screenshots Gallery (6 Screens matching Screen 03) */}
          <div className="space-y-6 pt-4 border-t border-[#111715]/15">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#64748b]">
                <span>App Screenshots</span>
              </div>
              <button
                type="button"
                onClick={() => setTrailerModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111715] hover:text-[#c9a66b] transition-colors cursor-pointer"
              >
                <span>View Full Gallery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {appScreenshots.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden bg-[#0c1613] border border-[#d6cfc0] shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
                  onClick={() => setTrailerModalOpen(true)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full aspect-[9/16] object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="p-2 bg-[#ffffff] border-t border-[#e2dcd0] text-center">
                    <p className="text-[10px] font-bold text-[#111715] truncate">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trailer Video Modal */}
      {trailerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="relative max-w-2xl w-full bg-[#0c1613] border border-[#273d34] rounded-2xl overflow-hidden shadow-2xl p-6 text-center space-y-6">
            <button
              onClick={() => setTrailerModalOpen(false)}
              className="absolute top-4 right-4 text-[#94a3b8] hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="space-y-2">
              <h3 className="font-serif-editorial text-2xl font-bold text-[#f5f2eb]">
                WHITE ROOM: THE PROTOCOL
              </h3>
              <p className="text-xs text-[#94a3b8]">Project Trailer &amp; Gallery Showcase</p>
            </div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center border border-[#1b2b24]">
              <img
                src="/assets/extracted/casestudy_trailer_thumb.png"
                alt="Trailer Scene"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setTrailerModalOpen(false)}
                className="px-6 py-2.5 bg-[#c9a66b] text-[#0b1210] text-xs font-bold rounded"
              >
                Close Showcase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
