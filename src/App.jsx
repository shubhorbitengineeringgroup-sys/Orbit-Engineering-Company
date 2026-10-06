import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ContactModal from './components/ContactModal';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import EcosystemPage from './pages/EcosystemPage';
import ContactPage from './pages/ContactPage';

// Floating WhatsApp button
function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    // Stop pulsing after 6s
    const t = setTimeout(() => setPulse(false), 6000);
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(t); };
  }, []);

  return (
    <a
      href="https://wa.me/919039075048?text=Hello%20Orbit%20Engineering%20Solutions"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-[999] flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl transition-all duration-500 ${
        visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
      } hover:scale-110 cursor-pointer`}
      title="Chat on WhatsApp"
    >
      {/* Ripple ring */}
      {pulse && (
        <span className="absolute w-full h-full rounded-full bg-emerald-400/50 animate-ping" />
      )}
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  );
}

// Page transition wrapper
function PageTransition({ children, pageKey }) {
  return <div key={pageKey} className="visual-page-transition">{children}</div>;
}

// Top loading bar on page change
function PageLoadBar({ active }) {
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (active) {
      setVisible(true);
      setWidth(0);
      setTimeout(() => setWidth(70), 50);
      setTimeout(() => setWidth(95), 300);
      setTimeout(() => { setWidth(100); setTimeout(() => setVisible(false), 300); }, 600);
    }
  }, [active]);

  return visible ? (
    <div
      className="fixed top-0 left-0 z-[2000] h-0.5 transition-all duration-500 rounded-r-full"
      style={{ width: `${width}%`, background: 'linear-gradient(90deg, #1e60aa, #38bdf8, #34d399)' }}
    />
  ) : null;
}

const pageFromHash = () => {
  const page = window.location.hash.slice(1);
  return ['home', 'about', 'products', 'solutions', 'ecosystem', 'contact'].includes(page) ? page : page === '' ? 'home' : null;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => pageFromHash() || 'home');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [navigating, setNavigating] = useState(false);

  const handleNavigate = (page) => {
    setNavigating(true);
    setTimeout(() => setNavigating(false), 650);

    const destination = ['service', 'services', 'solution', 'projects'].includes(page) ? 'solutions' : page === 'team' ? 'about' : page;
    setCurrentPage(destination);
    if (window.location.hash !== `#${destination}`) window.history.pushState(null, '', `#${destination}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (page === 'team') {
      setTimeout(() => {
        const teamEl = document.getElementById('leadership-team');
        if (teamEl) teamEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  useEffect(() => {
    const syncPage = () => { const page = pageFromHash(); if (page) { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'instant' }); } };
    window.addEventListener('popstate', syncPage);
    window.addEventListener('hashchange', syncPage);
    return () => { window.removeEventListener('popstate', syncPage); window.removeEventListener('hashchange', syncPage); };
  }, []);

  // Keyboard shortcut: Ctrl+K for quote
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setQuoteModalOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Global scroll reveal engine across the entire website
  useEffect(() => {
    const selector = '.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade, .reveal-bounce';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observed = new WeakSet();
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.06, rootMargin: '0px 0px -18px 0px' });
    const observeNew = () => document.querySelectorAll(selector).forEach(el => {
      if (reduced) el.classList.add('visible');
      else if (!observed.has(el) && !el.classList.contains('visible')) { observed.add(el); observer.observe(el); }
    });
    observeNew();
    const mutation = new MutationObserver(observeNew);
    mutation.observe(document.querySelector('main'), { childList: true, subtree: true });
    return () => { observer.disconnect(); mutation.disconnect(); };
  }, [currentPage]);

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-900 overflow-x-hidden font-sans selection:bg-[#1e60aa] selection:text-white">

      {/* Loading progress bar */}
      <PageLoadBar active={navigating} />

      {/* Navbar */}
      <Navbar activePage={currentPage} onNavigate={handleNavigate} onOpenQuote={() => setQuoteModalOpen(true)} />

      {/* Page Content with transition */}
      <main className="relative z-10">
        {currentPage === 'home' && (
          <PageTransition pageKey="home">
            <HomePage
              onNavigate={handleNavigate}
              onOpenQuote={() => setQuoteModalOpen(true)}
            />
          </PageTransition>
        )}

        {currentPage === 'about' && (
          <PageTransition pageKey="about">
            <AboutPage onNavigate={handleNavigate} onOpenQuote={() => setQuoteModalOpen(true)} />
          </PageTransition>
        )}

        {(currentPage === 'products' || currentPage === 'solutions') && (
          <PageTransition pageKey="services">
            <ServicesPage initialTab={currentPage} onTabChange={tab => { setCurrentPage(tab); if (window.location.hash !== `#${tab}`) window.history.pushState(null, '', `#${tab}`); }} onOpenQuote={() => setQuoteModalOpen(true)} />
          </PageTransition>
        )}

        {currentPage === 'ecosystem' && (
          <PageTransition pageKey="ecosystem">
            <EcosystemPage onOpenQuote={() => setQuoteModalOpen(true)} />
          </PageTransition>
        )}

        {currentPage === 'contact' && (
          <PageTransition pageKey="contact">
            <ContactPage />
          </PageTransition>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} onOpenQuote={() => setQuoteModalOpen(true)} />



      {/* Quote Modal */}
      <ContactModal isOpen={quoteModalOpen} onClose={() => setQuoteModalOpen(false)} />

      {/* Floating WhatsApp button */}
      <FloatingWhatsApp />

    </div>
  );
}
