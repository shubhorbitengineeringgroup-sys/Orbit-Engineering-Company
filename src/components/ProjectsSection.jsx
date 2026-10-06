import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  ArrowUpRight, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Droplets,
  Layers
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function ProjectsSection({ onSelectProject }) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Government Schemes',
    'Urban & Municipal',
    'Industrial Turnkey',
    'Lift Irrigation'
  ];

  // Filter projects
  const filteredProjects = siteConfig.projects.filter(project => {
    const matchesTab = activeTab === 'All' || project.category === activeTab;
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.scope.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <section id="projects" className="relative py-24 sm:py-32 overflow-hidden">
      
      {/* Background soft ambient */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orbit-50 text-orbit-700 border border-orbit-200 text-xs font-semibold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Proven Track Record</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-slate-900 tracking-tight">
            Our ₹200+ Crore <span className="bg-clip-text text-transparent bg-gradient-to-r from-orbit-600 to-sky-500">Project Portfolio</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            From state-level rural drinking water schemes to municipal automation and pharmaceutical-grade pure water plants across Madhya Pradesh and India.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-200/70 backdrop-blur-md rounded-2xl border border-slate-300/60 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === cat
                    ? 'bg-white text-orbit-700 shadow-md scale-105'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {cat} {cat === 'All' ? `(${siteConfig.projects.length})` : ''}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search scheme, district, or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orbit-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="glass-panel rounded-3xl p-6 relative flex flex-col justify-between group card-3d border border-white/80 shadow-3d-card hover:border-orbit-300 cursor-pointer"
            >
              <div>
                {/* Top Badge row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    project.status === 'Ongoing'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {project.status === 'Ongoing' ? (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Active Execution
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 100% Commissioned
                      </span>
                    )}
                  </span>

                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {project.category}
                  </span>
                </div>

                {/* Project Title */}
                <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-orbit-600 transition-colors leading-snug">
                  {project.name}
                </h3>

                {/* Client and Location */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <Building2 className="w-3.5 h-3.5 text-orbit-500 shrink-0" />
                    <span>Client: <strong className="font-semibold text-slate-900">{project.client}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{project.location}</span>
                  </div>
                </div>

                {/* Scope Preview */}
                <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {project.scope}
                </p>

                {/* Deliverables snippet pills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.deliverables?.slice(0, 2).map((item, idx) => (
                    <span key={idx} className="text-[10px] font-medium bg-orbit-50 text-orbit-700 px-2 py-0.5 rounded-md border border-orbit-100">
                      {item}
                    </span>
                  ))}
                  {project.deliverables?.length > 2 && (
                    <span className="text-[10px] font-semibold text-slate-400 px-1 py-0.5">
                      +{project.deliverables.length - 2} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{project.year}</span>
                <span className="inline-flex items-center gap-1 font-bold text-orbit-600 group-hover:translate-x-1 transition-transform">
                  <span>View Details</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 glass-panel rounded-3xl p-8 max-w-md mx-auto mt-8">
            <Droplets className="w-10 h-10 text-orbit-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800">No projects match your filter or search.</p>
            <p className="text-xs text-slate-500 mt-1">Try searching for "Bhopal", "MP Jal Nigam", "Lupin", or clear the filter.</p>
            <button
              onClick={() => { setActiveTab('All'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-orbit-600 text-white shadow"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
