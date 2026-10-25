import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, LayoutDashboard, Home } from 'lucide-react';
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
  const { isAdmin, inquiries } = usePortfolio();

  // Close mobile menu automatically when currentPage changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPage]);

  // Primary navigation tabs with Home as the first and primary route
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
  };

  // Admin page uses its own full-screen dashboard layout
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen bg-[#0b1210] text-[#f5f2eb]">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1210] text-[#f5f2eb] antialiased">
      {/* Main Top Navigation */}
      <header className="sticky top-0 z-50 bg-[#0e1714]/95 border-b border-[#1f2e27] backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5">
          {/* Brand Logo -> Always navigates to Primary Home Page */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleNav('home')}
              title="Go to Home (Primary Page)"
              className="text-xl font-bold tracking-[0.2em] uppercase text-[#f5f2eb] hover:text-[#c9a66b] transition-colors cursor-pointer flex items-center gap-2"
            >
              <span>MEDUUA</span>
            </button>
          </div>

          {/* Desktop Navigation Links: Home | Work | Services | Pricing | About | Contact */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-1 lg:gap-2 text-[13px] font-medium"
          >
            {navItems.map((item) => {
              const active =
                currentPage === item.page ||
                (item.page === 'projects' && currentPage === 'case-study');

              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => handleNav(item.page)}
                  className={`px-3 lg:px-3.5 py-2 rounded-lg transition-all duration-150 cursor-pointer relative whitespace-nowrap flex items-center gap-1.5 ${
                    active
                      ? 'text-[#f5f2eb] font-semibold bg-[#15241f] after:content-[""] after:absolute after:bottom-0 after:left-2.5 after:right-2.5 after:h-[2px] after:bg-[#c9a66b]'
                      : 'text-[#94a3b8] hover:text-[#f5f2eb] hover:bg-[#13201b]/60'
                  }`}
                >
                  {item.page === 'home' && (
                    <Home className={`w-3.5 h-3.5 ${active ? 'text-[#c9a66b]' : 'text-[#64748b]'}`} />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons: Admin Portal + Start a Project + Mobile Toggle */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Desktop & Tablet Admin Portal Quick Button */}
            <button
              type="button"
              onClick={() => handleNav('admin')}
              title="Open Admin Dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#cbd5e1] hover:text-[#c9a66b] bg-[#13201b] border border-[#23382f] hover:border-[#c9a66b]/60 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#c9a66b]" />
              <span>Admin</span>
              {inquiries.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#c9a66b] text-[#0b1210] font-bold">
                  {inquiries.length}
                </span>
              )}
              {isAdmin && (
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  title="Signed in as verified Admin"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleNav('contact')}
              className="px-3.5 sm:px-4 py-2 text-xs font-semibold tracking-wide bg-[#c9a66b] text-[#0b1210] rounded-lg hover:bg-[#d8b77e] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm whitespace-nowrap shrink-0"
            >
              <span>Start a Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="md:hidden p-2 text-[#f5f2eb] hover:text-[#c9a66b] bg-[#13201b] border border-[#23382f] rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0e1714] border-t border-[#1f2e27] px-4 py-4 space-y-1.5 shadow-2xl">
            {navItems.map((item) => {
              const active =
                currentPage === item.page ||
                (item.page === 'projects' && currentPage === 'case-study');
              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => handleNav(item.page)}
                  className={`flex items-center justify-between w-full text-left px-3.5 py-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#162620] text-[#c9a66b] font-bold border border-[#c9a66b]/30'
                      : 'text-[#f5f2eb] hover:bg-[#13201b]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.page === 'home' && <Home className="w-4 h-4 text-[#c9a66b]" />}
                    <span>{item.label}</span>
                  </span>
                  {item.page === 'home' && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#1b2e27] text-[#a3b899] font-semibold">
                      Primary
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-2 mt-2 border-t border-[#1f2e27] flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleNav('admin')}
                className="flex items-center justify-between w-full text-left px-3.5 py-2.5 rounded-lg text-sm text-[#c9a66b] bg-[#13201b] border border-[#23382f] hover:border-[#c9a66b] font-semibold cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
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
              <button
                type="button"
                onClick={() => handleNav('home')}
                className="text-2xl font-bold tracking-[0.2em] text-[#f5f2eb] hover:text-[#c9a66b] transition-colors cursor-pointer"
              >
                MEDUUA
              </button>
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
              {navItems.map((item) => (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => handleNav(item.page)}
                  className={`hover:text-[#c9a66b] transition-colors cursor-pointer ${
                    currentPage === item.page ? 'text-[#c9a66b] font-semibold' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleNav('admin')}
                className="text-[#c9a66b] hover:underline cursor-pointer font-medium"
              >
                Admin
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p>© {new Date().getFullYear()} MEDUUA. Built to Stand Apart. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleNav('home')}
                className="text-[#64748b] hover:text-[#c9a66b] transition-colors cursor-pointer text-[11px]"
              >
                Home (Primary)
              </button>
              <span className="text-[#1f2e27]">•</span>
              <button
                type="button"
                onClick={() => handleNav('admin')}
                className="text-[#64748b] hover:text-[#c9a66b] transition-colors cursor-pointer text-[11px]"
              >
                Admin Portal
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
