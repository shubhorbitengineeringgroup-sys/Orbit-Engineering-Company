import ResponsiveImage from '../components/ResponsiveImage';
import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, Droplets, Cpu, ShieldCheck, TrendingUp, Award, Layers,
  CheckCircle2, ChevronLeft, ChevronRight, Sparkles, MapPin, Activity, Zap, Building2,
  Sliders, Gauge, RotateCcw, Play, BarChart3, Sun, Wrench, Compass, Eye,
  Maximize2, MessageSquare, PhoneCall
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import HeroSection from '../components/HeroSection';
import { useScrollReveal, useCountUp } from '../hooks/useAnimations';
import { SectionHeading, ImageCTA, MotionPhoto } from '../components/VisualSystem';
import WaterJourney from '../components/WaterJourney';
import PageLink from '../components/PageLink';
import '../styles/home.css';

// Animated stat counter component
function StatCard({ value, suffix, label, sub, color, delay }) {
  const { ref, count } = useCountUp(typeof value === 'number' ? value : 0, 2000);
  const revealRef = useScrollReveal();

  return (
    <div
      ref={(el) => { ref.current = el; revealRef.ref.current = el; }}
      className={`reveal-scale ${delay} p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover-lift gradient-border`}
    >
      <div className={`text-2xl font-bold ${color}`}>
        {typeof value === 'number' ? count + (suffix || '') : value}
      </div>
      <div className="text-xs font-semibold text-slate-700 mt-0.5">{label}</div>
      <div className="text-[11px] text-slate-500 mt-0.5">{sub}</div>
    </div>
  );
}

