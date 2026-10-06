import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Menu, MessageSquare, X } from 'lucide-react';

// ─── FIXED NAVBAR HEIGHT CONSTANTS ────────────────────────────────────────────
// These values MUST match the actual rendered py-* values below so the hero's
// static top-padding is correct on the very first paint — no JS measurement needed.
//
//   top state (transparent):  py-4 = 16px top + 16px bottom → total ≈ 16 + logo_h + 16
//   scrolled state:           py-3 = 12px top + 12px bottom
//
// Hero uses pt-[NAVBAR_H_PX] directly in its className, keyed off these.
// We export them so HeroSection can import the same constant.
export const NAVBAR_TOP_H = 68;    // px — transparent/top state (py-4 + logo h-11 = 44+12+12)
export const NAVBAR_SCROLL_H = 60; // px — scrolled state (py-3 + logo h-10 = 40+10+10) — not used by hero

const NAV_LINKS = [
  { label: 'Home',       page: 'home',     sectionId: 'section-home'     },
  { label: 'About',      page: 'about',    sectionId: 'section-about'    },
  { label: 'Products',   page: 'products', sectionId: 'section-products' },
  { label: 'Solutions',  page: 'solutions', sectionId: 'section-solutions'},
  { label: 'Ecosystem',  page: 'ecosystem', sectionId: 'our-ecosystem' },
  { label: 'Contact Us', page: 'contact',  sectionId: 'section-contact'  },
];

export default function Navbar({ activePage = 'home', onNavigate, onOpenQuote }) {
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);
  const activeSection = NAV_LINKS.find(link => link.page === activePage)?.label;
  const navigate = (page) => { setMenuOpen(false); onNavigate?.(page); };

  // ── Scroll: detect scrolled state for bg switch ──────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    // Set immediately on mount so SSR/hydration matches
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [activePage]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = event => { if (event.key === 'Escape') { setMenuOpen(false); menuButton.current?.focus(); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-300 ${
        scrolled || menuOpen || activePage === 'solutions'
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80'
          : 'bg-transparent'
      } ${scrolled || menuOpen ? 'py-3' : 'py-4'}`}
    >
      <div className="w-full px-6 sm:px-8 lg:px-[4%] xl:px-[5%] flex items-center gap-2 lg:gap-4">

        {/* ══ LEFT: ORBIT LOGO ══ */}
        <button
          onClick={() => navigate('home')}
          aria-label="Orbit Engineering home"
          className="flex items-center gap-2.5 group cursor-pointer select-none text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0073bc] hover:opacity-95 shrink-0"
        >
          <div className="h-9 sm:h-10 lg:h-11 xl:h-12 w-auto flex items-center justify-center shrink-0">
            <img
              src="/logo.png"
              alt="Orbit Logo"
              className="h-full w-auto object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-bold text-[21px] sm:text-[24px] lg:text-[26px] xl:text-[29px] leading-none tracking-tight text-[#0a2748] font-sans">
              ORBIT
            </span>
            <span className="text-[7px] sm:text-[8.5px] lg:text-[9px] xl:text-[10px] font-bold tracking-[0.22em] uppercase text-[#0a2748] leading-tight mt-0.5">
              ENGINEERING COMPANY
            </span>
          </div>
        </button>

        {/* Main page navigation */}
        <nav aria-label="Main navigation" className="hidden lg:flex flex-1 items-center justify-center gap-4 xl:gap-6 2xl:gap-8 min-w-0">
          {NAV_LINKS.map(({ label, page }) => {
            const isActive = label === activeSection;
            return (
              <button
                key={label}
                onClick={() => navigate(page)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1 text-[13px] xl:text-[14px] 2xl:text-[15.5px] tracking-tight transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0073bc] whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-[#0070bb] font-bold'
                    : 'text-[#1e293b] font-semibold hover:text-[#0070bb]'
                }`}
              >
                <span>{label}</span>
                {/* Active dot indicator */}
                {isActive && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#0070bb]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* ══ RIGHT: GET IN TOUCH only (no hamburger) ══ */}
        <div className="ml-auto lg:ml-0 shrink-0">
          <button
            onClick={() => onOpenQuote ? onOpenQuote() : onNavigate?.('contact')}
            aria-label="Get in Touch"
            title="Get in Touch"
            className="inline-flex items-center gap-2 px-3 py-2.5 sm:px-6 sm:py-3 xl:px-7 xl:py-3 rounded-full bg-[#0a233f] hover:bg-[#06192e] text-white text-[12.5px] sm:text-[13px] xl:text-[14px] font-semibold shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer whitespace-nowrap"
          >
            <span className="hidden sm:inline">Get in Touch</span>
            <MessageSquare className="sm:hidden w-4 h-4 stroke-[2.4]" />
            <ArrowRight className="hidden sm:inline w-4 h-4 stroke-[2.4]" />
          </button>
        </div>

        <button ref={menuButton} type="button" className="orbit-menu-toggle lg:hidden" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(value => !value)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>
      {menuOpen && <nav id="mobile-navigation" className="orbit-mobile-nav lg:hidden" aria-label="Mobile navigation">
        {NAV_LINKS.map(({ label, page }) => <button key={page} type="button" onClick={() => navigate(page)} aria-current={activePage === page ? 'page' : undefined}>{label}<ArrowRight size={17} /></button>)}
        <span>Water. People. Planet.</span>
      </nav>}
    </header>
  );
}
