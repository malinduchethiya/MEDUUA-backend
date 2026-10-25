import React, { useState } from 'react';
import { Monitor, Maximize2, X } from 'lucide-react';

interface ProjectVisualProps {
  src: string;
  alt: string;
  category?: string;
  year?: string;
  aspectRatio?: '16:9' | '4:3';
  enableLightbox?: boolean;
  className?: string;
}

export const ProjectVisual: React.FC<ProjectVisualProps> = ({
  src,
  alt,
  category = 'Digital Platform',
  year = '2026',
  aspectRatio = '16:9',
  enableLightbox = false,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const aspectClass = aspectRatio === '16:9' ? 'aspect-video' : 'aspect-4/3';

  return (
    <>
      <div
        className={`relative overflow-hidden bg-[#111715] border border-[#C9A66B]/25 group ${aspectClass} ${className}`}
      >
        {!imgError && src ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div className="w-full h-full flex flex-col justify-between p-6 bg-[#102B25] text-[#F4F0E7]">
            <div className="flex items-center justify-between border-b border-[#C9A66B]/20 pb-3 text-xs font-mono-tabular text-[#C9A66B]">
              <span>{category}</span>
              <span>{year}</span>
            </div>
            <div className="my-auto py-4">
              <Monitor className="w-8 h-8 text-[#C9A66B] mb-3 stroke-[1.25]" />
              <p className="font-serif-editorial text-2xl font-semibold tracking-tight text-[#F4F0E7]">
                {alt}
              </p>
              <p className="text-xs text-[#F4F0E7]/60 mt-1">
                MEDUUA Interactive Architecture Showcase
              </p>
            </div>
            <div className="border-t border-[#C9A66B]/20 pt-3 flex items-center justify-between text-[11px] font-mono-tabular text-[#F4F0E7]/60">
              <span>VIEWPORT 1440PX</span>
              <span>PRODUCTION BUILD</span>
            </div>
          </div>
        )}

        {enableLightbox && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(true);
            }}
            aria-label={`Inspect ${alt} fullscreen`}
            className="absolute bottom-3 right-3 px-3 py-1.5 bg-[#111715]/90 border border-[#C9A66B]/40 text-[#F4F0E7] text-xs font-medium flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-150 hover:border-[#C9A66B] hover:text-[#C9A66B] whitespace-nowrap shrink-0"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Inspect Interface</span>
          </button>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#111715]/95 flex items-center justify-center p-4 md:p-10"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <div
            className="relative max-w-6xl w-full bg-[#102B25] border border-[#C9A66B]/40 p-4 md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#C9A66B]/20">
              <div>
                <h3 className="font-serif-editorial text-2xl text-[#F4F0E7] font-semibold">
                  {alt}
                </h3>
                <p className="text-xs text-[#C9A66B] mt-0.5">
                  {category} · {year}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="px-3 py-1.5 border border-[#F4F0E7]/25 text-xs text-[#F4F0E7] hover:border-[#C9A66B] hover:text-[#C9A66B] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              >
                <X className="w-4 h-4" />
                <span>Close Preview</span>
              </button>
            </div>
            <div className="aspect-video w-full overflow-hidden bg-[#111715]">
              {!imgError && src ? (
                <img
                  src={src}
                  alt={alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#F4F0E7]">
                  <span>{alt}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
