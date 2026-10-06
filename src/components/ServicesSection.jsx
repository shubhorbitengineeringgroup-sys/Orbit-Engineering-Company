import React from 'react';
import { 
  Droplets, 
  Cpu, 
  Wrench, 
  ShieldCheck, 
  Compass, 
  Sun, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

const iconMap = {
  Droplets,
  Cpu,
  Wrench,
  ShieldCheck,
  Compass,
  Sun
};

export default function ServicesSection({ onOpenQuote }) {
  return (
    <section id="services" className="relative py-24 sm:py-32 bg-slate-100/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orbit-100 text-orbit-800 border border-orbit-200 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Comprehensive Water & Automation Capabilities</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-slate-900 tracking-tight">
            Turnkey Engineering <span className="bg-clip-text text-transparent bg-gradient-to-r from-orbit-600 to-sky-500">Solutions & Services</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            From raw water intake to municipal distribution and factory zero-liquid-discharge (ZLD) systems — we execute single-window turnkey projects.
          </p>
        </div>

        {/* 3D Services Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteConfig.services.map((service) => {
            const Icon = iconMap[service.iconName] || Droplets;
            return (
              <div
                key={service.id}
                className="glass-panel rounded-3xl p-8 flex flex-col justify-between group card-3d border border-white/90 shadow-3d-card hover:border-orbit-400/60"
              >
                <div>
                  {/* Top Icon & Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orbit-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-orbit-500/25 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                      <Icon className="w-7 h-7" />
                    </div>

                    <span className="text-xs font-bold text-orbit-700 bg-orbit-50 px-3 py-1 rounded-full border border-orbit-200/80">
                      {service.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold font-display text-slate-900 group-hover:text-orbit-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Bullet points */}
                  <div className="mt-5 space-y-2 pt-4 border-t border-slate-100">
                    {service.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orbit-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-8 pt-4 border-t border-slate-100">
                  <button
                    onClick={onOpenQuote}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white hover:bg-orbit-50 text-slate-800 hover:text-orbit-700 font-bold text-xs border border-slate-200 transition-all shadow-sm group-hover:shadow"
                  >
                    <span>Inquire for this Service</span>
                    <ArrowRight className="w-3.5 h-3.5 text-orbit-500" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
