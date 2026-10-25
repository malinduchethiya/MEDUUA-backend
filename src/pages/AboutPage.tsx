import React from 'react';
import {
  PenTool,
  Layers,
  Search,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { PageRoute } from '../components/Layout';

interface AboutPageProps {
  onNavigate: (page: PageRoute, projectSlug?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const values = [
    {
      title: 'Design-First Mindset',
      description: 'We start with people and purpose. Good design is not just how it looks, but how it works and feels.',
      icon: PenTool,
    },
    {
      title: 'Modern Technologies',
      description: 'We use modern tools and proven technologies to build fast, secure and scalable digital experiences.',
      icon: Layers,
    },
    {
      title: 'Attention to Detail',
      description: 'From the big picture to the smallest interaction, we care about the details that make a real difference.',
      icon: Search,
    },
    {
      title: 'Practical Problem-Solving',
      description: 'We keep things clear, focused and realistic — finding solutions that create long-term value for your business.',
      icon: Settings,
    },
  ];

  return (
    <div className="bg-[#f5f2eb] text-[#111715]">
      {/* 06A — Top Split Hero matching Screen 06 */}
      <section className="border-b border-[#111715]/15 pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column Narrative & Stats */}
            <div className="lg:col-span-6 space-y-8">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#64748b]">
                <span>About MEDUUA</span>
                <span className="w-8 h-[1px] bg-[#64748b]/40" />
              </div>

              <h1 className="font-serif-editorial text-4xl sm:text-5xl lg:text-[3.8rem] font-bold tracking-tight text-[#111715] leading-[1.12]">
                Independent thinking.<br />
                Purposeful design.<br />
                Thoughtful{' '}
                <span className="text-[#c9a66b]">engineering.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-xl font-normal">
                MEDUUA is an independent digital development studio based in Sri Lanka. We help
                businesses turn ideas into meaningful digital experiences through a balance of
                strategic design, modern technology and practical engineering.
              </p>

              {/* 2 Key Stats with Divider */}
              <div className="flex items-center gap-10 pt-4 border-t border-[#111715]/15">
                <div className="space-y-1">
                  <p className="font-serif-editorial text-4xl sm:text-5xl font-bold text-[#111715]">
                    50+
                  </p>
                  <p className="text-[11px] font-bold tracking-wider uppercase text-[#64748b]">
                    Projects Delivered
                  </p>
                </div>

                <div className="h-12 w-[1px] bg-[#111715]/20" />

                <div className="space-y-1">
                  <p className="font-serif-editorial text-4xl sm:text-5xl font-bold text-[#111715]">
                    30+
                  </p>
                  <p className="text-[11px] font-bold tracking-wider uppercase text-[#64748b]">
                    Happy Clients
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Executive Studio Visual */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-[#d6cfc0] bg-[#0c1613]">
                <img
                  src="/assets/extracted/about_executive_studio.png"
                  alt="MEDUUA Executive Studio Workspace in Sri Lanka"
                  className="w-full h-auto object-cover transform hover:scale-[1.01] transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 06B — Our Values matching Screen 06 */}
      <section className="py-16 lg:py-24 border-b border-[#111715]/15">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          {/* Header Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-5 space-y-2">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#64748b]">
                <span>Our Values</span>
                <span className="w-8 h-[1px] bg-[#64748b]/40" />
              </div>
              <h2 className="font-serif-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[#111715]">
                What Guides<br />Our Work
              </h2>
            </div>

            <div className="lg:col-span-7">
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl">
                We believe great digital products come from a clear understanding of people, a sharp
                eye for design and a commitment to building things that actually work. These values
                shape every project we take on.
              </p>
            </div>
          </div>

          {/* 4 Values Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {values.map((v) => {
              const Icon = v.icon;

              return (
                <div
                  key={v.title}
                  className="bg-[#ffffff] border border-[#e5dfd3] rounded-2xl p-6 sm:p-7 space-y-4 shadow-sm hover:shadow-md hover:border-[#c9a66b] transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#f5f2eb] border border-[#e2dcd0] flex items-center justify-center text-[#111715] group-hover:text-[#c9a66b] group-hover:border-[#c9a66b]/40 transition-colors">
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                  </div>

                  <h3 className="font-serif-editorial text-lg font-bold text-[#111715] group-hover:text-[#c9a66b] transition-colors">
                    {v.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 06C — Bottom Banner: Ready to bring your idea to life? matching Screen 06 */}
      <section className="relative overflow-hidden bg-[#0b1210] text-[#f5f2eb] py-16 lg:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url('/assets/extracted/about_cta_banner.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1210] via-[#0b1210]/90 to-[#0b1210]/70 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase text-[#a3b899]">
                <span>Let&apos;s Build Together</span>
                <span className="w-8 h-[1px] bg-[#a3b899]/40" />
              </div>
              <h2 className="font-serif-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[#f5f2eb]">
                Ready to bring<br />your idea to life?
              </h2>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed">
                Whether you have a clear plan or just a rough idea, we are here to help you shape it
                into a powerful digital experience.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="px-6 py-3.5 bg-[#c9a66b] text-[#0b1210] text-xs font-bold rounded hover:bg-[#d8b77e] transition-colors flex items-center gap-2 cursor-pointer shadow-lg whitespace-nowrap"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="px-6 py-3.5 bg-[#121c18] border border-[#23382f] text-[#f5f2eb] text-xs font-semibold rounded hover:border-[#c9a66b] hover:text-[#c9a66b] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Get in Touch
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
