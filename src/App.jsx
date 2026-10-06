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
import ServiceDetailPage from './pages/ServiceDetailPage';
import ProductCategoryPage, { ProductCategoryDirectory } from './pages/ProductCategoryPage';
import ProcurementGuidePage from './pages/ProcurementGuidePage';
import SearchContent from './components/SearchContent';
import { getPage, normalizePath, pathForPage, updateSeoHead } from './config/seo';
import { siteConfig } from './config/siteConfig';
import { sitePath, fromSitePath } from './config/deployment';

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
      href={siteConfig.company.contact.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-[999] flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl transition-all duration-500 ${
        visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4 pointer-events-none'
      } hover:scale-110 cursor-pointer`}
      title="Chat on WhatsApp"
      aria-label="Discuss your project with Orbit Engineering on WhatsApp"
    >
      {/* Ripple ring */}
      {pulse && (
        <span className="absolute w-full h-full rounded-full bg-emerald-400/50 animate-ping" />
      )}
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" aria-hidden="true">
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

export default function App({ initialPath }) {
  const [currentPath, setCurrentPath] = useState(() => normalizePath(initialPath || (typeof window !== 'undefined' ? fromSitePath(window.location.pathname) : '/')));
  const page = getPage(currentPath);
  const currentPage = page.type === 'service' ? 'solutions' : page.type === 'category' ? 'products' : page.id;
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [navigating, setNavigating] = useState(false);

  const handleNavigate = (page) => {
    setNavigating(true);
    setTimeout(() => setNavigating(false), 650);

    const target = pathForPage(page);
    const destination = normalizePath(target);
    setCurrentPath(destination);
    setQuoteModalOpen(false);
    const browserTarget = sitePath(target);
    if (window.location.pathname + window.location.hash !== browserTarget) window.history.pushState(null, '', browserTarget);
    window.scrollTo({ top: 0, behavior: 'auto' });
    const anchor = target.split('#')[1];
    if (anchor) requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView());
    if (page === 'team') {
      setTimeout(() => {
        const teamEl = document.getElementById('leadership-team');
        if (teamEl) teamEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  useEffect(() => {
    const syncPage = () => {
      // Retain bookmarks from the original hash router, while using crawlable paths.
      const logicalPath = fromSitePath(window.location.pathname);
      const legacy = logicalPath === '/' && ['home', 'about', 'products', 'solutions', 'services', 'projects', 'ecosystem', 'contact', 'team'].includes(window.location.hash.slice(1)) ? window.location.hash.slice(1) : null;
      const path = normalizePath(legacy ? pathForPage(legacy) : logicalPath);
      if (legacy) window.history.replaceState(null, '', sitePath(path + (legacy === 'team' ? '#leadership-team' : '')));
      setCurrentPath(path);
      setQuoteModalOpen(false);
      if (window.location.hash) requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView());
      else window.scrollTo({ top: 0, behavior: 'auto' });
    };
    syncPage();
    window.addEventListener('popstate', syncPage);
    window.addEventListener('hashchange', syncPage);
    return () => { window.removeEventListener('popstate', syncPage); window.removeEventListener('hashchange', syncPage); };
  }, []);

  useEffect(() => { updateSeoHead(currentPath); }, [currentPath]);

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
    if (!('IntersectionObserver' in window) || !('MutationObserver' in window)) return;
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
  }, [currentPath]);

  return (
    <div className="relative min-h-screen bg-[#f8fafc] text-slate-900 overflow-x-hidden font-sans selection:bg-[#1e60aa] selection:text-white">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Loading progress bar */}
      <PageLoadBar active={navigating} />

      {/* Navbar */}
      <Navbar activePage={currentPage} onNavigate={handleNavigate} onOpenQuote={() => setQuoteModalOpen(true)} />

      {/* Page Content with transition */}
      <main id="main-content" tabIndex={-1} className="relative z-10">
        {page.id === 'home' && (
          <PageTransition pageKey="home">
            <HomePage
              onNavigate={handleNavigate}
              onOpenQuote={() => setQuoteModalOpen(true)}
            />
          </PageTransition>
        )}

        {page.id === 'about' && (
          <PageTransition pageKey="about">
            <AboutPage onNavigate={handleNavigate} onOpenQuote={() => setQuoteModalOpen(true)} />
          </PageTransition>
        )}

        {!page.type && (page.id === 'products' || page.id === 'solutions') && (
          <PageTransition pageKey={currentPath}>
            <ServicesPage initialTab={currentPage} onTabChange={handleNavigate} onOpenQuote={() => setQuoteModalOpen(true)} />
          </PageTransition>
        )}

        {page.id === 'ecosystem' && (
          <PageTransition pageKey="ecosystem">
            <EcosystemPage onOpenQuote={() => setQuoteModalOpen(true)} />
          </PageTransition>
        )}

        {page.id === 'contact' && (
          <PageTransition pageKey="contact">
            <ContactPage />
          </PageTransition>
        )}
        {page.type === 'service' && <ServiceDetailPage key={page.id} service={page.service} onNavigate={handleNavigate} onOpenQuote={() => setQuoteModalOpen(true)} />}
        {page.type === 'category' && <ProductCategoryPage key={page.id} category={page.category} onNavigate={handleNavigate} />}
        {page.type === 'guide' && <ProcurementGuidePage onNavigate={handleNavigate} />}
        {page.noindex && <section className="visual-container pt-40 pb-24"><h1 className="text-4xl font-bold mb-5">Page not found</h1><p className="mb-6">Explore our engineering solutions or contact the Bhopal team for help.</p><a href={sitePath('/solutions')} className="visual-button">Explore solutions</a></section>}
        {!page.type && !page.noindex && <SearchContent page={page.id} onNavigate={handleNavigate} />}
        {page.id === 'products' && !page.type && <ProductCategoryDirectory onNavigate={handleNavigate} />}
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
