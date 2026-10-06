import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  MapPin, 
  Users, 
  CheckCircle2, 
  TrendingUp,
  FileCheck2,
  PhoneCall
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function AboutSection({ onOpenQuote }) {
  return (
    <section id="about" className="relative py-24 sm:py-32 bg-slate-50/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left info column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orbit-100 text-orbit-800 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Established in 1998 • Bhopal Headquarters</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-slate-900 tracking-tight leading-tight">
              27+ Years of Engineering Solutions That Protect Lives & Water Resources
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Founded in 1998 in Bhopal, Madhya Pradesh, <strong className="text-slate-900">Orbit Engineering Solutions (OES)</strong> has evolved into India's foremost water engineering firm. With a portfolio exceeding <strong className="text-orbit-700">₹200+ Crore</strong> and over <strong className="text-orbit-700">150+ mega schemes</strong> delivered, we bring unmatched reliability to government schemes and critical industrial infrastructure.
            </p>

            {/* Triple ISO Certificate Cards */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Triple ISO Certified Excellence
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {siteConfig.company.certifications.map((cert, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-1.5 text-orbit-600 font-bold text-xs">
                      <FileCheck2 className="w-4 h-4" />
                      <span>{cert.code}</span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-600 mt-1">
                      {cert.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leadership mention */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3">
                Executive Leadership
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {siteConfig.company.leadership.map((leader, idx) => (
                  <div key={idx} className="glass-panel p-4 rounded-2xl border border-slate-200/80">
                    <div className="font-bold text-slate-900 font-display text-base">
                      {leader.name}
                    </div>
                    <div className="text-xs font-semibold text-orbit-600">
                      {leader.role} • {leader.experience}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {leader.focus}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right 3D Visual Card / Bhopal Office */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Main Office Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 card-3d border border-white shadow-3d-card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-orbit-700 bg-orbit-50 px-3 py-1 rounded-full border border-orbit-200">
                  Headquartered in Bhopal
                </span>
                <span className="text-xs text-slate-500 font-medium">Pan-India Support</span>
              </div>

              <h3 className="text-xl font-bold font-display text-slate-900">
                Our Bhopal Office
              </h3>

              <div className="mt-4 space-y-3.5">
                {siteConfig.company.offices.map((office, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-orbit-600" />
                        <span>{office.type}</span>
                      </span>
                      <span className="text-slate-500 font-normal">{office.phone}</span>
                    </div>
                    <div className="text-slate-600 mt-1 pl-5">
                      {office.address}
                    </div>
                    <a href={office.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-orbit-600 font-semibold mt-3 ml-5">Get directions <MapPin className="w-3.5 h-3.5" /></a>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  Business Hours: Mon–Sat 10:00 AM – 7:00 PM
                </div>
                <button
                  onClick={onOpenQuote}
                  className="px-4 py-2 rounded-xl bg-orbit-600 hover:bg-orbit-700 text-white text-xs font-bold shadow transition-all hover:scale-105"
                >
                  Contact Our Engineers
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
