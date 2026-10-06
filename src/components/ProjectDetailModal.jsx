import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  MessageSquare,
  Maximize2,
  ZoomIn
} from 'lucide-react';

export default function ProjectDetailModal({ project, onClose, onOpenQuote }) {
  const [fullscreenImage, setFullscreenImage] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (fullscreenImage) {
          setFullscreenImage(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenImage, onClose]);

  if (!project) return null;

  return (
    <>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
        <div onClick={onClose} className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity" />

        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8">
          
          {/* Header with Project Image & Fullscreen Trigger */}
          <div 
            onClick={() => setFullscreenImage(true)}
            className="relative h-60 sm:h-72 overflow-hidden bg-slate-900 group cursor-pointer"
          >
            <img
              src={project.image}
              alt={project.name}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=1000&q=80';
              }}
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

            {/* Click to expand photo badge */}
            <div className="absolute top-4 left-4 z-20">
              <span className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs font-medium backdrop-blur-sm flex items-center gap-1.5 transition-colors shadow">
                <ZoomIn className="w-3.5 h-3.5 text-sky-400" />
                <span>Click Photo to View Full Size</span>
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors z-20 backdrop-blur-sm cursor-pointer shadow"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Project Title & Metadata Overlay */}
            <div className="absolute bottom-5 left-5 right-5 text-white z-10 pointer-events-none">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e60aa] text-xs font-medium mb-2 shadow-sm">
                <span>{project.category}</span>
                <span>•</span>
                <span>{project.status}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold leading-snug">{project.name}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-sky-200 font-normal">
                <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-sky-300" />{project.client}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-sky-300" />{project.location}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-sky-300" />{project.year}</span>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-8 space-y-5 max-h-[58vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-3.5">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="text-xs text-slate-500 font-medium">Scale &amp; Geography</div>
                <div className="text-sm font-semibold text-slate-900 mt-1">{project.scale}</div>
              </div>
              <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-100">
                <div className="text-xs text-[#1e60aa] font-medium">Capacity / Metric</div>
                <div className="text-sm font-semibold text-[#1e60aa] mt-1">{project.metrics}</div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">Project Scope &amp; Engineering Summary</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 font-normal">
                {project.details}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2.5">Key Deliverables &amp; Technology</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.deliverables?.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-800 shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-[#1e60aa] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <a
              href={`https://wa.me/919039075048?text=Hello%20Orbit%20Engineering,%20I%20want%20to%20discuss%20a%20project%20similar%20to:%20${encodeURIComponent(project.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>

            <button
              onClick={() => {
                onClose();
                onOpenQuote?.();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#1e60aa] hover:bg-[#165091] rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <span>Inquire for Similar Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* ══ FULLSCREEN PHOTO LIGHTBOX ══ */}
      {fullscreenImage && (
        <div 
          onClick={() => setFullscreenImage(false)}
          className="fixed inset-0 z-[3000] bg-black/95 flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200 cursor-pointer"
        >
          <button
            onClick={() => setFullscreenImage(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 backdrop-blur-md cursor-pointer"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6" />
          </button>

          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-5xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl border border-white/20 bg-slate-900"
          >
            <img
              src={project.image}
              alt={project.name}
              className="w-full h-full object-contain max-h-[80vh]"
            />
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold">{project.name}</h3>
                <p className="text-xs text-sky-200">{project.client} • {project.location}</p>
              </div>
              <span className="text-xs text-slate-300 font-medium">Press Esc to exit</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
