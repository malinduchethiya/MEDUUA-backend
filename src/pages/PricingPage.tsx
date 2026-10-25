import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { PageRoute } from '../components/Layout';
import { getWhatsAppUrl } from '../firebase';

interface PricingPageProps {
  onNavigate: (page: PageRoute, projectSlug?: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const { pricing } = usePortfolio();

  return (
    <div className="bg-[#0b1210] text-[#f5f2eb]">
      {/* 05A — Hero matching Screen 05 */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[#1b2b24]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url('/assets/extracted/pricing_hero.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1210]/70 via-[#0b1210]/90 to-[#0b1210] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-[#a3b899]">
            <span>Pricing Plans</span>
            <span className="text-[#c9a66b]">—</span>
            <span>MEDUUA</span>
          </div>

          <h1 className="font-serif-editorial text-4xl sm:text-6xl lg:text-[4.75rem] font-bold tracking-tight text-[#f5f2eb] leading-[1.08]">
            Website Development<br />
            <span className="text-[#c9a66b]">Packages.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#94a3b8] max-w-2xl leading-relaxed">
            Professional websites crafted for your goals. Transparent pricing, premium quality,
            and everything you need to get online and grow.
          </p>
        </div>
      </section>

      {/* 05B — 3 Pricing Cards matching Screen 05 */}
      <section className="bg-[#f5f2eb] text-[#111715] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {pricing.map((tier) => {
              const isBusiness = tier.highlighted;
              const inquiryMsg = `Hello MEDUUA, I would like to get started with the ${tier.name} package (${tier.price}).`;

              return (
                <div
                  key={tier.id}
                  className="bg-[#ffffff] border border-[#e5dfd3] rounded-3xl p-8 sm:p-9 flex flex-col justify-between relative shadow-sm hover:shadow-xl hover:border-[#c9a66b] transition-all duration-200"
                >
                  {/* Most Popular Gold Badge */}
                  {isBusiness && (
                    <div className="absolute -top-3.5 right-6">
                      <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#c9a66b] text-[#0b1210] rounded-md shadow">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="space-y-6">
                    {/* Header */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#64748b]">
                        <span>{tier.name}</span>
                        <span className="w-8 h-[1px] bg-[#64748b]/40" />
                      </div>

                      <p className="font-serif-editorial text-3xl sm:text-4xl font-bold tracking-tight text-[#111715]">
                        {tier.price}
                      </p>

                      <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed pt-1">
                        {tier.subtitle}
                      </p>
                    </div>

                    {/* Features list */}
                    <div className="pt-4 border-t border-[#111715]/10 space-y-3.5">
                      {tier.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm">
                          <span className="w-4 h-4 rounded-full bg-[#c9a66b]/20 text-[#9c783c] flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                          <span className="text-[#334155] font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Get Started Button */}
                  <div className="pt-8">
                    <a
                      href={getWhatsAppUrl(inquiryMsg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-3.5 px-4 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                        isBusiness
                          ? 'bg-[#c9a66b] text-[#0b1210] hover:bg-[#d8b77e]'
                          : 'border border-[#d6cfc0] text-[#111715] hover:border-[#c9a66b] hover:text-[#c9a66b] bg-white'
                      }`}
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 05C — Bottom Dark Banner: Need a Custom Solution? matching Screen 05 */}
      <section className="relative overflow-hidden bg-[#0b1210] border-t border-[#1b2b24] py-16 lg:py-20 text-[#f5f2eb]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url('/assets/extracted/pricing_custom_banner.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1210] via-[#0b1210]/90 to-[#0b1210]/70 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-5">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase text-[#a3b899]">
            <span>Have a Unique Idea?</span>
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl font-bold tracking-tight text-[#f5f2eb]">
            Need a <span className="text-[#c9a66b]">Custom Solution?</span>
          </h2>

          <p className="text-sm sm:text-base text-[#94a3b8] max-w-2xl leading-relaxed">
            We build tailor-made websites and web applications to match your exact requirements.
            Let&apos;s create something extraordinary together.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="px-6 py-3.5 bg-[#c9a66b] text-[#0b1210] text-xs font-bold rounded hover:bg-[#d8b77e] transition-colors flex items-center gap-2 cursor-pointer shadow-lg whitespace-nowrap"
            >
              <span>Request a Custom Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
