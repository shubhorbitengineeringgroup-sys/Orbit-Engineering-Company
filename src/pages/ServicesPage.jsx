import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowUpRight, CheckCircle2, ChevronRight, Cpu, Droplets, Gauge, MessageSquare, Maximize2, ShieldCheck, Sun, Wrench, X } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { SectionHeading, ImageCTA, MotionPhoto, ImageViewer } from '../components/VisualSystem';
import ResponsiveImage from '../components/ResponsiveImage';
import ProductCatalog from '../components/ProductCatalog';
import PageLink from '../components/PageLink';
import { handlePageLink } from '../config/navigation';
import { PRODUCTS as MASTER_PRODUCTS } from '../data/products';
import '../styles/services.css';
const EDITORIAL_SERVICES = [
  {
    number: '01',
    id: 'wtp',
    code: '01.1',
    sector: '01 — Water Supply Infrastructure',
    title: 'Water Treatment Plants',
    description: 'Design support, construction, equipment installation, commissioning assistance and all allied civil works — delivered as one accountable package.',
    pills: ['Design support', 'Commissioning', 'Allied civil', 'Turnkey Multi-MLD'],
    image: '/images/hero-wtp-BGjLUC-Q.jpg',
    capacity: '5 to 100+ MLD',
    standard: 'BIS 10500 / CPHEEO',
    features: [
      'Raw intake channels, flash mixers & clariflocculators',
      'Rapid Gravity Sand Filter (RGSF) beds with auto backwash',
      'Chemical dosing rooms (Alum, Lime, PAC) with safety scrubbers',
      'Chlorine contact tanks & automated electro-chlorination'
    ],
    highlights: ['Zero Liquid Discharge (ZLD) option', 'SCADA linked backwash cycles', 'CPCB compliant continuous discharge']
  },
  {
    number: '02',
    id: 'intake',
    code: '01.2',
    sector: '01 — Water Supply Infrastructure',
    title: 'Intake Wells',
    description: 'Construction of intake structures for reliable raw water abstraction from rivers, reservoirs and dams, engineered for seasonal variation and long service life.',
    pills: ['Rivers', 'Reservoirs', 'Dams', 'Jack-wells'],
    image: '/images/intake-well-BztrG-Xc.jpg',
    capacity: 'Heavy River/Dam Duty',
    standard: 'IS 456 / IRC Water Norms',
    features: [
      'Reinforced concrete intake wells with jack-well substructures',
      'Connecting gravity conduits and trash rack screen mechanisms',
      'Submersible & vertical turbine pump mounting plinths',
      'Hydraulic protection against seasonal monsoon scour and floods'
    ],
    highlights: ['Silt exclusion bays', 'Emergency bypass sluice gates', '4-season drawdown calculation']
  },
  {
    number: '03',
    id: 'oht',
    code: '01.3',
    sector: '01 — Water Supply Infrastructure',
    title: 'Overhead Tanks',
    description: 'Elevated service reservoirs built to secure uninterrupted distribution and stable pressure across the network they serve.',
    pills: ['Elevated storage', 'Pressure head', 'Continuity', 'IS 3370'],
    image: '/images/oht-DhEXxxnQ.jpg',
    capacity: '50 KL to 5000 KL',
    standard: 'IS 3370 Concrete Standards',
    features: [
      'Watertight underground & ground-level Clear Water Reservoirs',
      'Elevated Service Reservoirs (OHT) with slip-form concrete staging',
      'Waterproofing with food-grade epoxy barrier coatings',
      'Hydrostatic testing for zero-leakage certification'
    ],
    highlights: ['Ultrasonic depth telemetry', 'Chlorine booster dosing ports', 'Overflow & wash-out piping']
  },
  {
    number: '04',
    id: 'pump-house',
    code: '01.4',
    sector: '01 — Water Supply Infrastructure',
    title: 'Pump Houses',
    description: 'Civil and electro-mechanical infrastructure for efficient water pumping systems, from foundation to energised plant.',
    pills: ['Civil works', 'Electro-mech', 'Efficiency', 'Gantry cranes'],
    image: '/images/pump-house-rehbpR99.jpg',
    capacity: 'High-Capacity Pumping',
    standard: 'IS 1710 Pumping Norms',
    features: [
      'Vibration-damped inertia blocks and equipment foundations',
      'Overhead electric traveling (EOT) crane gantry integration',
      'Ventilated electrical motor control center (MCC) chambers',
      'Acoustic enclosures and anti-surge pressure relief pits'
    ],
    highlights: ['Precision alignment tolerances', 'Heavy cable trench networks', 'Dewatering sump integration']
  },
  {
    number: '05',
    id: 'pipelines',
    code: '01.5',
    sector: '01 — Water Supply Infrastructure',
    title: 'Pipeline Networks',
    description: 'Laying, testing, commissioning and maintenance of transmission and distribution pipelines across demanding terrain.',
    pills: ['Laying', 'Testing', 'Maintenance', 'DI / HDPE / MS'],
    image: '/images/pipeline-3e9YAzse.jpg',
    capacity: 'Dia 100mm to 1600mm',
    standard: 'IS 4984 / IS 8329 (DI/HDPE)',
    features: [
      'Heavy Ductile Iron (DI K7/K9) and Mild Steel (MS) pipeline laying',
      'High-Density Polyethylene (HDPE) electrofusion & butt jointing',
      'Hydraulic thrust block design and pipeline anchor blocks',
      'Hydrostatic field pressure testing up to 1.5x working pressure'
    ],
    highlights: ['GIS GPS pipeline mapping', 'Air valve & scour valve chambers', 'DMA leak management']
  },
  {
    number: '06',
    id: 'scada',
    code: '02.2',
    sector: '02 — Electro-Mechanical Works & SCADA',
    title: 'SCADA & Automation',
    description: 'Siemens & Schneider PLC control panels, cellular 4G RTUs, and central master video wall control rooms with 24/7 cloud telemetry.',
    pills: ['Siemens PLC', '4G RTU', 'DMA Leaks', 'Cloud Telemetry'],
    image: '/images/scada-JO4jHDve.jpg',
    capacity: 'Multi-Site Master SCADA',
    standard: 'IEC 61131-3 / Modbus TCP',
    features: [
      'Custom IP65 PLC panels with Siemens S7-1200/1500 & Schneider M340',
      'Central SCADA video wall command room setup with operator consoles',
      'Remote Terminal Units (RTU) with dual SIM 4G/GSM/LoRa uplink',
      'District Metered Area (DMA) balance & Non-Revenue Water (NRW) leak detection'
    ],
    highlights: ['Cloud dashboard & mobile app', 'Automated valve actuator control', 'Zero-latency fail-safe alarms']
  },
  {
    number: '07',
    id: 'solar',
    code: '02.5',
    sector: '02 — Electro-Mechanical Works & SCADA',
    title: 'Solar Pumping & Clean Energy',
    description: 'Turnkey solar photovoltaic submersible pumping arrays under PM KUSUM and floating solar PV arrays with hybrid VFD drives.',
    pills: ['PM KUSUM', 'Floating Solar', 'Hybrid VFD', 'Zero Carbon'],
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1200&q=80',
    capacity: '3 HP to 50+ HP Pumps',
    standard: 'PM KUSUM Tier-1 / MNRE',
    features: [
      'Solar-powered submersible pumping stations for rural water supply',
      'Floating solar photovoltaic arrays on raw water reservoirs & canals',
      'High-efficiency MPPT solar VFD drive inverters (> 99.2% efficiency)',
      'Automatic solar-to-grid auto-switch for 24/7 continuous water delivery'
    ],
    highlights: ['Remote solar inverter telemetry', 'Zero carbon pumping footprint', 'MNRE approved Tier-1 panels']
  },
  {
    number: '08',
    id: 'om-amc',
    code: '02.6',
    sector: '02 — Electro-Mechanical Works & SCADA',
    title: 'Operation & Maintenance (O&M)',
    description: 'Lifelong preventative maintenance regimes, sensor NABL calibration certificates, critical spares stock, and dedicated engineers.',
    pills: ['24/7 AMC', '< 4h Response', 'NABL Calibration', 'CPCB Sync'],
    image: '/images/electro-mech-BjrTidAv.jpg',
    capacity: '24/7/365 Pan-India',
    standard: 'ISO 9001 / ISO 14001',
    features: [
      'Annual Maintenance Contracts (AMC) with guaranteed < 4h response in MP',
      'Scheduled preventative pump overhauls, gland packing & bearing lube',
      'Annual sensor NABL recalibration certificates and compliance logs',
      'Real-time CPCB cloud data logging & emergency DG power failover'
    ],
    highlights: ['Dedicated emergency fleet', 'On-site sensor calibration lab', 'Pan-MP rapid response']
  }
];