// Interactive Live Plant Simulation
function PlantSimulation() {
  const [activeStage, setActiveStage] = useState('clarifier');
  const [mode, setMode] = useState('Normal'); // Normal, Peak, Backwash
  const [pumpSpeed, setPumpSpeed] = useState(85);

  const stages = {
    intake: {
      title: 'Raw Water River Intake & Well',
      status: 'Online · 3 Pumps Running',
      flow: (mode === 'Peak' ? 62.4 : mode === 'Backwash' ? 38.0 : 45.8).toFixed(1) + ' MLD',
      pressure: '4.8 Bar',
      turbidity: '14.2 NTU',
      power: '185 kW',
      valves: 'Intake Gates: 100% Open',
      alert: 'Normal Intake Velocity',
      image: '/images/service_intake.jpg'
    },
    clarifier: {
      title: 'Clariflocculator & Coagulation Unit',
      status: 'Active · Alum Dosing 18 ppm',
      flow: (mode === 'Peak' ? 61.8 : mode === 'Backwash' ? 37.5 : 45.2).toFixed(1) + ' MLD',
      pressure: '1.2 Bar',
      turbidity: '3.8 NTU (Post-Coagulation)',
      power: '45 kW (Flash Mixer)',
      valves: 'Sludge Drain: Auto-Pulse',
      alert: 'Floc Formation Optimal',
      image: '/images/hero-wtp-BGjLUC-Q.jpg'
    },
    filters: {
      title: 'Rapid Gravity Sand Filters (RGSF)',
      status: mode === 'Backwash' ? '⚠️ Bed 3 Backwash Active' : 'Online · 6 Filter Beds Running',
      flow: (mode === 'Peak' ? 60.5 : mode === 'Backwash' ? 32.0 : 44.9).toFixed(1) + ' MLD',
      pressure: '0.85 Bar (Head Loss: 1.4m)',
      turbidity: '0.45 NTU (BIS < 1.0)',
      power: '110 kW Air Blower',
      valves: mode === 'Backwash' ? 'Backwash Valve: 100% OPEN' : 'Effluent Valve: Regulating',
      alert: mode === 'Backwash' ? 'Air Scouring & Water Flush Active' : 'Filtration Cycle 18/24 hrs',
      image: '/images/service_wtp.jpg'
    },
    chlorine: {
      title: 'Gas / Electro-Chlorination & Disinfection',
      status: 'Active · Residual Cl Control',
      flow: (mode === 'Peak' ? 60.0 : 44.5).toFixed(1) + ' MLD',
      pressure: '3.2 Bar',
      turbidity: '0.38 NTU',
      power: '15 kW Electro-Chlorinator',
      valves: 'Dosing Pump 1: 0.8 ppm active',
      alert: 'Residual Chlorine: 0.52 ppm (Compliant)',
      image: '/images/electro-mech-BjrTidAv.jpg'
    },
    scada: {
      title: 'Master SCADA Telemetry & IoT Cloud Node',
      status: '4G LTE Dual Gateway Linked',
      flow: (mode === 'Peak' ? 60.0 : 44.5).toFixed(1) + ' MLD Total Outflow',
      pressure: 'Master Header: 6.2 Bar',
      turbidity: 'Quality Index: 99.8%',
      power: 'Full Plant: 355 kW Total',
      valves: '18 RTU Remote Actuators Synced',
      alert: 'Cloud Latency: 18ms · Zero Alarm Active',
      image: '/images/scada-JO4jHDve.jpg'
    }
  };

  const current = stages[activeStage];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1e60aa]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-bold text-[#1e60aa] uppercase tracking-wider mb-1.5 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
            <span>Industrial SCADA · illustrative demo</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Explore a 50 MLD treatment plant</h3>
        </div>

        {/* Operating Mode Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
          {['Normal', 'Peak Demand', 'Backwash'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m === 'Peak Demand' ? 'Peak' : m)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                (mode === 'Peak' && m === 'Peak Demand') || mode === m
                  ? 'bg-[#1e60aa] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Stage Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-5">
        {[
          { id: 'intake', label: '1. Raw Intake' },
          { id: 'clarifier', label: '2. Clarifier' },
          { id: 'filters', label: '3. Sand Filters' },
          { id: 'chlorine', label: '4. Chlorination' },
          { id: 'scada', label: '5. Master SCADA' }
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveStage(s.id)}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all text-left flex items-center justify-between cursor-pointer border ${
              activeStage === s.id
                ? 'bg-[#1e60aa] text-white border-[#1e60aa] shadow-md shadow-[#1e60aa]/20'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>{s.label}</span>
            {activeStage === s.id && <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />}
          </button>
        ))}
      </div>

      {/* Main Simulation View Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

        {/* Left: Stage Visual & Diagnostics */}
        <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-100 border border-slate-200 shadow-sm">
          <ResponsiveImage
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-4">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full w-max mb-1 shadow-sm">
              <CheckCircle2 className="w-3 h-3" /> {current.status}
            </div>
            <h4 className="text-sm font-bold text-white drop-shadow-sm">{current.title}</h4>
            <div className="text-[11px] text-sky-200 font-medium mt-0.5">● {current.alert}</div>
          </div>
        </div>

        {/* Right: Live Telemetry Gauges (Light Theme) */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 hover:border-[#1e60aa]/40 hover:bg-white hover:shadow-md transition-all">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-[#1e60aa]" /> Discharge Flow
            </div>
            <div className="text-xl font-semibold text-slate-900 mt-1.5 font-display">{current.flow}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Electromagnetic Online</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 hover:border-[#1e60aa]/40 hover:bg-white hover:shadow-md transition-all">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#1e60aa]" /> Header Pressure
            </div>
            <div className="text-xl font-semibold text-slate-900 mt-1.5 font-display">{current.pressure}</div>
            <div className="text-[11px] text-sky-600 font-semibold mt-0.5">4-20mA Transducer</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 hover:border-[#1e60aa]/40 hover:bg-white hover:shadow-md transition-all">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1e60aa]" /> Water Quality
            </div>
            <div className="text-xl font-semibold text-slate-900 mt-1.5 font-display">{current.turbidity}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">CPCB &amp; BIS 10500</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 hover:border-[#1e60aa]/40 hover:bg-white hover:shadow-md transition-all">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Connected Power
            </div>
            <div className="text-xl font-semibold text-slate-900 mt-1.5 font-display">{current.power}</div>
            <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Schneider VFD Drive</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 hover:border-[#1e60aa]/40 hover:bg-white hover:shadow-md transition-all sm:col-span-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#1e60aa]" /> Valve &amp; Actuator Telemetry
            </div>
            <div className="text-sm font-bold text-slate-800 mt-1.5">{current.valves}</div>
            <div className="text-[11px] text-sky-700 font-semibold mt-0.5">Siemens S7-1500 PLC Synced</div>
          </div>
        </div>

      </div>

    </div>
  );
}

// Interactive Water Scheme Capacity Estimator
function SchemeCalculator({ onOpenQuote }) {
  const [population, setPopulation] = useState(50000);
  const [standard, setStandard] = useState(70); // LPCD (55 JJM rural, 70 town, 135 city)
  const [source, setSource] = useState('River / Canal');

  // Calculations
  const dailyLiters = population * standard;
  const capacityMLD = (dailyLiters * 1.15 / 1000000).toFixed(2); // 15% losses factor
  const filterBeds = Math.max(2, Math.ceil(capacityMLD / 5));
  const estimatedPowerHP = Math.round(capacityMLD * 40);
  const recommendedPipeMM = capacityMLD > 20 ? '700 - 1200 mm' : capacityMLD > 5 ? '350 - 600 mm' : '150 - 300 mm';

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl">
      <div className="max-w-2xl mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1e60aa] border border-blue-100 text-[11px] font-semibold uppercase tracking-wider mb-2">
          <Sliders className="w-3.5 h-3.5" />
          <span>Instant Engineering Estimator</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900">Calculate Plant Capacity &amp; Infrastructure Parameters</h3>
        <p className="text-xs text-slate-500 mt-1">Estimate WTP/STP capacity (MLD), pumping power, filter sizing, and SCADA nodes for your target population.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

        {/* Sliders Input */}
        <div className="lg:col-span-6 space-y-5">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-800 mb-2">
              <span>Target Population Served:</span>
              <span className="text-[#1e60aa] font-bold text-sm">{population.toLocaleString()} People</span>
            </div>
            <input
              type="range"
              min="5000"
              max="500000"
              step="5000"
              value={population}
              onChange={(e) => setPopulation(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1e60aa]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
              <span>5,000 (Village)</span>
              <span>100,000 (Town)</span>
              <span>500,000 (City)</span>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-800 mb-2">Supply Standard (CPHEEO / JJM Guidelines):</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { lpcd: 55, label: '55 LPCD', sub: 'Jal Jeevan Rural' },
                { lpcd: 70, label: '70 LPCD', sub: 'Nagar Parishad' },
                { lpcd: 135, label: '135 LPCD', sub: 'AMRUT 2.0 Urban' }
              ].map((item) => (
                <button
                  key={item.lpcd}
                  onClick={() => setStandard(item.lpcd)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    standard === item.lpcd
                      ? 'border-[#1e60aa] bg-blue-50/80 text-[#1e60aa] shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-800 mb-2">Raw Water Source:</div>
            <div className="grid grid-cols-3 gap-2">
              {['River / Canal', 'Dam / Reservoir', 'Deep Borewell'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSource(s)}
                  className={`p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    source === s
                      ? 'border-[#1e60aa] bg-blue-50 text-[#1e60aa]'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculated Results Card */}
        <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-[#1e3a5f] rounded-2xl p-6 text-white shadow-xl">
          <div className="text-[11px] font-bold text-sky-300 uppercase tracking-wider mb-1">Estimated Engineering Blueprint</div>
          <div className="text-3xl sm:text-4xl font-bold text-white">{capacityMLD} <span className="text-xl font-bold text-sky-400">MLD Plant</span></div>
          <div className="text-xs text-slate-300 mt-1">Recommended Turnkey WTP System with automated SCADA</div>

          <div className="grid grid-cols-2 gap-3 my-5">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="text-[10px] text-sky-200 uppercase font-semibold">Filter Beds</div>
              <div className="text-base font-bold text-white">{filterBeds} Gravity Sand Units</div>
            </div>
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="text-[10px] text-sky-200 uppercase font-semibold">Pump Drive Power</div>
              <div className="text-base font-bold text-white">~{estimatedPowerHP} HP Total</div>
            </div>
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="text-[10px] text-sky-200 uppercase font-semibold">Header Pipeline</div>
              <div className="text-base font-bold text-white">{recommendedPipeMM}</div>
            </div>
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="text-[10px] text-sky-200 uppercase font-semibold">SCADA RTU Nodes</div>
              <div className="text-base font-bold text-white">{Math.max(4, Math.round(capacityMLD * 3))} IoT Gateways</div>
            </div>
          </div>

          <button
            onClick={onOpenQuote}
            className="w-full py-3 bg-[#009fd9] hover:bg-[#008bc0] text-white font-bold text-xs rounded-xl shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Request Detailed DPR / BOQ for {capacityMLD} MLD</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

export default function HomePage({ onNavigate, onOpenQuote }) {
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoTab, setDemoTab] = useState('simulation');
  const [activeCapability, setActiveCapability] = useState(0);
  const capabilityTrack = useRef(null);
  const openDemo = () => { setDemoOpen(true); };
  const capabilities = [
    { number: '01', title: 'Water, engineered better.', subtitle: 'Treatment & infrastructure', image: '/images/hero-wtp-BGjLUC-Q.jpg', description: 'From raw water intake to clean water delivery. Complete treatment systems built around your community.', icon: Droplets },
    { number: '02', title: 'Intelligence in every drop.', subtitle: 'Automation & control', image: '/images/scada-JO4jHDve.jpg', description: 'Connected plants. Clear insights. SCADA, PLC and telemetry that put you in control.', icon: Cpu },
    { number: '03', title: 'Built to keep life flowing.', subtitle: 'Pumping & distribution', image: '/images/pump-house-rehbpR99.jpg', description: 'Reliable pumping, storage and distribution networks that bring water where it matters.', icon: Gauge },
  ];
  return <div className="visual-page">
    <HeroSection onNavigate={onNavigate} onOpenQuote={onOpenQuote} />

    <section className="visual-container visual-section home-story-grid">
      <div className="reveal-up home-story-copy">
        <SectionHeading eyebrow="THE PEOPLE BEHIND THE PROGRESS" title={<>Better engineering.<br /><span className="visual-title-accent">A healthier tomorrow.</span></>} description="Since 1998, we’ve brought water infrastructure and intelligent automation together—with one purpose: making clean water go further." />
        <div className="home-story-stats">
          <div><strong>150+</strong><span>Schemes delivered</span></div>
          <div><strong>3 ISO</strong><span>Certified systems</span></div>
          <div><strong>1998</strong><span>Our story began</span></div>
        </div>
        <PageLink page="about" onNavigate={onNavigate} className="visual-button visual-button--secondary">Discover the Orbit story<ArrowRight size={17} /></PageLink>
      </div>
      <div className="home-story-photos reveal-scale">
        <div className="home-story-photos__main visual-image"><MotionPhoto src="/images/wtp_hero.jpg" alt="Aerial view of water treatment infrastructure" /></div>
        <div className="home-story-photos__detail visual-image"><MotionPhoto src="/images/pump-house-rehbpR99.jpg" alt="Industrial pumping systems" /></div>
        <div className="home-story-photos__badge visual-glass"><ShieldCheck size={25} /><span>Engineering you can trust.<small>From concept to commissioning.</small></span></div>
        <span className="home-story-photos__caption">DESIGNED WITH PURPOSE. BUILT TO LAST.</span>
      </div>
    </section>

    <section className="home-trust-strip">
      <div className="visual-container home-trust-strip__inner"><span>PARTNERS IN<br /><strong>BETTER INFRASTRUCTURE</strong></span><div>{siteConfig.ecosystem.government.slice(0, 6).map(partner => <ResponsiveImage key={partner.name} src={partner.logo} alt={partner.name} title={partner.name} loading="lazy" decoding="async" />)}</div><PageLink page="ecosystem" onNavigate={onNavigate} aria-label="Explore our government and industry ecosystem"><ArrowRight size={20} /></PageLink></div>
    </section>

    <section className="visual-container visual-section">
      <div className="home-section-top reveal-up"><SectionHeading eyebrow="CONNECTED EXPERTISE. COMPLETE SOLUTIONS." title={<>One partner.<br /><span className="visual-title-accent">Every part of the journey.</span></>} /><PageLink page="solutions" onNavigate={onNavigate} className="visual-button visual-button--secondary">Explore all solutions<ArrowRight size={17} /></PageLink></div>
      <div ref={capabilityTrack} className="home-capabilities" onScroll={event => { const step = event.currentTarget.firstElementChild?.offsetWidth + 18; if (step) setActiveCapability(Math.min(2, Math.max(0, Math.round(event.currentTarget.scrollLeft / step)))); }}>{capabilities.map(({ number, title, subtitle, image, description, icon: Icon }, i) => <PageLink key={number} page="solutions" onNavigate={onNavigate} className="home-capability reveal-up" style={{ transitionDelay: i * 90 + 'ms' }}>
        <ResponsiveImage src={image} alt={subtitle} sizes="(min-width: 900px) 40vw, 100vw" loading="lazy" /><div className="home-capability__shade" /><span className="home-capability__number">{number} / ORBIT EXPERTISE</span><span className="home-capability__icon"><Icon size={23} /></span>
        <span className="home-capability__body"><small>{subtitle}</small><strong>{title}</strong><span>{description}</span><span className="home-capability__link">Discover the solution<ArrowRight size={18} /></span></span>
      </PageLink>)}</div>
      <div className="home-capability-controls"><span>0{activeCapability + 1} / 03 <small>SWIPE TO DISCOVER</small></span><div>{capabilities.map((item, index) => <button key={item.number} type="button" aria-label={`Show ${item.subtitle.toLowerCase()}`} aria-pressed={index === activeCapability} onClick={() => { const track = capabilityTrack.current; track?.scrollTo({ left: index * (track.firstElementChild.offsetWidth + 18), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); setActiveCapability(index); }}><span /></button>)}</div></div>
    </section>

    <WaterJourney onNavigate={onNavigate} />

    <section className="home-intelligence">
      <div className="visual-container home-intelligence__grid">
        <div className="home-intelligence__photo visual-image reveal-left"><ResponsiveImage src="/images/scada-JO4jHDve.jpg" alt="SCADA screens in an industrial control room" sizes="(min-width: 900px) 55vw, 100vw" loading="lazy" /><div className="home-intelligence__label visual-glass"><Activity size={21} /><div>Smarter systems. Clearer decisions.<small>SCADA · TELEMETRY · AUTOMATION</small></div></div></div>
        <div className="reveal-up"><SectionHeading eyebrow="SEE THE THINKING BEHIND THE TECHNOLOGY" title={<>Infrastructure with<br /><span>intelligence built in.</span></>} description="A good water system does more than move water. It connects every stage, helps operators see the bigger picture and keeps the entire network working together." /><button type="button" className="visual-button" onClick={openDemo} aria-expanded={demoOpen} aria-controls="home-interactive-demo">Explore the interactive demo<ArrowRight size={17} /></button><span className="home-intelligence__note">Explore plant controls and a capacity planning tool.</span></div>
      </div>
      {demoOpen && <div id="home-interactive-demo" className="visual-container home-demo-panel">
        <div className="home-demo-tabs" role="tablist" aria-label="Engineering tools">{[['simulation', 'Plant simulation'], ['calculator', 'Capacity planner']].map(([id, label]) => <button id={'demo-tab-' + id} key={id} type="button" role="tab" aria-selected={demoTab === id} aria-controls={'demo-panel-' + id} tabIndex={demoTab === id ? 0 : -1} onKeyDown={event => { if (['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); const next = id === 'simulation' ? 'calculator' : 'simulation'; setDemoTab(next); document.getElementById('demo-tab-' + next)?.focus(); } }} onClick={() => setDemoTab(id)}>{label}</button>)}<button type="button" className="home-demo-close" onClick={() => setDemoOpen(false)}>Close demo</button></div>
        <div role="tabpanel" id={'demo-panel-' + demoTab} aria-labelledby={'demo-tab-' + demoTab} className="home-demo-content">{demoTab === 'simulation' ? <PlantSimulation /> : <SchemeCalculator onOpenQuote={onOpenQuote} />}</div>
        <p className="home-demo-disclaimer">Illustrative planning tools. Values are examples and estimates; final design depends on site conditions and an engineering assessment.</p>
      </div>}
    </section>

    <section className="visual-container visual-section home-product-preview">
      <div className="reveal-up"><SectionHeading eyebrow="THE RIGHT COMPONENTS. THE RIGHT PERFORMANCE." title={<>Small details.<br /><span className="visual-title-accent">Lasting reliability.</span></>} description="Metering, valves, instrumentation and control systems—carefully selected to work as one." /><PageLink page="products" onNavigate={onNavigate} className="visual-button visual-button--secondary">Explore our products<ArrowRight size={17} /></PageLink></div>
      <div className="home-product-preview__photos reveal-scale"><div className="visual-image"><ResponsiveImage src="/images/flow-meter-DSWy7kTd.jpg" alt="Water metering instrumentation" sizes="(min-width: 900px) 30vw, 50vw" loading="lazy" /><span>PRECISION METERING</span></div><div className="visual-image"><ResponsiveImage src="/images/valves-Cn1fyoyr.jpg" alt="Industrial water control valves" sizes="(min-width: 900px) 30vw, 50vw" loading="lazy" /><span>RELIABLE CONTROL</span></div></div>
    </section>

    <ImageCTA eyebrow="FROM AN IDEA TO REAL-WORLD IMPACT" title="Let’s make better water infrastructure happen." description="Bring us your project, your challenges and your ambition. We’ll bring the engineering." image="/images/service_intake.jpg" onAction={onOpenQuote} actionLabel="Start your project" />
  </div>;
}
