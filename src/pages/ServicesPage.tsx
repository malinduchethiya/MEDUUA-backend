import React from 'react';
import {
  Globe,
  Layers,
  Smartphone,
  PenTool,
  Settings,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { PageRoute } from '../components/Layout';

interface ServicesPageProps {
  onNavigate: (page: PageRoute, projectSlug?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const serviceCards = [
    {
      number: '01',
      title: 'Website Design & Development',
      description: 'Custom, high-performance websites designed to elevate your brand and deliver real results.',
      icon: Globe,
      image: '/assets/extracted/service_web_dev.png',
    },
    {
      number: '02',
      title: 'Full-Stack Web Applications',
      description: 'Scalable, secure, and feature-rich web applications built for your unique needs.',
      icon: Layers,
      image: '/assets/extracted/service_fullstack.png',
    },
    {
      number: '03',
      title: 'Android App Development',
      description: 'Engaging Android applications that reach your audience and create lasting impact.',
      icon: Smartphone,
      image: '/assets/extracted/service_android.png',
    },
    {
      number: '04',
      title: 'UI/UX Design',
      description: 'User-centered designs that are beautiful, intuitive, and built to convert.',
      icon: PenTool,
      image: '/assets/extracted/service_uiux.png',
    },
    {
      number: '05',
      title: 'Custom Software Solutions',
      description: 'Tailored software to streamline operations, solve complex challenges, and fuel growth.',
      icon: Settings,
      image: '/assets/extracted/service_software.png',
    },
    {
      number: '06',
      title: 'Website Improvement & Optimization',
      description: 'Enhance performance, user experience, and SEO to get more from your existing website.',
      icon: BarChart3,
      image: '/assets/extracted/service_optimization.png',
    },
  ];

  return (
    <div className="bg-[#0b1210] text-[#f5f2eb]">
      {/* 04A — Hero matching Screen 04 */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[#1b2b24]">
        {/* Architectural backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url('/assets/extracted/services_hero.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1210] via-[#0b1210]/85 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-[#a3b899]">
                <span>Independent Digital Development Studio</span>
                <span className="text-[#c9a66b]">—</span>
                <span>Sri Lanka</span>
              </div>

              <h1 className="font-serif-editorial text-4xl sm:text-6xl lg:text-[4.75rem] font-bold tracking-tight text-[#f5f2eb] leading-[1.08]">
                Our Services
              </h1>

              <div className="space-y-2 max-w-2xl text-sm sm:text-base text-[#94a3b8] leading-relaxed">
                <p className="font-medium text-[#cbd5e1]">
                  Complete digital solutions for modern businesses and ambitious ideas.
                </p>
                <p>
                  From strategy and design to development and optimization, we help you build
                  meaningful digital experiences that drive real results.
                </p>
              </div>
            </div>

            {/* Right Column Editorial Motto */}
            <div className="lg:col-span-4 flex lg:justify-end">
              <div className="border-l-2 border-[#c9a66b]/40 pl-6 space-y-1 font-mono-tabular text-xs sm:text-sm tracking-[0.25em] text-[#cbd5e1] uppercase">
                <p className="text-[#c9a66b] font-semibold">Ideas</p>
                <p>Products</p>
                <p>Experiences</p>
                <p className="text-white/40">That</p>
                <p className="text-[#c9a66b] font-semibold">Stand Apart</p>
                <div className="w-12 h-[2px] bg-[#c9a66b] mt-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04B — Six Horizontal Service Cards matching Screen 04 */}
      <section className="bg-[#f5f2eb] text-[#111715] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {serviceCards.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.number}
                  onClick={() => onNavigate('contact')}
                  className="bg-[#ffffff] border border-[#e5dfd3] rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-6 cursor-pointer hover:border-[#c9a66b] hover:shadow-xl transition-all duration-200 group"
                >
                  {/* Left Content */}
                  <div className="flex-1 space-y-3 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f5f2eb] border border-[#e2dcd0] flex items-center justify-center text-[#111715] group-hover:text-[#c9a66b] group-hover:border-[#c9a66b]/50 transition-colors shrink-0">
                        <Icon className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      <span className="font-mono-tabular text-xs font-bold tracking-wider text-[#c9a66b]">
                        {service.number}
                      </span>
                    </div>

                    <h2 className="font-serif-editorial text-lg sm:text-xl font-bold text-[#111715] group-hover:text-[#c9a66b] transition-colors">
                      {service.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed line-clamp-2">
                      {service.description}
                    </p>

                    <div className="pt-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[#d6cfc0] text-[#111715] group-hover:border-[#c9a66b] group-hover:bg-[#c9a66b] group-hover:text-[#0b1210] transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  {/* Right Image Preview */}
                  <div className="w-full sm:w-48 lg:w-52 aspect-[4/3] rounded-xl overflow-hidden bg-[#0c1613] border border-[#e5dfd3] shrink-0 shadow-sm">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