const WATER_CYCLE = EDITORIAL_SERVICES.slice(0, 5);
const ADVANCED_SYSTEMS = EDITORIAL_SERVICES.slice(5);
const PRODUCT_IMAGES = {
  'Flow Measurement': '/images/flow-meter-DSWy7kTd.jpg',
  'Smart Metering': '/images/flow-meter-DSWy7kTd.jpg',
  'Water Quality Analyzers': '/images/electro-mech-BjrTidAv.jpg',
  'Level Sensors': '/images/oht-DhEXxxnQ.jpg',
  'Valves & Piping': '/images/valves-Cn1fyoyr.jpg',
  'Automation & Telemetry': '/images/scada-JO4jHDve.jpg',
  'Solar Solutions': EDITORIAL_SERVICES[6].image,
};
const WATER_ICONS = [Droplets, Droplets, Gauge, Gauge, ArrowRight];
const SYSTEM_ICONS = [Cpu, Sun, Wrench];

function FacilityComparison() {
  const [position, setPosition] = useState(50);
  const comparisonRef = useRef(null);
  const updatePosition = (clientX) => {
    const bounds = comparisonRef.current?.getBoundingClientRect();
    if (bounds) setPosition(Math.max(0, Math.min(100, ((clientX - bounds.left) / bounds.width) * 100)));
  };

  return (
    <div className="services-comparison-wrap">
      <div
        ref={comparisonRef}
        className="services-comparison"
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          updatePosition(event.clientX);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) updatePosition(event.clientX);
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        }}
      >
        <ResponsiveImage src="/images/reservoir-D5_YW2_r.jpg" alt="Concrete clear water storage reservoir" loading="lazy" sizes="(max-width: 850px) 100vw, (max-width: 1466px) 60vw, 800px" />
        <div className="services-comparison-before" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <ResponsiveImage src="/images/hero-wtp-BGjLUC-Q.jpg" alt="Circular water treatment clarifiers" loading="lazy" sizes="(max-width: 850px) 100vw, (max-width: 1466px) 60vw, 800px" />
        </div>
        <span className="services-comparison-label services-comparison-label--left">Treatment</span>
        <span className="services-comparison-label services-comparison-label--right">Storage</span>
        <div className="services-comparison-divider" style={{ left: `${position}%` }} aria-hidden="true">
          <span>‹ ›</span>
        </div>
      </div>
      <label className="services-range-label" htmlFor="facility-comparison">Explore the facilities <span>Drag or use arrow keys</span></label>
      <input id="facility-comparison" className="services-range" type="range" min="0" max="100" value={position} onChange={(event) => setPosition(Number(event.target.value))} aria-label="Compare treatment plant and storage reservoir images" aria-valuetext={`${position}% treatment plant image visible`} />
    </div>
  );
}
function DetailDialog({ item, onClose, onOpenQuote }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const isProduct = Boolean(item?.name);
  const title = item?.name || item?.title;

  useEffect(() => {
    if (!item) return;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    if (dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) previouslyFocused.focus();
    };
  }, [item]);

  if (!item) return null;

  const whatsappNumber = siteConfig.company.contact.whatsapp.replace(/\D/g, '');
  return (
    <dialog
      ref={dialogRef}
      className="services-detail-dialog"
      aria-labelledby="service-detail-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}
    >
      <div className="services-detail-cover">
        <ResponsiveImage src={isProduct ? PRODUCT_IMAGES[item.category] : item.image} alt={isProduct ? `${item.category} application` : item.title} loading="eager" />
        <button ref={closeRef} onClick={onClose} className="services-dialog-close" aria-label="Close technical details"><X size={21} /></button>
        <div>
          <span className="visual-eyebrow">{isProduct ? item.category : 'Engineering scope'}</span>
          <h2 id="service-detail-title">{title}</h2>
        </div>
      </div>
      <div className="services-detail-body">
        <p>{item.description}</p>
        {isProduct ? (
          <div className="services-specifications">
            <h3>Technical specifications</h3>
            <ul>{item.specs.split(' | ').map(specification => <li key={specification}><CheckCircle2 size={17} /><span>{specification}</span></li>)}</ul>
          </div>
        ) : (
          <>
            <div className="services-detail-stats">
              <div><span>Execution capacity</span><strong>{item.capacity}</strong></div>
              <div><span>Applicable standard</span><strong>{item.standard}</strong></div>
            </div>
            <div className="services-specifications">
              <h3>Included in the scope</h3>
              <ul>{item.features.map(feature => <li key={feature}><CheckCircle2 size={17} /><span>{feature}</span></li>)}</ul>
            </div>
            <div className="services-detail-tags">{item.highlights.map(highlight => <span key={highlight}>{highlight}</span>)}</div>
          </>
        )}
        <div className="services-detail-actions">
          <button className="visual-button" onClick={() => { onClose(); onOpenQuote?.(); }}>Request a proposal <ArrowRight size={18} /></button>
          <a className="visual-button visual-button--secondary" href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello Orbit Engineering, I would like to discuss ${title}.`)}`} target="_blank" rel="noopener noreferrer"><MessageSquare size={18} /> WhatsApp enquiry</a>
        </div>
      </div>
    </dialog>
  );
}

