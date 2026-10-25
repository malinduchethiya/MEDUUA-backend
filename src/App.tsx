/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { Layout, PageRoute } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { CaseStudyPage } from './pages/CaseStudyPage';
import { ServicesPage } from './pages/ServicesPage';
import { PricingPage } from './pages/PricingPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function parseHashRoute(): { page: PageRoute; slug: string | null } {
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  if (!raw || raw === 'home' || raw === '/') return { page: 'home', slug: null };
  const [segment, subSegment] = raw.split('/');
  switch (segment.toLowerCase()) {
    case 'home':
      return { page: 'home', slug: null };
    case 'work':
    case 'projects':
      return subSegment
        ? { page: 'case-study', slug: subSegment }
        : { page: 'projects', slug: null };
    case 'case-study':
      return { page: 'case-study', slug: subSegment || 'white-room-the-protocol' };
    case 'services':
      return { page: 'services', slug: null };
    case 'pricing':
      return { page: 'pricing', slug: null };
    case 'about':
      return { page: 'about', slug: null };
    case 'contact':
      return { page: 'contact', slug: null };
    case 'admin':
      return { page: 'admin', slug: null };
    default:
      return { page: 'home', slug: null };
  }
}

export default function App() {
  const initial = parseHashRoute();
  const [currentPage, setCurrentPage] = useState<PageRoute>(initial.page);
  const [activeProjectSlug, setActiveProjectSlug] = useState<string | null>(
    initial.slug || 'white-room-the-protocol'
  );

  useEffect(() => {
    const syncRouteFromLocation = () => {
      const parsed = parseHashRoute();
      setCurrentPage(parsed.page);
      if (parsed.slug) {
        setActiveProjectSlug(parsed.slug);
      }
    };
    window.addEventListener('hashchange', syncRouteFromLocation);
    window.addEventListener('popstate', syncRouteFromLocation);
    return () => {
      window.removeEventListener('hashchange', syncRouteFromLocation);
      window.removeEventListener('popstate', syncRouteFromLocation);
    };
  }, []);

  useEffect(() => {
    const titles: Record<PageRoute, string> = {
      home: 'MEDUUA — Digital Experiences & Software Studio',
      projects: 'Work & Projects — MEDUUA',
      'case-study': 'Case Study — MEDUUA',
      services: 'Services & Capabilities — MEDUUA',
      pricing: 'Pricing & Packages — MEDUUA',
      about: 'About Us — MEDUUA Studio',
      contact: 'Start a Project — MEDUUA',
      admin: 'Admin Portal — MEDUUA',
    };
    document.title = titles[currentPage] || 'MEDUUA — Digital Experiences & Software Studio';
  }, [currentPage]);

  const handleNavigate = (page: PageRoute, projectSlug?: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (projectSlug) {
      setActiveProjectSlug(projectSlug);
      window.location.hash = `#/projects/${projectSlug}`;
    } else if (page === 'home') {
      if (window.location.hash) {
        window.history.pushState(
          null,
          '',
          window.location.pathname + window.location.search
        );
      }
    } else {
      window.location.hash = `#/${page}`;
    }
  };

  return (
    <PortfolioProvider>
      <Layout currentPage={currentPage} onNavigate={handleNavigate}>
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'projects' && <ProjectsPage onNavigate={handleNavigate} />}
        {currentPage === 'case-study' && (
          <CaseStudyPage projectSlug={activeProjectSlug} onNavigate={handleNavigate} />
        )}
        {currentPage === 'services' && <ServicesPage onNavigate={handleNavigate} />}
        {currentPage === 'pricing' && <PricingPage onNavigate={handleNavigate} />}
        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'admin' && <AdminDashboardPage onNavigate={handleNavigate} />}
      </Layout>
    </PortfolioProvider>
  );
}
