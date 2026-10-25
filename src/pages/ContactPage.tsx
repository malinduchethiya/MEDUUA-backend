import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Instagram,
  Dribbble,
  Linkedin,
  Youtube,
  ArrowRight,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { getWhatsAppUrl, WHATSAPP_NUMBER_DISPLAY } from '../firebase';

export const ContactPage: React.FC = () => {
  const { submitInquiry } = usePortfolio();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    try {
      await submitInquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() ? `+94 ${phone.trim()}` : '+94 74 037 5253',
        packageInterest: projectType || 'General Inquiry',
        budget: budget || 'Not specified',
        message: description.trim() || 'No description provided.',
      });
      setSubmitted(true);
    } catch {
      setErrorMsg('Inquiry could not be saved right now. Please message us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0b1210] text-[#f5f2eb]">
      {/* 07A — Hero Section matching Screen 07 */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-[#1b2b24]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: `url('/assets/extracted/contact_hero.png')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1210] via-[#0b1210]/90 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Narrative */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-[#a3b899]">
                <span>Get in Touch</span>
                <span className="text-[#c9a66b]">—</span>
                <span>We&apos;re Here to Help</span>
              </div>

              <h1 className="font-serif-editorial text-4xl sm:text-6xl lg:text-[4.75rem] font-bold tracking-tight text-[#f5f2eb] leading-[1.08]">
                Let&apos;s Talk About<br />
                <span className="text-[#c9a66b]">Your Idea.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#94a3b8] max-w-2xl leading-relaxed">
                From a simple website to a complex digital platform, we&apos;re here to listen, plan
                and build together. Tell us about your idea and we&apos;ll get back to you as soon as
                possible.
              </p>
            </div>

            {/* Right Column Editorial Motto */}
            <div className="lg:col-span-4 flex lg:justify-end">
              <div className="border-l-2 border-[#c9a66b]/40 pl-6 space-y-1 font-mono-tabular text-xs sm:text-sm tracking-[0.25em] text-[#cbd5e1] uppercase">
                <p className="text-[#c9a66b] font-semibold">Ideas</p>
                <p>Strategy</p>
                <p>Design</p>
                <p>Development</p>
                <p className="text-[#c9a66b] font-semibold">Real Results</p>
                <div className="w-12 h-[2px] bg-[#c9a66b] mt-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 07B — Contact Split matching Screen 07 */}
      <section className="bg-[#0b1210] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* Left Card: Warm Ivory Form */}
            <div className="lg:col-span-7 bg-[#f5f2eb] text-[#111715] rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#e5dfd3]">
              {submitted ? (
                <div className="py-12 text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-[#102b25]/10 text-[#102b25] mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h2 className="font-serif-editorial text-3xl font-bold text-[#111715]">
                    Message Received!
                  </h2>
                  <p className="text-sm text-[#475569] max-w-md mx-auto leading-relaxed">
                    Thank you, {name}. Our team will review your project details and get back to
                    you shortly.
                  </p>
                  <div className="pt-4 flex flex-wrap justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setName('');
                        setEmail('');
                        setPhone('');
                        setDescription('');
                      }}
                      className="px-6 py-3 bg-[#111715] text-[#f5f2eb] text-xs font-semibold rounded-lg hover:bg-[#1a2822] cursor-pointer"
                    >
                      Send Another Message
                    </button>
                    <a
                      href={getWhatsAppUrl(`Hello MEDUUA, my name is ${name}. I just sent an inquiry on your website.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-[#c9a66b] text-[#0b1210] text-xs font-bold rounded-lg hover:bg-[#d8b77e]"
                    >
                      Chat on WhatsApp Now
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#111715]">
                      Send Us a Message
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed">
                      Fill out the form below with your project details. Our team will review your
                      message and get back to you with the next steps, usually within 24 hours.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-100 text-red-800 rounded-lg text-xs font-medium border border-red-200">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#111715]">
                        Full Name <span className="text-[#c9a66b]">*</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d6cfc0] rounded-lg text-xs sm:text-sm text-[#111715] focus:outline-none focus:border-[#c9a66b] focus:ring-1 focus:ring-[#c9a66b]"
                      />
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#111715]">
                        Email Address <span className="text-[#c9a66b]">*</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        required
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d6cfc0] rounded-lg text-xs sm:text-sm text-[#111715] focus:outline-none focus:border-[#c9a66b] focus:ring-1 focus:ring-[#c9a66b]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* WhatsApp / Phone with flag */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#111715]">
                        WhatsApp / Phone <span className="text-[#c9a66b]">*</span>
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 border border-r-0 border-[#d6cfc0] bg-[#eee8db] text-[#111715] text-xs font-medium rounded-l-lg shrink-0">
                          🇱🇰 +94
                        </span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="74 037 5253"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#d6cfc0] rounded-r-lg text-xs sm:text-sm text-[#111715] focus:outline-none focus:border-[#c9a66b] focus:ring-1 focus:ring-[#c9a66b]"
                        />
                      </div>
                    </div>

                    {/* Project Type */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#111715]">
                        Project Type <span className="text-[#c9a66b]">*</span>
                      </label>
                      <select
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#d6cfc0] rounded-lg text-xs sm:text-sm text-[#111715] focus:outline-none focus:border-[#c9a66b] focus:ring-1 focus:ring-[#c9a66b]"
                      >
                        <option value="">Select a project type</option>
                        <option value="Website Design & Development">Website Design & Development</option>
                        <option value="Full-Stack Web Applications">Full-Stack Web Applications</option>
                        <option value="Android App Development">Android App Development</option>
                        <option value="UI/UX Design">UI/UX Design</option>
                        <option value="Custom Software Solutions">Custom Software Solutions</option>
                        <option value="Website Improvement & Optimization">Website Improvement & Optimization</option>
                      </select>
                    </div>
                  </div>

                  {/* Estimated Budget */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#111715]">Estimated Budget</label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#d6cfc0] rounded-lg text-xs sm:text-sm text-[#111715] focus:outline-none focus:border-[#c9a66b] focus:ring-1 focus:ring-[#c9a66b]"
                    >
                      <option value="">Select budget range</option>
                      <option value="Under LKR 15,000">Under LKR 15,000</option>
                      <option value="LKR 15,000 - 25,000">LKR 15,000 - 25,000</option>
                      <option value="LKR 25,000 - 50,000">LKR 25,000 - 50,000</option>
                      <option value="LKR 50,000+">LKR 50,000+</option>
                      <option value="Custom Quote">Custom Quote</option>
                    </select>
                  </div>

                  {/* Project Description */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-[#111715]">
                        Project Description <span className="text-[#c9a66b]">*</span>
                      </label>
                      <span className="text-[11px] text-[#64748b]">{description.length}/1000</span>
                    </div>
                    <textarea
                      value={description}
                      maxLength={1000}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      placeholder="Tell us about your idea, features, goals and any specific requirements..."
                      required
                      className="w-full px-3.5 py-2.5 bg-white border border-[#d6cfc0] rounded-lg text-xs sm:text-sm text-[#111715] focus:outline-none focus:border-[#c9a66b] focus:ring-1 focus:ring-[#c9a66b]"
                    />
                  </div>

                  {/* Submit Button & Trust Badge */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-8 py-3.5 bg-gradient-to-r from-[#c9a66b] to-[#d8b77e] text-[#0b1210] text-xs font-bold rounded-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      <span>{submitting ? 'Sending...' : 'Send Message'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2 text-[11px] text-[#64748b]">
                      <ShieldCheck className="w-4 h-4 text-[#c9a66b] shrink-0" />
                      <span>Your information is safe with us. We&apos;ll never share your details.</span>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Right Card: Dark Forest Green Contact Info matching Screen 07 */}
            <div className="lg:col-span-5 bg-[#0e1714] border border-[#23382f] rounded-3xl p-8 sm:p-10 flex flex-col justify-between space-y-8 shadow-2xl">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#a3b899]">
                    <span>Contact Information</span>
                  </div>
                  <h2 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#f5f2eb]">
                    Let&apos;s Build<br />
                    <span className="text-[#c9a66b]">Something Great.</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
                    Have a question, a project in mind, or just want to say hello? You can reach us
                    directly through the channels below. We&apos;d love to hear from you.
                  </p>
                </div>

                {/* Direct Channels */}
                <div className="space-y-5 pt-2">
                  {/* WhatsApp */}
                  <a
                    href={getWhatsAppUrl('Hello MEDUUA, I would like to discuss a project with you.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-3 rounded-xl bg-[#14231e] border border-[#243a30] hover:border-[#c9a66b] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#1b2f29] border border-[#2b4438] flex items-center justify-center text-[#c9a66b] shrink-0 group-hover:bg-[#c9a66b] group-hover:text-[#0b1210] transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                        WhatsApp / Phone
                      </p>
                      <p className="text-sm font-bold text-[#f5f2eb] mt-0.5">
                        {WHATSAPP_NUMBER_DISPLAY}
                      </p>
                      <p className="text-xs text-[#64748b] mt-0.5">
                        Chat with us on WhatsApp for a faster response.
                      </p>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:hello@meduua.com"
                    className="flex items-start gap-4 p-3 rounded-xl bg-[#14231e] border border-[#243a30] hover:border-[#c9a66b] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#1b2f29] border border-[#2b4438] flex items-center justify-center text-[#c9a66b] shrink-0 group-hover:bg-[#c9a66b] group-hover:text-[#0b1210] transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                        Email Address
                      </p>
                      <p className="text-sm font-bold text-[#f5f2eb] mt-0.5">hello@meduua.com</p>
                      <p className="text-xs text-[#64748b] mt-0.5">
                        Send us your project details anytime.
                      </p>
                    </div>
                  </a>

                  {/* Location */}
                  <div className="flex items-start gap-4 p-3 rounded-xl bg-[#14231e] border border-[#243a30]">
                    <div className="w-10 h-10 rounded-full bg-[#1b2f29] border border-[#2b4438] flex items-center justify-center text-[#c9a66b] shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                        Our Location
                      </p>
                      <p className="text-sm font-bold text-[#f5f2eb] mt-0.5">Sri Lanka</p>
                      <p className="text-xs text-[#64748b] mt-0.5">
                        Independent Digital Development Studio · Serving clients worldwide.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="pt-4 border-t border-[#1b2b24] space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
                  Follow Our Journey
                </p>
                <p className="text-xs text-[#64748b]">See our latest work, ideas and updates.</p>
                <div className="flex items-center gap-3 pt-1">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-[#14231e] border border-[#273d34] flex items-center justify-center text-[#cbd5e1] hover:text-[#c9a66b] hover:border-[#c9a66b] transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a
                    href="https://dribbble.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-[#14231e] border border-[#273d34] flex items-center justify-center text-[#cbd5e1] hover:text-[#c9a66b] hover:border-[#c9a66b] transition-colors"
                  >
                    <Dribbble className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-[#14231e] border border-[#273d34] flex items-center justify-center text-[#cbd5e1] hover:text-[#c9a66b] hover:border-[#c9a66b] transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-full bg-[#14231e] border border-[#273d34] flex items-center justify-center text-[#cbd5e1] hover:text-[#c9a66b] hover:border-[#c9a66b] transition-colors"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