const PRODUCT_FAMILIES = [
  { id: 'measure', number: '01', label: 'Measure', category: 'Flow Meters', title: 'Understand every drop.', detail: 'Flow instruments for a clear picture of your water network.', icon: Gauge, left: '49%', top: '38%' },
  { id: 'control', number: '02', label: 'Control', category: 'Valves & Piping', title: 'Put precision in motion.', detail: 'Dependable valves for isolation, flow control and automation.', icon: Droplets, left: '73%', top: '29%' },
  { id: 'connect', number: '03', label: 'Connect', category: 'Automation & Telemetry', title: 'Bring it all together.', detail: 'Field hardware and telemetry that connect your entire system.', icon: Cpu, left: '91%', top: '48%' },
];
const PROCESS_STAGES = [
  { id: 'intake', label: 'Source', x: 13, y: 65 },
  { id: 'wtp', label: 'Treatment', x: 31, y: 37 },
  { id: 'pump-house', label: 'Transfer', x: 50, y: 59 },
  { id: 'oht', label: 'Storage', x: 70, y: 28 },
  { id: 'pipelines', label: 'Distribution', x: 91, y: 47 },
].map((stage, index) => ({ ...stage, number: String(index + 1).padStart(2, '0'), service: EDITORIAL_SERVICES.find(service => service.id === stage.id) }));
const INFRASTRUCTURE_GALLERY = EDITORIAL_SERVICES.map(service => ({ src: service.image, alt: service.title, label: service.title }));
const NETWORK_VIEWS = [
  { id: 'measure', label: 'Measurement', image: '/images/flow-meter-DSWy7kTd.jpg', alt: 'Water flow measurement instrument installed on a pipe', caption: 'Measure what matters across your network.', icon: Gauge },
  { id: 'control', label: 'Control', image: '/images/valves-Cn1fyoyr.jpg', alt: 'Blue industrial water control valves', caption: 'Control the flow at every critical point.', icon: Droplets },
  { id: 'connect', label: 'Visibility', image: '/images/scada-JO4jHDve.jpg', alt: 'SCADA command room for a connected water network', caption: 'See the whole system from one control room.', icon: Cpu },
];

