import ResponsiveImage from './ResponsiveImage';
import React from 'react';
import { ArrowRight, Play, Settings, Recycle, Leaf } from 'lucide-react';
import PageLink from './PageLink';

export default function HeroSection({ onNavigate, onOpenQuote }) {
  return (
    <section className="home-entry-hero relative w-full h-screen min-h-[500px] max-h-[1200px] overflow-hidden bg-[#0c1c2e] select-none font-sans">

      {/* ════ 1. BASE CLEAN WATER TREATMENT BACKGROUND IMAGE ════ */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <ResponsiveImage
          src="/images/water_treatment_plant.jpg"
          alt="Water treatment plant with clarifier tanks and connected infrastructure"
          width="1024" height="576" loading="eager" fetchPriority="high" decoding="async"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* ════ 2. GRADIENT OVERLAYS (EXACT MATCH TO REFERENCE) ════ */}
      <div
        className="hidden sm:block absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, #ffffff 0%, #ffffff 25%, rgba(255, 255, 255, 0.98) 32%, rgba(255, 255, 255, 0.85) 38%, rgba(255, 255, 255, 0.45) 45%, rgba(255, 255, 255, 0.12) 52%, transparent 58%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 54%, rgba(0,0,0,0.5) 62%, transparent 72%)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 54%, rgba(0,0,0,0.5) 62%, transparent 72%)'
        }}
      />

      {/* Mobile top-down gradient */}
      <div
        className="sm:hidden absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.98) 45%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0.2) 75%, transparent 100%)'
        }}
      />

      {/* Top soft sky wash behind navbar */}
      <div
        className="absolute top-0 inset-x-0 h-28 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.05) 60%, transparent 100%)'
        }}
      />

      {/* Bottom dark vignette for bottom service navigation & stats contrast over water */}
      <div
        className="absolute bottom-0 inset-x-0 h-48 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(0deg, rgba(3, 12, 22, 0.90) 0%, rgba(3, 12, 22, 0.40) 50%, transparent 85%)'
        }}
      />

      {/* ════ 3. GLOWING CYAN TELEMETRY BEAM ════ */}
      <svg
        className="hidden sm:block absolute inset-0 w-full h-full z-[3] pointer-events-none"
        viewBox="0 0 1024 576"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.0" result="blur1" />
            <feGaussianBlur stdDeviation="0.8" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="cyanBeamGrad" gradientUnits="userSpaceOnUse" x1="100" y1="372" x2="685" y2="446">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0" />
            <stop offset="10%" stopColor="#00f0ff" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#00e5ff" stopOpacity="1" />
            <stop offset="85%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer soft cyan bloom */}
        <path
          d="M 100 372 L 320 418 L 535 446 L 685 446"
          stroke="#00e5ff"
          strokeWidth="2.8"
          strokeOpacity="0.4"
          filter="url(#cyanGlow)"
        />

        {/* Core glowing line */}
        <path
          d="M 100 372 L 320 418 L 535 446 L 685 446"
          stroke="url(#cyanBeamGrad)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* Crisp intense white center core */}
        <path
          d="M 130 378 L 320 418 L 535 446 L 660 446"
          stroke="#ffffff"
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeOpacity="0.95"
        />

        {/* Subtle animated telemetry pulse packet */}
        <circle className="home-entry-telemetry-packet" r="1.8" fill="#ffffff" filter="url(#cyanGlow)">
          <animateMotion
            path="M 100 372 L 320 418 L 535 446 L 685 446"
            dur="4.2s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* ════ 4. IN-SCENE BUILDING FACADE & OFFICIAL ORBIT LOGO ════ */}
      <div
        className="absolute z-[2] pointer-events-none hidden sm:block select-none"
        style={{
          left: '54.725%',
          top: '31.35%',
          width: '16.746%',
          height: '15.94%',
        }}
      >
        <ResponsiveImage
          src="/images/building_facade.png"
          alt="Orbit Engineering Building Facade"
          width="280" height="150" sizes="(min-width: 640px) 17vw, 280px" loading="lazy" decoding="async"
          className="w-full h-full object-fill pointer-events-none"
        />
      </div>

      {/* ════ 5. CIRCULAR CLARIFIER TANK CONCRETE WALL TEXT ════ */}
      <div
        className="absolute z-[7] pointer-events-none hidden md:block"
        style={{
          left: '77%',
          top: '73%',
          transform: 'perspective(900px) rotateY(2.5deg) skewY(-0.4deg)'
        }}
      >
        <div className="text-[11px] sm:text-[12.5px] lg:text-[13.5px] xl:text-[15px] font-black uppercase tracking-[0.08em] text-[#102535] leading-tight drop-shadow-sm">
          TREATING WATER
        </div>
        <div className="text-[11px] sm:text-[12.5px] lg:text-[13.5px] xl:text-[15px] font-black uppercase tracking-[0.08em] text-[#102535] leading-tight mt-0.5 sm:mt-1 drop-shadow-sm">
          EMPOWERING COMMUNITIES
        </div>
        <div className="w-9 sm:w-11 xl:w-13 h-[2.5px] bg-[#0060a8] mt-1.5 sm:mt-2 rounded-sm" />
      </div>

      {/* ════ 6. TOP-RIGHT STACKED DECORATIVE TYPOGRAPHY ════ */}
      <div
        className="absolute z-[4] pointer-events-none hidden md:block text-left"
        style={{
          right: '2.2%',
          top: '13%'
        }}
      >
        <div className="text-[11px] sm:text-[12px] lg:text-[13px] xl:text-[14px] font-black uppercase tracking-[0.18em] text-[#0d2136] leading-[1.35]">
          WATER<br />
          PEOPLE<br />
          PLANET<br />
          A BRIGHTER<br />
          TOMORROW
        </div>
        <div
          className="w-7 sm:w-9 xl:w-10 h-[2.5px] mt-2 rounded-full"
          style={{ background: 'linear-gradient(to right, #005088 45%, #0099e6 45%)' }}
        />
      </div>

      {/* ════ 7. FLOATING GLASS CARDS ════ */}
      {/* Card 1: 100% Cleaner Water Brighter Future */}
      <div
        className="absolute z-[5] hidden sm:block animate-float-slow"
        style={{
          left: '47.2%',
          top: '14.0%'
        }}
      >
        <div className="w-[210px] sm:w-[240px] xl:w-[270px] h-[114px] sm:h-[130px] xl:h-[146px] bg-white/[0.22] backdrop-blur-[14px] rounded-[20px] xl:rounded-[24px] p-3.5 sm:p-4 xl:p-4.5 flex flex-col justify-between border border-white/50 shadow-[0_12px_32px_rgba(0,25,50,0.07)]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 xl:w-13 xl:h-13 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-[#e0f2fe]">
              <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-6.5 sm:h-6.5 xl:w-7.5 xl:h-7.5 fill-[#0284c7]">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                <path d="M9 11 A 4 4 0 0 1 13 7" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.9" />
              </svg>
            </div>
            <div>
              <div className="text-[23px] sm:text-[27px] xl:text-[31px] font-bold text-[#0a192f] leading-none font-sans">
                100<span className="text-[13px] sm:text-[16px] xl:text-[18px] font-bold">%</span>
              </div>
              <div className="text-[11.5px] sm:text-[12.5px] xl:text-[13.5px] text-[#0f2137] font-semibold leading-tight mt-0.5 whitespace-nowrap">
                Cleaner Water
              </div>
              <div className="text-[10px] sm:text-[11px] xl:text-[12px] text-[#475569] font-normal leading-tight whitespace-nowrap">
                Brighter Future
              </div>
            </div>
          </div>

          <div className="w-full pb-0.5">
            <svg viewBox="0 0 180 22" className="w-full h-4 sm:h-4.5 xl:h-5 overflow-visible">
              <line x1="0" y1="16" x2="180" y2="16" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1" />
              <path
                d="M 0 16 L 68 16 C 78 16, 88 9, 98 9 C 108 9, 118 13, 130 13 C 144 13, 156 3, 168 3"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <circle cx="98" cy="9" r="2.5" fill="#0284c7" />
              <circle cx="168" cy="3" r="3" fill="#0284c7" />
              <circle cx="168" cy="3" r="5.5" fill="#38bdf8" opacity="0.45" />
            </svg>
          </div>
        </div>
      </div>

      {/* Card 2: Sustainable Infrastructure — repositioned to prevent overlap with Card 1 */}
      <div
        className="absolute z-[5] hidden sm:block animate-float-slow"
        style={{
          left: '68.5%',
          top: '19%',
          animationDelay: '1.2s'
        }}
      >
        <div className="w-[168px] sm:w-[192px] xl:w-[218px] h-[94px] sm:h-[108px] xl:h-[122px] bg-white/[0.22] backdrop-blur-[14px] rounded-[18px] xl:rounded-[22px] p-3 sm:p-3.5 xl:p-4 flex flex-col justify-between border border-white/50 shadow-[0_12px_32px_rgba(0,25,50,0.07)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9.5 h-9.5 sm:w-11 sm:h-11 xl:w-12 xl:h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-[#e0f2fe]">
              <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 xl:w-7 xl:h-7 fill-[#10b981]">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <div>
              <div className="text-[12.5px] sm:text-[13.5px] xl:text-[15px] font-bold text-[#0a192f] leading-tight">
                Sustainable
              </div>
              <div className="text-[12.5px] sm:text-[13.5px] xl:text-[15px] font-bold text-[#0a192f] leading-tight">
                Infrastructure
              </div>
            </div>
          </div>

          <div className="w-full pb-0.5">
            <svg viewBox="0 0 150 18" className="w-full h-3.5 sm:h-4 xl:h-4.5 overflow-visible">
              <line x1="0" y1="14" x2="150" y2="14" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1" />
              <path
                d="M 0 14 L 56 14 C 66 14, 76 7, 86 7 C 96 7, 106 11, 116 11 C 126 11, 136 2.5, 144 2.5"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <circle cx="86" cy="7" r="2.2" fill="#0284c7" />
              <circle cx="144" cy="2.5" r="2.8" fill="#0284c7" />
              <circle cx="144" cy="2.5" r="5" fill="#38bdf8" opacity="0.45" />
            </svg>
          </div>
        </div>
      </div>

      {/* Card 3: Smart Automation — top:40% gives 29px clear gap below Card 2's bottom (259px), 21px minimum even during float animation */}
      <div
        className="absolute z-[5] hidden sm:block animate-float-slow"
        style={{
          left: '80%',
          top: '40%',
          animationDelay: '2.4s'
        }}
      >
        <div className="w-[152px] sm:w-[172px] xl:w-[196px] h-[94px] sm:h-[108px] xl:h-[122px] bg-white/[0.22] backdrop-blur-[14px] rounded-[18px] xl:rounded-[22px] p-3 sm:p-3.5 xl:p-4 flex flex-col justify-between border border-white/50 shadow-[0_12px_32px_rgba(0,25,50,0.07)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9.5 h-9.5 sm:w-11 sm:h-11 xl:w-12 xl:h-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-[#e0f2fe]">
              <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 xl:w-7 xl:h-7 fill-[#0284c7]">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm7.4-4.5a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0-1.51 1V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06-.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <div>
              <div className="text-[12.5px] sm:text-[13.5px] xl:text-[15px] font-bold text-[#0a192f] leading-tight">
                Smart
              </div>
              <div className="text-[12.5px] sm:text-[13.5px] xl:text-[15px] font-bold text-[#0a192f] leading-tight">
                Automation
              </div>
            </div>
          </div>

          <div className="w-full pb-0.5">
            <svg viewBox="0 0 140 18" className="w-full h-3.5 sm:h-4 xl:h-4.5 overflow-visible">
              <line x1="0" y1="14" x2="140" y2="14" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1" />
              <path
                d="M 0 14 L 46 14 C 55 14, 65 7, 75 7 C 85 7, 95 11, 105 11 C 114 11, 124 2.5, 132 2.5"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <circle cx="75" cy="7" r="2.2" fill="#0284c7" />
              <circle cx="132" cy="2.5" r="2.8" fill="#0284c7" />
              <circle cx="132" cy="2.5" r="5" fill="#38bdf8" opacity="0.45" />
            </svg>
          </div>
        </div>
      </div>

      {/* ════ 8. HERO LEFT COLUMN: TYPOGRAPHY & CTAS ════ */}
      {/* pt is a FIXED CSS value matching the navbar's known height (68px transparent state)
          — NOT derived from JS/scroll state — so the eyebrow is never overlapped on first paint */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div
          className="home-entry-hero__copy w-full h-full px-6 sm:px-10 lg:px-[5.4%] pt-[68px] sm:pt-[74px] lg:pt-[80px] xl:pt-[86px] pointer-events-auto"
        >
          <div className="max-w-[680px] text-left">

            {/* Eyebrow */}
            <div className="text-[11px] sm:text-[12px] lg:text-[13px] xl:text-[14px] font-bold uppercase tracking-[0.22em] text-[#4d6278] mb-2 sm:mb-2.5 xl:mb-3">
              CLEANER WATER &nbsp;·&nbsp; HEALTHIER TOMORROW
            </div>

            {/* Main Heading: 3 strict architectural lines */}
            <h1 className="font-sans font-bold tracking-[-0.03em] leading-[1.02] text-[34px] sm:text-[46px] md:text-[54px] lg:text-[60px] xl:text-[70px] 2xl:text-[76px]">
              <span className="text-[#061526] block">Engineering</span>
              <span className="text-[#0072ce] block">Sustainable</span>
              <span className="text-[#061526] block whitespace-nowrap">Water Solutions</span>
            </h1>

            {/* Supporting Paragraph with exact 3-line wrap */}
            <p className="text-[13.5px] sm:text-[14.5px] lg:text-[15px] xl:text-[16.5px] text-[#2c3e50] leading-[1.65] mt-3.5 sm:mt-4 xl:mt-4.5 mb-5 sm:mb-6 xl:mb-7 max-w-[580px] font-normal">
              At Orbit Engineering, we design, build and deliver{' '}
              <br className="hidden sm:inline" />
              advanced water &amp; wastewater treatment solutions for a{' '}
              <br className="hidden sm:inline" />
              cleaner, healthier and more sustainable world.
            </p>

            {/* CTA Buttons Row */}
            <div className="home-entry-hero__actions flex flex-row items-center gap-4 sm:gap-5 xl:gap-6">
              {/* Primary CTA */}
              <PageLink
                page="solutions" onNavigate={onNavigate}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3 sm:px-7 sm:py-3.5 xl:px-8 xl:py-4 rounded-full bg-[#0070bb] hover:bg-[#005ea0] text-white text-[13.5px] sm:text-[14.5px] xl:text-[16px] font-semibold shadow-lg shadow-[#0070bb]/30 transition-all duration-200 hover:scale-[1.02] cursor-pointer whitespace-nowrap"
              >
                <span>Explore Our Solutions</span>
                <ArrowRight className="w-4 h-4 xl:w-4.5 xl:h-4.5 stroke-[2.4]" />
              </PageLink>

              {/* Secondary CTA: Frosted glass pill — matches floating card glass style */}
              <PageLink
                page="about" onNavigate={onNavigate}
                className="inline-flex items-center gap-3 pl-2 pr-5 py-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-[10px] border border-white/40 shadow-[0_4px_16px_rgba(0,30,60,0.12)] transition-all duration-200 hover:scale-[1.02] cursor-pointer group"
              >
                {/* Circular play icon */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 xl:w-12 xl:h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#0070bb] group-hover:scale-105 transition-transform shrink-0">
                  <Play className="w-4 h-4 xl:w-4.5 xl:h-4.5 fill-[#0070bb] text-[#0070bb] translate-x-0.5" />
                </div>
                <span className="text-[13.5px] sm:text-[14.5px] xl:text-[16px] font-semibold text-[#0a1f38] whitespace-nowrap">Watch Our Story</span>
              </PageLink>
            </div>

          </div>
        </div>
      </div>

      {/* ════ 9. BOTTOM SERVICE NAVIGATION (BOTTOM-LEFT) WITH DIVIDERS ════ */}
      <div
        className="absolute z-[6] hidden md:flex items-center gap-2 xl:gap-3 2xl:gap-4.5"
        style={{
          left: '2%',
          bottom: '4.5%'
        }}
      >
        {/* Item 1: Water Treatment Plants */}
        <div className="flex flex-col items-center text-center gap-2 w-[98px] xl:w-[114px] 2xl:w-[128px]">
          <div className="w-9 h-9 xl:w-10 xl:h-10 2xl:w-11 2xl:h-11 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-7.5 h-7.5 xl:w-8.5 xl:h-8.5 2xl:w-9.5 2xl:h-9.5" fill="none">
              <path d="M12 2.8 C12 2.8 6.5 9.8 6.5 14.5 C6.5 17.5 8.9 20 12 20 C15.1 20 17.5 17.5 17.5 14.5 C17.5 9.8 12 2.8 12 2.8 Z" stroke="#ffffff" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M5.5 7.5 C4.2 9.2 4.2 10.8 4.8 12" stroke="#00e5ff" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M18.5 7.5 C19.8 9.2 19.8 10.8 19.2 12" stroke="#00e5ff" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-[11px] xl:text-[12px] 2xl:text-[13px] font-normal text-white/90 leading-[1.25]">
            Water Treatment<br />Plants
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 xl:h-9 2xl:h-10 w-[1px] bg-white/20 self-center" />

        {/* Item 2: Automation & Control Systems */}
        <div className="flex flex-col items-center text-center gap-2 w-[112px] xl:w-[130px] 2xl:w-[148px]">
          <div className="w-9 h-9 xl:w-10 xl:h-10 2xl:w-11 2xl:h-11 flex items-center justify-center shrink-0">
            <Settings className="w-7 h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 text-white stroke-[1.8]" />
          </div>
          <div className="text-[11px] xl:text-[12px] 2xl:text-[13px] font-normal text-white/90 leading-[1.25]">
            Automation &amp;<br />Control Systems
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 xl:h-9 2xl:h-10 w-[1px] bg-white/20 self-center" />

        {/* Item 3: Wastewater Management */}
        <div className="flex flex-col items-center text-center gap-2 w-[98px] xl:w-[114px] 2xl:w-[128px]">
          <div className="w-9 h-9 xl:w-10 xl:h-10 2xl:w-11 2xl:h-11 flex items-center justify-center shrink-0">
            <Recycle className="w-7 h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 text-white stroke-[1.8]" />
          </div>
          <div className="text-[11px] xl:text-[12px] 2xl:text-[13px] font-normal text-white/90 leading-[1.25]">
            Wastewater<br />Management
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 xl:h-9 2xl:h-10 w-[1px] bg-white/20 self-center" />

        {/* Item 4: Sustainable Solutions */}
        <div className="flex flex-col items-center text-center gap-2 w-[98px] xl:w-[114px] 2xl:w-[128px]">
          <div className="w-9 h-9 xl:w-10 xl:h-10 2xl:w-11 2xl:h-11 flex items-center justify-center shrink-0">
            <Leaf className="w-7 h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 text-white stroke-[1.8]" />
          </div>
          <div className="text-[11px] xl:text-[12px] 2xl:text-[13px] font-normal text-white/90 leading-[1.25]">
            Sustainable<br />Solutions
          </div>
        </div>
      </div>

      {/* ════ 10. BOTTOM-CENTER SCROLL INDICATOR ════ */}
      <div
        className="absolute z-[6] hidden md:flex flex-col items-center pointer-events-none animate-scroll-hint"
        style={{
          left: '50%',
          bottom: '4.5%',
          transform: 'translateX(-50%)'
        }}
      >
        <div className="w-[1px] h-4 xl:h-5 bg-gradient-to-t from-white/60 to-transparent mb-1.5" />
        <div className="w-[18px] xl:w-[20px] h-[30px] xl:h-[34px] rounded-full border-[1.5px] border-white/85 flex flex-col items-center pt-1.5 shadow-sm">
          <span className="w-[2px] h-[5px] xl:h-[6px] rounded-full bg-white animate-pulse" />
        </div>
        <span className="text-[8.5px] xl:text-[9.5px] font-bold tracking-[0.2em] text-white/85 uppercase mt-1.5 drop-shadow-sm whitespace-nowrap">
          SCROLL TO EXPLORE
        </span>
      </div>

      {/* ════ 11. BOTTOM STATISTICS PANEL ════ */}
      <div
        className="absolute z-[6] hidden md:block"
        style={{
          right: '1.5%',
          bottom: '3.5%',
          width: 'clamp(360px, 28vw, 480px)'
        }}
      >
        <div className="bg-[#060e1f]/80 backdrop-blur-lg rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 xl:px-5 xl:py-3.5 border border-white/12 shadow-[0_16px_48px_rgba(0,5,20,0.6)] flex items-center justify-between">

          {/* Stat 1 */}
          <div className="text-center px-2 flex-1 min-w-0">
            <div className="text-[24px] sm:text-[27px] xl:text-[31px] font-bold text-white leading-none font-sans tracking-tight">
              100+
            </div>
            <div className="text-[10px] sm:text-[10.5px] xl:text-[11.5px] text-white/75 font-normal leading-tight mt-1 whitespace-nowrap">
              Projects Delivered
            </div>
          </div>

          <div className="h-8 sm:h-9 xl:h-10 w-[1px] bg-white/25 shrink-0" />

          {/* Stat 2 */}
          <div className="text-center px-2 flex-1 min-w-0">
            <div className="text-[24px] sm:text-[27px] xl:text-[31px] font-bold text-white leading-none font-sans tracking-tight">
              20+
            </div>
            <div className="text-[10px] sm:text-[10.5px] xl:text-[11.5px] text-white/75 font-normal leading-tight mt-1 whitespace-nowrap">
              Industries Served
            </div>
          </div>

          <div className="h-8 sm:h-9 xl:h-10 w-[1px] bg-white/25 shrink-0" />

          {/* Stat 3 */}
          <div className="text-center px-2 flex-1 min-w-0">
            <div className="text-[24px] sm:text-[27px] xl:text-[31px] font-bold text-white leading-none font-sans tracking-tight">
              99%
            </div>
            <div className="text-[10px] sm:text-[10.5px] xl:text-[11.5px] text-white/75 font-normal leading-tight mt-1 whitespace-nowrap">
              Client Satisfaction
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
