import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, MapPin, ArrowUpRight, Search, Layers, Maximize2, Filter, Activity
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { assetPath } from '../config/deployment';
import { useScrollReveal } from '../hooks/useAnimations';

// Live project counter ticker
function LiveCounter() {
  const [count, setCount] = useState(19);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c); // stay at 19, just pulse effect
    }, 3000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
      {count}+ Active & Delivered
    </span>
  );
}

export default function ProjectsPage({ onSelectProject }) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const headerReveal = useScrollReveal();
  const gridReveal   = useScrollReveal();

  const categories = ['All', 'Government Schemes', 'Urban & Municipal', 'Industrial Turnkey', 'Lift Irrigation'];

  const filteredProjects = siteConfig.projects.filter(project => {
    const matchesTab    = activeTab === 'All' || project.category === activeTab;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase())
      || project.client.toLowerCase().includes(searchQuery.toLowerCase())
      || project.location.toLowerCase().includes(searchQuery.toLowerCase())
      || project.scope?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="w-full bg-[#f8fafc] text-slate-900 pt-28 pb-24">
      {/* Tech grid bg */}
      <div className="fixed inset-0 tech-grid-bg opacity-40 pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── HEADER ── */}
        <div ref={headerReveal.ref} className="reveal-up text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orbit-50 text-[#1e60aa] border border-orbit-200 text-[11px] font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>₹200+ Crore Project Portfolio</span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
            19+ Mega Water &amp; Automation Schemes
          </h1>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <LiveCounter />
            <p className="text-xs text-slate-500 font-normal">
              Delivering clean water across Madhya Pradesh &amp; India under JJM, AMRUT 2.0
            </p>
          </div>
        </div>

        {/* ── LIVE STATS ROW ── */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { val: '₹200+ Cr', lbl: 'Total Portfolio', clr: 'text-[#1e60aa]', bg: 'bg-blue-50', border: 'border-blue-100' },
            { val: '19+', lbl: 'Active Schemes', clr: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' },
            { val: '12 Districts', lbl: 'Coverage in MP', clr: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100' },
            { val: '5M+ People', lbl: 'Beneficiaries', clr: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-100' },
          ].map((s, i) => (
            <div key={i} className={`reveal-scale delay-${i * 100} ${s.bg} ${s.border} border rounded-2xl p-4 text-center hover-lift`}>
              <div className={`text-lg font-bold ${s.clr}`}>{s.val}</div>
              <div className="text-[11px] text-slate-600 font-medium mt-0.5">{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* ── FILTERS & SEARCH ── */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-200/60 backdrop-blur-md rounded-2xl border border-slate-300/50 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                  activeTab === cat
                    ? 'bg-[#1e60aa] text-white shadow-sm font-semibold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/60 font-medium'
                }`}
              >
                {cat} {cat === 'All' ? `(${siteConfig.projects.length})` : ''}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search scheme, district, or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e60aa] shadow-sm"
            />
          </div>
        </div>

        {/* Result count */}
        <div className="mt-3 text-xs text-slate-500 font-medium">
          Showing <span className="text-[#1e60aa] font-bold">{filteredProjects.length}</span> of {siteConfig.projects.length} schemes
        </div>

        {/* ── PROJECT CARDS GRID ── */}
        <div ref={gridReveal.ref} className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProjects.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => onSelectProject?.(project)}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`reveal-up delay-${Math.min(idx * 80, 600)} bg-white rounded-3xl overflow-hidden border border-slate-200/90 group card-3d cursor-pointer flex flex-col justify-between hover:border-[#1e60aa] hover:shadow-xl transition-all gradient-border`}
              style={{ boxShadow: hoveredId === project.id ? '0 20px 50px -10px rgba(30,96,170,0.2)' : '0 4px 16px -4px rgba(0,0,0,0.08)' }}
            >
              <div>
                {/* Image with overlay */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 img-zoom-wrap">
                  <img
                    src={assetPath(project.image)}
                    alt={project.name}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=1000&q=80'; }}
                    className="w-full h-full object-cover opacity-95 group-hover:opacity-100"
                  />

                  {/* Animated scan-line overlay on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-x-0 h-0.5 bg-sky-400/50 animate-[scanline_2s_ease-in-out_infinite]" style={{ top: '40%' }} />
                  </div>

                  <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-slate-800 shadow-sm border border-slate-100">
                    {project.category}
                  </div>
                  <div className={`absolute top-3.5 right-3.5 text-white px-2.5 py-0.5 rounded-full text-[10px] font-medium shadow-sm ${
                    project.status === 'Ongoing' ? 'bg-amber-600' : 'bg-emerald-600'
                  }`}>
                    {project.status === 'Ongoing' ? '● Active' : '✓ Commissioned'}
                  </div>

                  {/* Hover CTA overlay */}
                  <div className="absolute inset-0 bg-slate-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-full bg-slate-900/80 text-white text-xs font-medium backdrop-blur-sm flex items-center gap-1.5 shadow-lg">
                      <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
                      Open Blueprint &amp; Photo
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-[#1e60aa] transition-colors leading-snug">
                    {project.name}
                  </h3>

                  <div className="mt-2 space-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-[#1e60aa] shrink-0" />
                      <span>Client: <span className="font-semibold text-slate-800">{project.client}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{project.location}</span>
                    </div>
                  </div>

                  <p className="mt-2.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">{project.details}</p>

                  {/* Deliverable tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.deliverables?.slice(0, 2).map((item, dIdx) => (
                      <span key={dIdx} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/70">
                        {item}
                      </span>
                    ))}
                    {project.deliverables?.length > 2 && (
                      <span className="text-[10px] font-medium text-slate-400">+{project.deliverables.length - 2} more</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs mt-2">
                <span className="text-slate-400 font-normal">{project.year}</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#1e60aa] group-hover:translate-x-0.5 transition-transform">
                  View Technical Specs &amp; Blueprint
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