function ProductsStudioHero({ familyId, onSelectFamily, onExplore, onOpenQuote }) {
  const selectedFamily = PRODUCT_FAMILIES.find(family => family.id === familyId) || PRODUCT_FAMILIES[0];
  return (
    <section className="products-studio-hero">
      <div className="products-studio-art">
        <MotionPhoto src="/images/design-v2/product-studio.jpg" alt="Unbranded blue and silver flow meter, butterfly valve and control equipment on pale studio pedestals" loading="eager">
          <div className="products-studio-hotspots" aria-label="Explore the equipment families">
            {PRODUCT_FAMILIES.map(family => <button key={family.id} style={{ left: family.left, top: family.top }} aria-label={`Preview ${family.category}`} aria-pressed={family.id === familyId} onClick={() => onSelectFamily(family.id)}><span>{family.number}</span><span className="products-hotspot-label">{family.label}</span></button>)}
          </div>
        </MotionPhoto>
      </div>
      <div className="visual-container products-studio-copy-wrap">
        <div className="products-studio-copy">
          <span className="visual-eyebrow">Precision, beautifully engineered</span>
          <h1>Every detail.<br /><span>Better flow.</span></h1>
          <p>Smart instruments. Reliable controls. Discover the components that make a stronger water system.</p>
          <div className="services-bespoke-actions"><a href="#capabilities-catalog" className="visual-button" onClick={event => handlePageLink(event, 'products', () => onExplore())}>Explore the collection <ArrowRight size={18} /></a><PageLink page="contact" onAction={onOpenQuote} className="services-studio-enquire">Find your fit <ArrowUpRight size={18} /></PageLink></div>
          <div className="products-studio-micro"><span /><span>Selected for your application.<br /><strong>Integrated by our engineers.</strong></span></div>
        </div>
      </div>
      <div className="products-family-preview" key={selectedFamily.id} aria-live="polite">
        <span className="visual-eyebrow">{selectedFamily.number} / {selectedFamily.category}</span><h2>{selectedFamily.title}</h2><p>{selectedFamily.detail}</p><button onClick={() => onExplore(selectedFamily.category)}>Explore this family <ArrowRight size={17} /></button>
      </div>
      <div className="visual-container products-studio-footer">
        <div className="products-family-picker" aria-label="Choose a product family">{PRODUCT_FAMILIES.map(family => { const Icon = family.icon; return <button key={family.id} aria-pressed={family.id === familyId} onClick={() => onSelectFamily(family.id)}><Icon size={20} /><span>{family.label}</span><span>{family.number}</span></button>; })}</div>
        <span className="products-studio-index">THE ORBIT COLLECTION <span>{MASTER_PRODUCTS.length} products / 22 categories / one connected system</span></span>
      </div>
    </section>
  );
}

