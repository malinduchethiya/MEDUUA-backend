import React, { useState } from 'react';
import {
  Check,
  ArrowRight,
  Edit2,
  RotateCcw,
  Clock,
  ShieldCheck,
  X,
  Save,
  CheckCircle2,
  Info,
  Sparkles,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  CUSTOM_DEVELOPMENT_SOLUTIONS,
  IMPORTANT_PACKAGE_INFORMATION,
  PricingTierItem,
} from '../data/defaultData';
import { PageRoute } from '../components/Layout';
import { getWhatsAppUrl } from '../firebase';

interface PricingPageProps {
  onNavigate: (page: PageRoute, projectSlug?: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const {
    pricing,
    isAdmin,
    savePricingTier,
    resetPricingToDefaults,
    resetSinglePricingTier,
  } = usePortfolio();

  const [editMode, setEditMode] = useState(false);
  const [editingTier, setEditingTier] = useState<PricingTierItem | null>(null);
  const [featuresText, setFeaturesText] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmResetAll, setConfirmResetAll] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleOpenEdit = (tier: PricingTierItem) => {
    setEditingTier({ ...tier });
    setFeaturesText((tier.features || []).join('\n'));
    setSaving(false);
  };

  const handleSaveTier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTier) return;
    setSaving(true);
    try {
      const parsedFeatures = featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      await savePricingTier({
        ...editingTier,
        features:
          parsedFeatures.length > 0
            ? parsedFeatures
            : ['Modern, professional website design'],
        updatedAt: new Date().toISOString(),
      });
      setEditingTier(null);
      showToast(
        isAdmin
          ? `"${editingTier.name}" saved & synced to Cloud Firestore.`
          : `"${editingTier.name}" updated.`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleResetSingle = async (tier: PricingTierItem) => {
    await resetSinglePricingTier(tier.id);
    showToast(`Reset 0${tier.order}. ${tier.name} to default values.`);
  };

  const handleResetAllConfirmed = async () => {
    await resetPricingToDefaults();
    setConfirmResetAll(false);
    showToast('All Website Development Packages restored to default specifications.');
  };

  return (
    <div className="bg-[#0b1210] text-[#f5f2eb]">
      {/* 05A — Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[#1b2b24]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url('/assets/extracted/pricing_hero.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1210]/70 via-[#0b1210]/90 to-[#0b1210] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-[#a3b899]">
              <span>MEDUUA</span>
              <span className="text-[#c9a66b]">—</span>
              <span>Website Development Packages</span>
            </div>

            <h1 className="font-serif-editorial text-4xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-tight text-[#f5f2eb] leading-[1.08]">
              Website Development<br />
              <span className="text-[#c9a66b]">Packages.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#94a3b8] max-w-2xl leading-relaxed">
              Transparent starting packages crafted for individuals, growing businesses, and
              established brands—plus bespoke custom development tailored to your goals.
            </p>
          </div>

          {/* Interactive Edit Packages Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setEditMode((prev) => !prev)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                editMode
                  ? 'bg-[#c9a66b] text-[#0b1210] border-[#c9a66b] shadow-lg'
                  : 'bg-[#13201b] text-[#f5f2eb] border-[#263c33] hover:border-[#c9a66b]'
              }`}
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{editMode ? 'Done Editing Packages' : 'Edit Packages'}</span>
            </button>

            {editMode && (
              <>
                {confirmResetAll ? (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1a1212] border border-red-500/40 text-xs">
                    <span className="text-red-200 font-semibold">Reset all packages?</span>
                    <button
                      type="button"
                      onClick={handleResetAllConfirmed}
                      className="px-2.5 py-1 rounded bg-red-600 text-white font-bold cursor-pointer"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmResetAll(false)}
                      className="px-2 py-1 text-[#94a3b8] hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmResetAll(true)}
                    className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#13201b] text-[#cbd5e1] hover:text-[#c9a66b] border border-[#263c33] hover:border-[#c9a66b] flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Toast Feedback Banner */}
      {toastMsg && (
        <div className="bg-[#102b25] border-b border-[#c9a66b]/40 text-[#f5f2eb] py-3 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#c9a66b]" />
              <span>{toastMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMsg(null)}
              className="text-[#94a3b8] hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 05B — 3 Website Development Packages Grid */}
      <section className="bg-[#f5f2eb] text-[#111715] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 space-y-14">
          {/* Top Bar Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#e5dfd3]">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#64748b]">
                MEDUUA — Website Development Packages
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#475569]">
              <ShieldCheck className="w-4 h-4 text-[#c9a66b]" />
              <span>Starting Prices in Sri Lankan Rupees (LKR)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {pricing.map((tier, idx) => {
              const isHighlighted = tier.highlighted;
              const numLabel = tier.number || `0${idx + 1}`;
              const inquiryMsg = `Hello MEDUUA, I would like to inquire about the ${numLabel}. ${tier.name} — ${tier.price} package.`;

              return (
                <div
                  key={tier.id}
                  className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between relative transition-all duration-200 ${
                    isHighlighted
                      ? 'bg-[#0e1915] text-[#f5f2eb] border-2 border-[#c9a66b] shadow-xl'
                      : 'bg-[#ffffff] text-[#111715] border border-[#e5dfd3] shadow-sm hover:shadow-xl hover:border-[#c9a66b]'
                  }`}
                >
                  {/* Top Bar: Package Number & Edit Control */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <span
                      className={`text-xs font-mono-tabular uppercase tracking-widest font-bold ${
                        isHighlighted ? 'text-[#c9a66b]' : 'text-[#64748b]'
                      }`}
                    >
                      {numLabel}. {tier.name} — {tier.price}
                    </span>

                    <div className="flex items-center gap-2">
                      {isHighlighted && (
                        <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#c9a66b] text-[#0b1210] rounded">
                          Popular
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(tier)}
                        title={`Edit ${tier.name}`}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                          editMode
                            ? 'bg-[#c9a66b] text-[#0b1210] font-bold shadow-xs'
                            : isHighlighted
                            ? 'bg-[#162721] text-[#cbd5e1] hover:text-[#c9a66b] border border-[#263f36]'
                            : 'bg-[#f8f6f0] text-[#475569] hover:text-[#111715] border border-[#e2dcd0]'
                        }`}
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>

                      {editMode && (
                        <button
                          type="button"
                          onClick={() => handleResetSingle(tier)}
                          title="Reset this package to default"
                          className={`p-1.5 rounded-lg border cursor-pointer ${
                            isHighlighted
                              ? 'border-[#263f36] text-[#94a3b8] hover:text-white'
                              : 'border-[#e2dcd0] text-[#64748b] hover:text-[#111715]'
                          }`}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-5 flex-1">
                    {/* Package Name, Price, Tagline & Subtitle */}
                    <div className="space-y-2.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <h2
                          className={`font-serif-editorial text-2xl sm:text-3xl font-bold ${
                            isHighlighted ? 'text-[#f5f2eb]' : 'text-[#111715]'
                          }`}
                        >
                          {numLabel}. {tier.name}
                        </h2>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <p
                          className={`font-serif-editorial text-3xl sm:text-4xl font-bold tracking-tight ${
                            isHighlighted ? 'text-[#c9a66b]' : 'text-[#111715]'
                          }`}
                        >
                          {tier.price}
                        </p>
                      </div>

                      {tier.tagline && (
                        <p
                          className={`text-xs sm:text-sm font-bold leading-snug pt-1 ${
                            isHighlighted ? 'text-[#f5f2eb]' : 'text-[#111715]'
                          }`}
                        >
                          {tier.tagline}
                        </p>
                      )}

                      <p
                        className={`text-xs leading-relaxed ${
                          isHighlighted ? 'text-[#cbd5e1]' : 'text-[#475569]'
                        }`}
                      >
                        {tier.subtitle}
                      </p>
                    </div>

                    {/* Included Features List */}
                    <div
                      className={`pt-4 border-t space-y-2.5 ${
                        isHighlighted ? 'border-[#223830]' : 'border-[#111715]/10'
                      }`}
                    >
                      <p
                        className={`text-[11px] font-bold uppercase tracking-wider ${
                          isHighlighted ? 'text-[#c9a66b]' : 'text-[#111715]'
                        }`}
                      >
                        {tier.featuresHeading || 'Included Features'}
                      </p>
                      <div className="space-y-2 pt-1">
                        {tier.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2.5 text-xs">
                            <span className="w-4 h-4 rounded-full bg-[#c9a66b]/20 text-[#c9a66b] flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                            <span
                              className={`font-medium leading-snug ${
                                isHighlighted ? 'text-[#e2e8f0]' : 'text-[#334155]'
                              }`}
                            >
                              {feat}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Estimated Delivery & Best For */}
                    <div
                      className={`pt-4 border-t space-y-3 text-xs ${
                        isHighlighted ? 'border-[#223830]' : 'border-[#111715]/10'
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 py-2 px-3 rounded-xl border ${
                          isHighlighted
                            ? 'bg-[#14241e] border-[#233b32] text-[#cbd5e1]'
                            : 'bg-[#f8f6f0] border-[#e5dfd3] text-[#334155]'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 text-[#c9a66b] shrink-0" />
                        <span>
                          <strong className={isHighlighted ? 'text-[#f5f2eb]' : 'text-[#111715]'}>
                            Estimated Delivery:
                          </strong>{' '}
                          {tier.deliveryTime}
                        </span>
                      </div>

                      {tier.bestFor && (
                        <div className="leading-relaxed">
                          <span
                            className={`font-bold ${
                              isHighlighted ? 'text-[#f5f2eb]' : 'text-[#111715]'
                            }`}
                          >
                            Best For:{' '}
                          </span>
                          <span className={isHighlighted ? 'text-[#cbd5e1]' : 'text-[#475569]'}>
                            {tier.bestFor}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-7">
                    <a
                      href={getWhatsAppUrl(inquiryMsg)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-3.5 px-4 text-xs font-bold tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                        isHighlighted
                          ? 'bg-[#c9a66b] text-[#0b1210] hover:bg-[#d8b77e]'
                          : 'bg-[#111715] text-[#f5f2eb] hover:bg-[#c9a66b] hover:text-[#0b1210]'
                      }`}
                    >
                      <span>{tier.buttonText || 'GET STARTED'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 05C — CUSTOM DEVELOPMENT — Request a Quote */}
          <div className="rounded-3xl bg-[#0e1915] text-[#f5f2eb] border border-[#23382f] p-8 sm:p-10 lg:p-12 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase tracking-widest text-[#c9a66b] font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>CUSTOM DEVELOPMENT — Request a Quote</span>
                </div>

                <h2 className="font-serif-editorial text-2xl sm:text-4xl font-bold text-[#f5f2eb] leading-tight">
                  Your ideas shouldn&apos;t be limited to a package.
                </h2>

                <p className="text-sm text-[#cbd5e1] font-medium">
                  Need something beyond a conventional business website?
                </p>

                <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                  Pricing depends on the functionality, complexity, integrations, and development
                  requirements.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="px-6 py-3.5 bg-[#c9a66b] text-[#0b1210] text-xs font-bold tracking-wider uppercase rounded-xl hover:bg-[#d8b77e] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg whitespace-nowrap"
                  >
                    <span>REQUEST A CUSTOM QUOTE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 bg-[#13221c] border border-[#233b32] rounded-2xl p-6 sm:p-8 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#c9a66b]">
                  MEDUUA can discuss custom solutions including:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CUSTOM_DEVELOPMENT_SOLUTIONS.map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-xs sm:text-sm">
                      <span className="w-4 h-4 rounded-full bg-[#c9a66b]/20 text-[#c9a66b] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span className="text-[#e2e8f0] font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 05D — Important Package Information */}
          <div className="rounded-2xl bg-[#ffffff] border border-[#e5dfd3] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#111715]">
              <Info className="w-4 h-4 text-[#c9a66b] shrink-0" />
              <h3 className="font-serif-editorial text-lg sm:text-xl font-bold text-[#111715]">
                Important Package Information
              </h3>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-xs text-[#475569] leading-relaxed">
              {IMPORTANT_PACKAGE_INFORMATION.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#c9a66b] font-bold shrink-0">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Fixed Package Editor Modal */}
      {editingTier && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-[#f5f2eb] text-[#111715] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[#e5dfd3] my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e2dcd0] pb-4">
              <div>
                <span className="text-[10px] font-mono-tabular uppercase tracking-widest text-[#64748b] font-bold">
                  EDIT PACKAGE 0{editingTier.order}
                </span>
                <h2 className="font-serif-editorial text-2xl font-bold text-[#111715]">
                  {editingTier.name} — {editingTier.price}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditingTier(null)}
                className="p-1.5 rounded-lg text-[#64748b] hover:text-[#111715] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTier} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Package Name *</label>
                  <input
                    type="text"
                    required
                    value={editingTier.name}
                    onChange={(e) =>
                      setEditingTier({ ...editingTier, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-[#d6cfc0] rounded-xl text-xs focus:outline-none focus:border-[#c9a66b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Price *</label>
                  <input
                    type="text"
                    required
                    value={editingTier.price}
                    onChange={(e) =>
                      setEditingTier({ ...editingTier, price: e.target.value })
                    }
                    placeholder="e.g. LKR 10,000"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#d6cfc0] rounded-xl text-xs focus:outline-none focus:border-[#c9a66b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Estimated Delivery *</label>
                  <input
                    type="text"
                    required
                    value={editingTier.deliveryTime}
                    onChange={(e) =>
                      setEditingTier({ ...editingTier, deliveryTime: e.target.value })
                    }
                    placeholder="e.g. 3–5 working days"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#d6cfc0] rounded-xl text-xs focus:outline-none focus:border-[#c9a66b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#111715]">Button Text *</label>
                  <input
                    type="text"
                    required
                    value={editingTier.buttonText}
                    onChange={(e) =>
                      setEditingTier({ ...editingTier, buttonText: e.target.value })
                    }
                    placeholder="e.g. GET STARTED"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#d6cfc0] rounded-xl text-xs focus:outline-none focus:border-[#c9a66b]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#111715]">Bold Tagline</label>
                <input
                  type="text"
                  value={editingTier.tagline || ''}
                  onChange={(e) =>
                    setEditingTier({ ...editingTier, tagline: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-[#d6cfc0] rounded-xl text-xs focus:outline-none focus:border-[#c9a66b]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#111715]">Package Subtitle *</label>
                <input
                  type="text"
                  required
                  value={editingTier.subtitle}
                  onChange={(e) =>
                    setEditingTier({ ...editingTier, subtitle: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-[#d6cfc0] rounded-xl text-xs focus:outline-none focus:border-[#c9a66b]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#111715]">Best For</label>
                <input
                  type="text"
                  value={editingTier.bestFor || ''}
                  onChange={(e) =>
                    setEditingTier({ ...editingTier, bestFor: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-white border border-[#d6cfc0] rounded-xl text-xs focus:outline-none focus:border-[#c9a66b]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#111715]">
                  Included Features (One per line) *
                </label>
                <textarea
                  rows={8}
                  required
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#d6cfc0] rounded-xl text-xs focus:outline-none focus:border-[#c9a66b] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 font-semibold text-[#111715] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingTier.highlighted}
                    onChange={(e) =>
                      setEditingTier({ ...editingTier, highlighted: e.target.checked })
                    }
                    className="rounded border-[#d6cfc0] text-[#c9a66b]"
                  />
                  <span>Highlight as Dark Gold Card</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    handleResetSingle(editingTier);
                    setEditingTier(null);
                  }}
                  className="text-[11px] font-semibold text-[#64748b] hover:text-[#111715] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Default</span>
                </button>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#e2dcd0]">
                <button
                  type="button"
                  onClick={() => setEditingTier(null)}
                  className="px-4 py-2.5 border border-[#d6cfc0] bg-white rounded-xl text-[#64748b] hover:text-[#111715] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#c9a66b] text-[#0b1210] font-bold rounded-xl hover:bg-[#d8b77e] flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Package'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
