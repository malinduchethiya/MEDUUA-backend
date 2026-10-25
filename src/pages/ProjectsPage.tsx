import React, { useState } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { PageRoute } from '../components/Layout';

interface ProjectsPageProps {
  onNavigate: (page: PageRoute, projectSlug?: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate }) => {
  const { projects } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filterTabs = ['All', 'Mobile App', 'Web Platform', 'Streaming'];

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <div className="bg-[#0b1210] min-h-screen text-[#f5f2eb] py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        {/* Header matching Screen 02 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] uppercase text-[#a3b899]">
            <span>Portfolio</span>
            <span className="text-[#c9a66b]">—</span>
            <span>Selected Works</span>
          </div>

          <h1 className="font-serif-editorial text-4xl sm:text-6xl font-bold tracking-tight text-[#f5f2eb]">
            Our Work
          </h1>

          <p className="text-sm sm:text-base text-[#94a3b8] max-w-2xl leading-relaxed">
            A closer look at some of our recent work. From immersive mobile apps to powerful
            content platforms, each project is built with purpose.
          </p>

          {/* Filter Pills matching Screen 02 */}
          <div className="pt-4 flex flex-wrap items-center gap-2">
            {filterTabs.map((tab) => {
              const active = activeFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    active
                      ? 'bg-[#c9a66b] text-[#0b1210] shadow-sm'
                      : 'bg-[#15221d] text-[#94a3b8] hover:text-[#f5f2eb] border border-[#22332c]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Grid of Large Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="bg-[#101916] border border-[#22332c] rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#c9a66b]/60 transition-all duration-300 group shadow-lg"
            >
              <div>
                {/* Screenshot with hover zoom */}
                <div
                  onClick={() => onNavigate('case-study', project.slug)}
                  className="aspect-[16/10] bg-[#070d0b] overflow-hidden cursor-pointer relative"
                >
                  <img
                    src={project.screenshotUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white/90 group-hover:bg-[#c9a66b] group-hover:text-[#0b1210] transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 sm:p-7 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#c9a66b]">
                      {project.category}
                    </span>
                    <span className="text-[11px] text-[#64748b]">{project.year}</span>
                  </div>

                  <h2 className="font-serif-editorial text-2xl font-bold text-[#f5f2eb]">
                    <button
                      type="button"
                      onClick={() => onNavigate('case-study', project.slug)}
                      className="hover:text-[#c9a66b] transition-colors cursor-pointer text-left"
                    >
                      {project.title}
                    </button>
                  </h2>

                  <p className="text-xs text-[#94a3b8]">{project.categorySubtitle}</p>

                  <p className="text-xs sm:text-sm text-[#cbd5e1]/80 leading-relaxed pt-1">
                    {project.shortDescription}
                  </p>

                  {/* Tech Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-3">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 text-[11px] rounded bg-[#162520] border border-[#253931] text-[#cbd5e1]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Link */}
              <div className="px-6 sm:px-7 pb-6 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('case-study', project.slug)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#c9a66b] hover:text-[#d8b77e] transition-colors cursor-pointer"
                >
                  <span>View Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
