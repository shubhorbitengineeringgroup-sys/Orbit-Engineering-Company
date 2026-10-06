import React from 'react';
import { Award, Briefcase, CheckCircle2, TrendingUp } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function StatsCounter() {
  const stats = [
    {
      icon: TrendingUp,
      value: siteConfig.company.portfolio,
      label: "Project Portfolio",
      subtext: "Delivered across India",
      color: "from-blue-600 to-cyan-500"
    },
    {
      icon: Briefcase,
      value: `${siteConfig.company.experience} Years`,
      label: "Trusted Engineering Legacy",
      subtext: "Established in 1998",
      color: "from-sky-600 to-blue-500"
    },
    {
      icon: CheckCircle2,
      value: siteConfig.company.projectsDelivered,
      label: "Mega Schemes Commissioned",
      subtext: "WTP, STP, RO & Automation",
      color: "from-emerald-600 to-teal-500"
    },
    {
      icon: Award,
      value: "Triple ISO",
      label: "Certified Excellence",
      subtext: "ISO 9001 | 14001 | 45001",
      color: "from-amber-600 to-orange-500"
    }
  ];

  return (
    <section className="relative z-10 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="glass-panel rounded-2xl p-6 relative overflow-hidden group card-3d border border-white/80 shadow-3d-card"
            >
              {/* Subtle background glow */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-orbit-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-slate-700 mt-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {stat.subtext}
                  </div>
                </div>

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shadow-md group-hover:rotate-6 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              {/* Bottom active line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orbit-500 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
