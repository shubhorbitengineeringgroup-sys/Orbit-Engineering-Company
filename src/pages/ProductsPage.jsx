import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ArrowUpRight, Cpu, Layers, Sparkles, Star, 
  ChevronLeft, ChevronRight, Zap, ShieldCheck, X, 
  Download, MessageSquare, ArrowRight, Activity, Eye
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { assetPath } from '../config/deployment';
import { useScrollReveal } from '../hooks/useAnimations';

// Carousel for featured products at top
const featured = [0, 2, 4, 6, 8]; // indices from products

// Live enquiry counter
function LiveEnquiryBadge() {
  const [count, setCount] = useState(7);
  useEffect(() => {
    const t = setTimeout(() => setCount(c => c + Math.floor(Math.random() * 2)), 8000);
    return () => clearTimeout(t);
  }, [count]);
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full animate-pulse">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
      {count} enquiries today
    </span>
  );
}

// Product quick-view modal
function ProductModal({ item, onClose, onQuote }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div onClick={onClose} className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-4 animate-in zoom-in-95 duration-200">
        
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-slate-900">
          <img
            src={assetPath(item.image)}
            alt={item.name}
            className="w-full h-full object-cover opacity-90"
            onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=800&q=80'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm cursor-pointer">
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="inline-flex gap-1.5 mb-1.5">
              <span className="text-[10px] font-semibold bg-[#1e60aa] text-white px-2.5 py-0.5 rounded-full">{item.category}</span>
              <span className="text-[10px] font-medium bg-emerald-600 text-white px-2.5 py-0.5 rounded-full">{item.badge}</span>
            </div>
            <h3 className="text-lg font-bold text-white leading-snug">{item.name}</h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

          {/* Specs block */}
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
            <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Activity className="w-3 h-3" /> Technical Specifications
            </div>
            <div className="font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{item.specs}</div>
          </div>

          {/* Rating stars (mock) */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
            </div>
            <span className="text-xs text-slate-500 font-medium">5.0 (42 clients)</span>
            <LiveEnquiryBadge />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-3">
          <a
            href={`https://wa.me/919039075048?text=I%20want%20datasheet%20for:%20${encodeURIComponent(item.name)}`}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
          </a>
          <button
            onClick={() => { onClose(); onQuote(); }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-white bg-[#1e60aa] hover:bg-[#165091] rounded-xl shadow-sm transition-colors cursor-pointer glow-btn"
          >
            Request Quote <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage({ onOpenQuote }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const carouselTimer = useRef(null);
  const headerReveal = useScrollReveal();
  const gridReveal   = useScrollReveal();

  const categories = ['All', 'Flow Measurement', 'Smart Metering', 'Water Quality Analyzers', 'Level Sensors', 'Valves & Piping', 'Automation & Telemetry', 'Solar Solutions'];

  const filteredProducts = siteConfig.products.filter(p => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Auto-advance carousel
  useEffect(() => {
    carouselTimer.current = setInterval(() => {
      setCarouselIdx(i => (i + 1) % Math.min(5, siteConfig.products.length));
    }, 3500);
    return () => clearInterval(carouselTimer.current);
  }, []);

  const featuredProduct = siteConfig.products[carouselIdx] || siteConfig.products[0];

  return (
    <div className="w-full bg-[#f8fafc] text-slate-900 pt-28 pb-24">
      <div className="fixed inset-0 tech-grid-bg opacity-30 pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── HEADER ── */}
        <div ref={headerReveal.ref} className="reveal-up text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orbit-50 text-[#1e60aa] border border-orbit-200 text-[11px] font-semibold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>BIS, MID &amp; CE Certified Instruments</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
            Industrial Flow, Analyzers &amp;{' '}
            <span className="shimmer-text">Automation Hardware</span>
          </h1>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <LiveEnquiryBadge />
            <p className="text-xs text-slate-500 font-normal">
              High-precision instruments for WTP, STP, SCADA &amp; Smart Cities
            </p>
          </div>
        </div>

        {/* ── FEATURED PRODUCT SPOTLIGHT (Auto-rotating carousel) ── */}
        <div className="mt-10 reveal-scale">
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-700 flex flex-col sm:flex-row items-stretch min-h-[220px]">
            
            {/* Image side */}
            <div className="sm:w-2/5 relative overflow-hidden img-zoom-wrap">
              <img
                key={carouselIdx}
                src={assetPath(featuredProduct?.image)}
                alt={featuredProduct?.name}
                className="w-full h-full object-cover opacity-90 transition-all duration-700"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=800&q=80'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/60 sm:bg-gradient-to-l pointer-events-none" />
            </div>

            {/* Content side */}
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between text-white relative">
              <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold bg-[#1e60aa] px-2.5 py-0.5 rounded-full uppercase tracking-wide">Featured Instrument</span>
                  <span className="text-[10px] font-medium bg-emerald-600 px-2 py-0.5 rounded-full">{featuredProduct?.badge}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold leading-snug">{featuredProduct?.name}</h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-2">{featuredProduct?.description}</p>
                <div className="mt-3 font-mono text-[10px] text-sky-300 bg-slate-800/60 px-3 py-2 rounded-lg border border-slate-700 line-clamp-2">{featuredProduct?.specs}</div>
              </div>

              <div className="flex items-center justify-between mt-4">
                {/* Carousel dots */}
                <div className="flex gap-1.5">
                  {siteConfig.products.slice(0, 5).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setCarouselIdx(i); clearInterval(carouselTimer.current); }}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${i === carouselIdx ? 'w-5 bg-sky-400' : 'w-1.5 bg-white/30 hover:bg-white/60'}`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedProduct(featuredProduct)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-xl text-white border border-white/20 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Quick View
                  </button>
                  <button
                    onClick={onOpenQuote}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#1e60aa] hover:bg-[#165091] rounded-xl text-white shadow transition-colors cursor-pointer glow-btn"
                  >
                    Get Quote <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── FILTER BAR ── */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-200/60 rounded-2xl border border-slate-300/50 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#1e60aa] text-white shadow-sm font-semibold scale-102'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/60 font-medium'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search product or spec..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e60aa] shadow-sm"
              />
            </div>
            <div className="text-xs text-slate-500 shrink-0">
              <span className="text-[#1e60aa] font-bold">{filteredProducts.length}</span> items
            </div>
          </div>
        </div>

        {/* ── PRODUCTS GRID ── */}
        <div ref={gridReveal.ref} className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((item, idx) => (
            <div
              key={item.id}
              className={`reveal-up delay-${Math.min(idx * 80, 500)} bg-white rounded-3xl overflow-hidden border group card-3d flex flex-col justify-between transition-all cursor-pointer gradient-border ${
                hoveredId === item.id ? 'border-[#1e60aa] shadow-xl' : 'border-slate-200/90'
              }`}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedProduct(item)}
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-900 img-zoom-wrap">
                  <img
                    src={assetPath(item.image)}
                    alt={item.name}
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=800&q=80'; }}
                    className="w-full h-full object-cover opacity-95 group-hover:opacity-100"
                  />
                  
                  {/* Hover overlay with Quick View */}
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 bg-slate-900/80 rounded-full text-white text-xs font-medium backdrop-blur-sm flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-sky-400" /> Quick View
                    </span>
                  </div>

                  <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-800 shadow border border-slate-100">
                    {item.category}
                  </div>
                  <div className="absolute top-2.5 right-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-medium">
                    {item.badge}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-[#1e60aa] transition-colors leading-snug">{item.name}</h3>
                  <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
                  
                  {/* Specs pill */}
                  <div className="mt-2.5 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1.5">
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Tech Spec</div>
                    <div className="font-mono text-[10.5px] text-slate-700 line-clamp-1">{item.specs}</div>
                  </div>

                  {/* Star rating */}
                  <div className="mt-2.5 flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                    </div>
                    <span className="text-[10px] text-slate-400">(verified clients)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 mt-1">
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenQuote(); }}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-[#1e60aa] hover:text-white bg-blue-50 hover:bg-[#1e60aa] rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Request Datasheet &amp; Quote
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── BOTTOM CTA BANNER ── */}
        <div className="mt-16 reveal-scale rounded-3xl bg-gradient-to-r from-[#1e60aa] to-sky-500 text-white p-7 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, white 0%, transparent 60%)' }} />
          <div className="relative z-10">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-sky-200 mb-1">Need a custom instrument bundle?</div>
            <h3 className="text-lg sm:text-xl font-bold">Get a Complete Technical Proposal &amp; Pricing</h3>
            <p className="text-xs text-sky-100 mt-1 font-normal">Our engineers will prepare a BOQ with datasheets, compliance certificates, and delivery schedule.</p>
          </div>
          <div className="flex gap-3 shrink-0 relative z-10">
            <a href="https://wa.me/919039075048?text=I%20need%20technical%20instruments%20quotation"
              target="_blank" rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow"
            >
              <MessageSquare className="w-4 h-4" /> WhatsApp
            </a>
            <button
              onClick={onOpenQuote}
              className="px-5 py-2.5 rounded-2xl bg-white text-[#1e60aa] font-bold text-xs hover:bg-slate-100 transition-colors shadow-lg cursor-pointer"
            >
              Request BOQ
            </button>
          </div>
        </div>

      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductModal item={selectedProduct} onClose={() => setSelectedProduct(null)} onQuote={onOpenQuote} />
      )}
    </div>
  );
}
