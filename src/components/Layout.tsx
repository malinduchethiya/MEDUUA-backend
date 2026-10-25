import React, { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { getWhatsAppUrl, WHATSAPP_NUMBER_DISPLAY } from '../firebase';
import { usePortfolio } from '../context/PortfolioContext';

export type PageRoute =
  | 'home'
  | 'projects'
  | 'case-study'
  | 'services'
  | 'pricing'
  | 'about'
  | 'contact'
  | 'admin';

interface LayoutProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute, projectSlug?: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentPage, onNavigate, children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { projects } = usePortfolio();

  // Reference screens navigation tabs matching the image:
  // Home | Work | Services | Pricing | About | Contact
  const navItems: { label: string; page: PageRoute }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Work', page: 'projects' },
    { label: 'Services', page: 'services' },
    { label: 'Pricing', page: 'pricing' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNav = (page: PageRoute, slug?: string) => {
    setMobileMenuOpen(false);
    onNavigate(page, slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If on Admin page, we hide the public navbar because Admin has its own full-screen sidebar dashboard as shown in Screen 08!
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen bg-[#0b1210] text-[#f5f2eb]">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1210] text-[#f5f2eb] antialiased">

      {/* Main Top Navigation matching Reference Screens 01 to 07 */}
      <header className="sticky top-0 z-40 bg-[#0e1714]/95 border-b border-[#1f2e27] backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-6 py-4">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="text-xl font-bold tracking-[0.2em] uppercase text-[#f5f2eb] hover:text-[#c9a66b] transition-colors cursor-pointer"
          >
            MEDUUA
          </button>

          {/* Nav Links: Home | Work | Services | Pricing | About | Contact */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium">
            {navItems.map((item) => {
              const active =
                currentPage === item.page ||
                (item.page === 'projects' && currentPage === 'case-study');

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNav(item.page)}
                  className={`pb-1 transition-all duration-150 cursor-pointer relative ${
                    active
                      ? 'text-[#f5f2eb] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#c9a66b]'
                      : 'text-[#94a3b8] hover:text-[#f5f2eb]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Button: Start a Project -> */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNav('contact')}
              className="px-4 py-2 text-xs font-semibold tracking-wide bg-[#c9a66b] text-[#0b1210] rounded hover:bg-[#d8b77e] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm whitespace-nowrap shrink-0"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 text-[#f5f2eb] border border-[#1f2e27] rounded"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0e1714] border-t border-[#1f2e27] px-6 py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNav(item.page)}
                className={`block w-full text-left py-2 text-sm ${
                  currentPage === item.page ? 'text-[#c9a66b] font-bold' : 'text-[#f5f2eb]'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleNav('admin')}
              className="block w-full text-left py-2 text-sm text-[#c9a66b] border-t border-[#1f2e27] pt-3"
            >
              Admin Dashboard
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#090e0c] border-t border-[#1a2822] text-[#94a3b8] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-[#1a2822]">
            <div className="space-y-2">
              <span className="text-2xl font-bold tracking-[0.2em] text-[#f5f2eb]">
                MEDUUA
              </span>
              <div className="pt-1">
                <a
                  href={getWhatsAppUrl('Hello MEDUUA, I would like to inquire about a project.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#c9a66b] hover:underline"
                >
                  WhatsApp Direct: {WHATSAPP_NUMBER_DISPLAY}
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm">
              <button onClick={() => handleNav('home')} className="hover:text-[#c9a66b] cursor-pointer">
                Home
              </button>
              <button onClick={() => handleNav('projects')} className="hover:text-[#c9a66b] cursor-pointer">
                Work
              </button>
              <button onClick={() => handleNav('services')} className="hover:text-[#c9a66b] cursor-pointer">
                Services
              </button>
              <button onClick={() => handleNav('pricing')} className="hover:text-[#c9a66b] cursor-pointer">
                Pricing
              </button>
              <button onClick={() => handleNav('about')} className="hover:text-[#c9a66b] cursor-pointer">
                About
              </button>
              <button onClick={() => handleNav('contact')} className="hover:text-[#c9a66b] cursor-pointer">
                Contact
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© {new Date().getFullYear()} MEDUUA. Built to Stand Apart. All rights reserved.</p>
            <button
              onClick={() => handleNav('admin')}
              className="text-[#64748b] hover:text-[#c9a66b] transition-colors cursor-pointer text-[11px]"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