function SolutionsLandscapeHero({ serviceId, onSelectStage, onExplore, onOpenQuote }) {
  const stage = PROCESS_STAGES.find(item => item.id === serviceId) || PROCESS_STAGES[1];
  return (
    <section className="solutions-landscape-hero">
      <div className="solutions-landscape-scene" key={`scene-${stage.id}`}><MotionPhoto src={stage.service.image} alt={stage.service.title} loading="eager" /></div>
      <div className="visual-container solutions-landscape-copy-wrap">
        <div className="solutions-landscape-copy"><span className="visual-eyebrow">The complete water journey</span><h1>A better journey.<br />For <span>every drop.</span></h1><p>From the first intake to the last mile. Thoughtful infrastructure, connected by expert engineering.</p><div className="services-bespoke-actions"><a href="#capabilities-catalog" className="visual-button">Explore our solutions <ArrowRight size={18} /></a><PageLink page="contact" onAction={onOpenQuote} className="solutions-hero-enquire">Plan your project <ArrowUpRight size={18} /></PageLink></div></div>
      </div>
      <div className="solutions-process-map" aria-label="Interactive water journey">
        <svg viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true"><path className="solutions-process-route-shadow" d="M130 260 C200 270 230 148 310 148 S410 236 500 236 S615 112 700 112 S810 188 910 188" /><path className="solutions-process-route" d="M130 260 C200 270 230 148 310 148 S410 236 500 236 S615 112 700 112 S810 188 910 188" /></svg>
        {PROCESS_STAGES.map(item => <button key={item.id} style={{ left: `${item.x}%`, top: `${item.y}%` }} aria-label={`View ${item.service.title} in the water journey`} aria-pressed={item.id === serviceId} onClick={() => onSelectStage(item.id)}><span>{item.number}</span><strong>{item.label}</strong></button>)}
      </div>
      <div className="solutions-stage-caption" key={`caption-${stage.id}`} aria-live="polite"><span>{stage.number} / {stage.label}</span><strong>{stage.service.title}</strong><span>{stage.service.capacity}</span></div>
      <div className="visual-container solutions-hero-footer"><span className="solutions-picker-caption">FOLLOW THE WATER <span>Tap a stage to explore</span></span><div className="solutions-process-picker" aria-label="Choose a water infrastructure stage">{PROCESS_STAGES.map(item => <button key={item.id} aria-pressed={item.id === serviceId} onClick={() => onSelectStage(item.id)}><span>{item.number}</span><div><strong>{item.label}</strong><small>{item.service.title}</small></div><ArrowUpRight size={17} /></button>)}</div></div>
    </section>
  );
}
export default function ServicesPage({ onOpenQuote, onTabChange, initialTab = 'solutions' }) {
  const [activeTab, setActiveTab] = useState(initialTab === 'products' ? 'products' : 'solutions');
  const [selectedServiceId, setSelectedServiceId] = useState('wtp');
  const [productCategory, setProductCategory] = useState({ name: 'All products' });
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [heroFamily, setHeroFamily] = useState('measure');
  const [networkFocus, setNetworkFocus] = useState('connect');
  const [galleryIndex, setGalleryIndex] = useState(null);
  const pageRef = useRef(null);
  const catalogRef = useRef(null);
  const tabRefs = useRef({});
  const selectedService = WATER_CYCLE.find(service => service.id === selectedServiceId) || WATER_CYCLE[0];
  const isProducts = activeTab === 'products';
  const networkView = NETWORK_VIEWS.find(view => view.id === networkFocus) || NETWORK_VIEWS[2];

  useEffect(() => {
    setActiveTab(initialTab === 'products' ? 'products' : 'solutions');
    setSelectedDetail(null);
    setGalleryIndex(null);
  }, [initialTab]);

  useEffect(() => {
    if (!pageRef.current || !('IntersectionObserver' in window)) return;
    const targets = pageRef.current.querySelectorAll('.services-reveal:not(.is-visible)');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach(target => target.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          delete entry.target.dataset.pending;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    targets.forEach(target => { if (target.getBoundingClientRect().top >= window.innerHeight) target.dataset.pending = 'true'; observer.observe(target); });
    return () => observer.disconnect();
  }, [activeTab, productCategory]);

  const scrollToCatalog = () => catalogRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  const changeTab = (tab) => { setActiveTab(tab); setSelectedDetail(null); setGalleryIndex(null); onTabChange?.(tab); };
  const handleTabKeys = (event) => {
    let nextTab;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') nextTab = isProducts ? 'solutions' : 'products';
    if (event.key === 'Home') nextTab = 'solutions';
    if (event.key === 'End') nextTab = 'products';
    if (nextTab) { event.preventDefault(); changeTab(nextTab); tabRefs.current[nextTab]?.focus(); }
  };

  return (
    <div ref={pageRef} className="visual-page services-page">
      {isProducts ? <ProductsStudioHero familyId={heroFamily} onSelectFamily={setHeroFamily} onExplore={category => { setProductCategory({ name: category || 'All products' }); scrollToCatalog(); }} onOpenQuote={onOpenQuote} /> : <SolutionsLandscapeHero serviceId={selectedServiceId} onSelectStage={setSelectedServiceId} onExplore={scrollToCatalog} onOpenQuote={onOpenQuote} />}

      <div id="capabilities-catalog" ref={catalogRef} className="visual-container services-catalog-start">
        <div className="services-page-tabs" role="tablist" aria-label="Explore Orbit's capabilities" onKeyDown={handleTabKeys}>
          <PageLink page="solutions" onNavigate={changeTab} ref={element => { tabRefs.current.solutions = element; }} id="services-tab-solutions" role="tab" aria-controls="services-panel-solutions" aria-selected={!isProducts} tabIndex={!isProducts ? 0 : -1}><Droplets size={19} /> Engineering solutions <ArrowUpRight size={17} /></PageLink>
          <PageLink page="products" onNavigate={changeTab} ref={element => { tabRefs.current.products = element; }} id="services-tab-products" role="tab" aria-controls="services-panel-products" aria-selected={isProducts} tabIndex={isProducts ? 0 : -1}><Gauge size={19} /> Products & technology <ArrowUpRight size={17} /></PageLink>
        </div>
      </div>

      <div hidden={isProducts} id="services-panel-solutions" role="tabpanel" aria-labelledby="services-tab-solutions" className="services-panel services-enter">{!isProducts && <>
          <section className="visual-section visual-container">
            <div className="services-reveal">
              <SectionHeading eyebrow="The complete water journey" title={<>One partner.<br />The <span className="visual-title-accent">entire water cycle.</span></>} description="Explore the infrastructure that connects a reliable source to every community it serves." />
            </div>
            <div className="services-cycle services-reveal">
              <div className="services-cycle-menu" aria-label="Water infrastructure disciplines">
                {WATER_CYCLE.map((service, index) => {
                  const Icon = WATER_ICONS[index];
                  return <button key={service.id} aria-pressed={service.id === selectedServiceId} onClick={() => setSelectedServiceId(service.id)}><span className="services-cycle-number">{service.number}</span><Icon size={20} /><span>{service.title}</span><ChevronRight size={17} /></button>;
                })}
                <div className="services-cycle-note"><ShieldCheck size={22} /><span>Design. Build. Commission.<br /><strong>One accountable package.</strong></span></div>
              </div>
              <div className="services-cycle-detail" key={selectedService.id}>
                <div className="services-cycle-photo">
                  <MotionPhoto src={selectedService.image} alt={selectedService.title} /><button className="services-photo-expand" aria-label={`View ${selectedService.title} photo gallery`} onClick={() => setGalleryIndex(EDITORIAL_SERVICES.findIndex(item => item.id === selectedService.id))}><Maximize2 size={19} /></button>
                  <div className="services-capacity-badge visual-glass"><Droplets size={20} /><div><strong>{selectedService.capacity}</strong><span>Engineered for your scale</span></div></div>
                </div>
                <div className="services-cycle-caption">
                  <div><span className="visual-eyebrow">{selectedService.number} / Water infrastructure</span><h3>{selectedService.title}</h3><p>{selectedService.description}</p></div>
                  <button className="services-round-button" onClick={() => setSelectedDetail(selectedService)} aria-label={`View technical scope for ${selectedService.title}`}><ArrowUpRight size={25} /></button>
                </div>
                <button className="services-text-link" onClick={() => setSelectedDetail(selectedService)}>View technical scope <ArrowRight size={17} /></button>
              </div>
            </div>
          </section>

          <section className="services-intelligence visual-section">
            <div className="visual-container">
              <div className="services-intelligence-heading services-reveal"><SectionHeading eyebrow="Beyond infrastructure" title={<>Smarter systems.<br /><span className="visual-title-accent">Stronger performance.</span></>} description="Intelligent control, clean energy and ongoing care keep every asset working at its best." /></div>
              <div className="services-system-grid">
                {ADVANCED_SYSTEMS.map((service, index) => {
                  const Icon = SYSTEM_ICONS[index];
                  return <button key={service.id} className="services-system-card services-reveal" onClick={() => setSelectedDetail(service)}><ResponsiveImage src={service.image} alt={service.title} loading="lazy" sizes="800px" /><span className="services-system-icon"><Icon size={22} /></span><span className="services-system-copy"><span className="services-card-eyebrow">{index === 0 ? 'Connected intelligence' : index === 1 ? 'Sustainable energy' : 'Lifetime support'}</span><span className="services-system-title">{service.title}</span><span className="services-system-description">{index === 0 ? 'See your entire network. Control every critical point.' : index === 1 ? 'Harness clean energy for reliable water delivery.' : 'Keep essential infrastructure ready, every day.'}</span><span className="services-card-action">Explore solution <ArrowUpRight size={19} /></span></span></button>;
                })}
              </div>
            </div>
          </section>

          <section className="visual-section visual-container services-facility-section">
            <div className="services-facility-copy services-reveal"><SectionHeading eyebrow="Engineering, in perspective" title={<>Every stage.<br /><span className="visual-title-accent">A lasting impact.</span></>} description="From treatment to clear water storage, each facility has a part to play in a dependable water supply." /><div className="services-facility-note"><span>01</span><p>Purpose-built infrastructure.<br /><strong>Connected by thoughtful engineering.</strong></p></div></div>
            <div className="services-reveal"><FacilityComparison /></div>
          </section>
          </>}
      </div>
      <div hidden={!isProducts} id="services-panel-products" role="tabpanel" aria-labelledby="services-tab-products" className="services-panel services-enter">{isProducts && <>
          <ProductCatalog categoryRequest={productCategory} />
          <section className="visual-container services-product-feature services-reveal">
            <div className="services-product-feature-photo"><MotionPhoto key={networkView.id} src={networkView.image} alt={networkView.alt}><span className="services-network-caption"><networkView.icon size={22} />{networkView.caption}</span></MotionPhoto></div>
            <div className="services-product-feature-copy"><span className="visual-eyebrow">Technology that works together</span><h2>Your network.<br /><span className="visual-title-accent">One clear view.</span></h2><p>Bring meters, sensors, valves and pump controls into a central SCADA system. Make better decisions with visibility across your water network.</p><div className="services-network-picker" aria-label="Explore the connected components">{NETWORK_VIEWS.map(view => <button key={view.id} aria-pressed={view.id === networkFocus} onClick={() => setNetworkFocus(view.id)}>{view.label}</button>)}</div><button className="visual-button" onClick={() => setSelectedDetail(EDITORIAL_SERVICES[5])}>Explore SCADA integration <ArrowRight size={18} /></button></div>
          </section>
          </>}
      </div>

      <div className="services-final-cta services-reveal">
        <ImageCTA eyebrow="Let's build what comes next" title="Better water starts with a conversation." description="Share your project, technical scope or equipment requirement. Our engineering team will help you find the right way forward." image="/images/pump-house-rehbpR99.jpg" onAction={onOpenQuote} actionLabel={isProducts ? 'Discuss your requirement' : 'Discuss your project'} />
      </div>
      <ImageViewer images={INFRASTRUCTURE_GALLERY} index={galleryIndex} onIndexChange={setGalleryIndex} onClose={() => setGalleryIndex(null)} />
      <DetailDialog item={selectedDetail} onClose={() => setSelectedDetail(null)} onOpenQuote={onOpenQuote} />
    </div>
  );
}
