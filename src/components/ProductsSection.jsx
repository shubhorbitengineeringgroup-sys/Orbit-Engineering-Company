import React from 'react';
import { 
  Gauge, 
  Activity, 
  Waves, 
  Cpu, 
  ArrowUpRight, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function ProductsSection({ onOpenQuote }) {
  return (
    <section id="products" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orbit-50 text-orbit-700 border border-orbit-200 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>High-Accuracy Instrumentation</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-slate-900 tracking-tight">
            Industrial Flow, Analyzers & <span className="bg-clip-text text-transparent bg-gradient-to-r from-orbit-600 to-sky-500">Smart Sensors</span>
          </h2>

          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Supplying BIS, CE, and ATEX certified measurement instruments engineered for harsh field conditions in municipal water boards and heavy process industries.
          </p>
        </div>

        {/* Products Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.products.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-3xl p-6 flex flex-col justify-between group card-3d border border-white/80 shadow-3d-card hover:border-orbit-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold text-orbit-700 bg-orbit-50 px-2.5 py-1 rounded-full border border-orbit-200">
                    {item.category}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-orbit-600 transition-colors">
                  {item.name}
                </h3>

                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 font-mono">
                  {item.specs}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={onOpenQuote}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-bold text-orbit-700 hover:text-white bg-orbit-50 hover:bg-orbit-600 rounded-xl transition-all"
                >
                  <span>Request Datasheet & Quote</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* IndiaMART Verified Marketplace Callout */}
        <div className="mt-12 glass-panel rounded-2xl p-6 max-w-3xl mx-auto border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orbit-900 text-white flex items-center justify-center font-bold text-sm">
              OES
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                Verified Seller on IndiaMART Marketplace
              </div>
              <div className="text-xs text-slate-500">
                Triple ISO Certified OEM / Supplier with 150+ 5-star customer reviews.
              </div>
            </div>
          </div>

          <a
            href={siteConfig.company.contact.indiamart}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orbit-900 text-white text-xs font-bold shadow hover:bg-orbit-800 transition-all hover:scale-105"
          >
            <span>Visit IndiaMART Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
}
