import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Camera, Check, ChevronDown, Cpu, Download, Droplets, Gauge, MessageSquare, Search, Sun, Waves, X } from 'lucide-react';
import { PRODUCT_CATEGORIES, PRODUCT_FAMILIES, PRODUCTS } from '../data/products';
import { siteConfig } from '../config/siteConfig';
import { assetPath } from '../config/deployment';
import ProductCategoryBrowser from './ProductCategoryBrowser';
import '../styles/product-catalog.css';

const FAMILY_ICONS = { water: Droplets, measurement: Gauge, flow: Waves, connected: Cpu, energy: Sun, advanced: Camera };
const enquiryUrl = (product, brochure = false) => `https://wa.me/${siteConfig.company.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello Orbit Engineering Solutions, I would like ${brochure ? 'the brochure and technical specifications' : 'an application consultation and quotation'} for ${product.name} (${product.category}). Please help me select the right configuration.`)}`;

function ProductDetails({ product, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const node = dialogRef.current;
    node.showModal();
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      node.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, []);
  return <dialog ref={dialogRef} className="catalog-detail" aria-labelledby="catalog-detail-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }}>
    <button ref={closeRef} className="catalog-detail-close" aria-label="Close product details" onClick={onClose}><X size={21} /></button>
    <div className="catalog-detail-image"><span className="catalog-detail-index">THE ORBIT COLLECTION / {product.categoryNumber}</span><img src={assetPath(product.image)} alt={product.name} /><span className="catalog-detail-image-label">{product.category}</span></div>
    <div className="catalog-detail-copy">
      <span className="visual-eyebrow">{product.category}</span><h2 id="catalog-detail-title">{product.name}</h2>
      {product.description && <p>{product.description}</p>}
      {product.features.length > 0 && <div className="catalog-detail-features"><h3>{product.featureLabel}</h3><ul>{product.features.map(feature => <li key={feature}><Check size={17} /><span>{feature}</span></li>)}</ul></div>}
      <div className="catalog-detail-actions"><a href={enquiryUrl(product)} target="_blank" rel="noopener noreferrer" className="visual-button">Discuss this product <MessageSquare size={17} /></a>{product.document ? <a href={assetPath(product.document)} target="_blank" rel="noopener noreferrer" className="catalog-brochure"><Download size={18} />Open catalogue PDF<ArrowUpRight size={16} /></a> : <a href={enquiryUrl(product, true)} target="_blank" rel="noopener noreferrer" className="catalog-brochure"><Download size={18} />Request product brochure<ArrowUpRight size={16} /></a>}</div>
      <p className="catalog-detail-note">Share your application with our engineers to select the right model and configuration.</p>
    </div>
  </dialog>;
}

export default function ProductCatalog({ categoryRequest }) {
  const [familyId, setFamilyId] = useState('all');
  const [categoryId, setCategoryId] = useState('all');
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryBrowserOpen, setCategoryBrowserOpen] = useState(false);
  const resultsRef = useRef(null);
  const searchRef = useRef(null);
  const loadMoreRef = useRef(null);
  const sceneFamily = PRODUCT_FAMILIES.find(family => family.id === familyId) || PRODUCT_FAMILIES[0];
  const featured = PRODUCTS.find(product => product.id === sceneFamily.featured);
  const familyCategories = PRODUCT_CATEGORIES.filter(category => familyId === 'all' || category.family === familyId);
  const selectedCategory = PRODUCT_CATEGORIES.find(category => category.id === categoryId);

  useEffect(() => {
    const category = PRODUCT_CATEGORIES.find(category => category.name === categoryRequest?.name);
    setCategoryId(category?.id || 'all');
    setFamilyId(category?.family || 'all');
    setQuery('');
  }, [categoryRequest]);
  useEffect(() => { setVisibleCount(12); }, [query, familyId, categoryId]);

  const filtered = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return PRODUCTS.filter(product => (familyId === 'all' || product.family === familyId) && (categoryId === 'all' || product.categoryId === categoryId) && terms.every(term => `${product.name} ${product.category} ${product.description} ${product.features.join(' ')}`.toLowerCase().includes(term)));
  }, [query, familyId, categoryId]);

  const chooseFamily = id => { setFamilyId(id); setCategoryId('all'); };
  const chooseCategory = id => { const category = PRODUCT_CATEGORIES.find(category => category.id === id); setCategoryId(id); if (category && familyId !== 'all' && category.family !== familyId) setFamilyId(category.family); };
  const chooseFromBrowser = (id, browseFamily) => { const category = PRODUCT_CATEGORIES.find(item => item.id === id); setCategoryId(id); setFamilyId(category?.family || browseFamily); };
  const resetFilters = () => { setQuery(''); setFamilyId('all'); setCategoryId('all'); };
  const scrollToResults = () => resultsRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  const showMore = () => {
    const firstNewId = filtered[visibleCount]?.id;
    setVisibleCount(count => count + 12);
    // Keep keyboard users at the next product when the last load button disappears.
    if (visibleCount + 12 >= filtered.length && firstNewId && document.activeElement === loadMoreRef.current) requestAnimationFrame(() => document.getElementById(`catalog-product-${firstNewId}`)?.focus({ preventScroll: true }));
  };

  return <div className="product-catalog">
    <section className="visual-container catalog-collection">
      <div className="catalog-heading"><div><span className="visual-eyebrow">104 products. 22 categories.</span><h2>Find the detail.<br /><span>Build the bigger picture.</span></h2></div><p>Real equipment. One connected collection.<br />Explore by application, then choose the right fit.</p></div>
      <div className="catalog-families" aria-label="Filter product families">
        <button aria-pressed={familyId === 'all'} className="catalog-all-family" onClick={() => chooseFamily('all')}><span>ALL</span><strong>Full collection</strong><small>{PRODUCTS.length}</small></button>
        {PRODUCT_FAMILIES.map(family => { const Icon = FAMILY_ICONS[family.id]; return <button key={family.id} aria-pressed={familyId === family.id} onClick={() => chooseFamily(family.id)}><Icon size={21} /><strong>{family.name}</strong><small>{PRODUCTS.filter(product => product.family === family.id).length}</small></button>; })}
      </div>
      <div className="catalog-family-scene" style={{ '--catalog-accent': sceneFamily.accent }} key={sceneFamily.id}>
        <div className="catalog-family-landscape"><img src={assetPath(sceneFamily.image)} alt="" loading="lazy" /></div>
        <div className="catalog-family-copy"><span className="visual-eyebrow">Explore / {sceneFamily.name}</span><h3>{sceneFamily.title}</h3><p>{sceneFamily.description}</p><button onClick={scrollToResults}>Discover the collection<ArrowDown size={18} /></button></div>
        <button className="catalog-family-object" aria-label={`Explore ${featured.name}`} onClick={() => setSelectedProduct(featured)}><span className="catalog-object-orbit" aria-hidden="true" /><img src={assetPath(featured.image)} alt={featured.name} loading="lazy" /><span className="catalog-object-label"><span>{featured.category}<strong>{featured.name}</strong></span><ArrowUpRight size={24} /></span></button>
      </div>
    </section>

    <section ref={resultsRef} className="visual-container catalog-results" aria-label="Product catalogue">
      <div className="catalog-toolbar">
        <div className="catalog-search">
          <span className="catalog-search-icon" aria-hidden="true"><Search size={20} strokeWidth={1.8} /></span>
          <label className="sr-only" htmlFor="catalog-search">Search products by name, technology or features</label>
          <input ref={searchRef} id="catalog-search" type="search" placeholder="Search products or technologies" autoComplete="off" spellCheck={false} value={query} onChange={event => setQuery(event.target.value)} />
          {query && <button type="button" onClick={() => { setQuery(''); searchRef.current?.focus(); }} aria-label="Clear product search"><X size={18} /></button>}
        </div>
        <button type="button" id="catalog-category" className="catalog-category-trigger" aria-haspopup="dialog" aria-expanded={categoryBrowserOpen} onClick={() => setCategoryBrowserOpen(true)}>
          <span className="catalog-category-thumbnails" aria-hidden="true">{(selectedCategory ? selectedCategory.products.slice(0, 3) : [PRODUCTS[1], PRODUCTS.find(product => product.id === 'butterfly-valves'), PRODUCTS.find(product => product.id === 'mo-3-4')]).map((product, index) => <img key={`${product.id}-${index}`} src={assetPath(product.image)} alt="" loading="lazy" decoding="async" />)}</span>
          <span className="catalog-category-trigger-copy"><small>PRODUCT CATEGORY</small><strong>{selectedCategory?.name || (familyId === 'all' ? 'All categories' : 'All in this family')}</strong><span>{selectedCategory ? `${selectedCategory.products.length} products` : `${familyCategories.length} categories`}<span>Browse the collection</span></span></span><span className="catalog-category-trigger-arrow"><ChevronDown size={19} /></span>
        </button>
      </div>
      {familyId !== 'all' && <div className="catalog-category-pills" aria-label="Choose a product category"><button aria-pressed={categoryId === 'all'} onClick={() => chooseCategory('all')}>All in this family</button>{familyCategories.map(category => <button key={category.id} aria-pressed={categoryId === category.id} onClick={() => chooseCategory(category.id)}>{category.name}<span>{category.products.length}</span></button>)}</div>}
      <div className="catalog-results-bar"><div><h3>{selectedCategory?.name || (familyId === 'all' ? 'The full collection' : sceneFamily.name)}</h3><p role="status">{filtered.length} {filtered.length === 1 ? 'product' : 'products'}{query ? ` matching “${query}”` : ' to explore'}<span> / {PRODUCTS.length} total</span></p></div>{(query || categoryId !== 'all' || familyId !== 'all') && <button className="catalog-reset" onClick={resetFilters}>Reset filters<X size={15} /></button>}</div>
      {selectedCategory && <p className="catalog-category-tagline">{selectedCategory.tagline}</p>}
      {filtered.length ? <>
        <div className="catalog-grid">{filtered.slice(0, visibleCount).map((product, index) => <button key={product.id} id={`catalog-product-${product.id}`} className="catalog-product" onClick={() => setSelectedProduct(product)} style={{ '--catalog-delay': `${Math.min(index % 3, 2) * 45}ms` }}><span className="catalog-product-art"><span className="catalog-product-number">{product.categoryNumber}</span><img src={assetPath(product.image)} alt={product.name} loading="lazy" decoding="async" /><span className="catalog-product-open"><ArrowUpRight size={21} /></span></span><span className="catalog-product-copy"><span className="catalog-product-category">{product.category}</span><strong>{product.name}</strong><span className="catalog-product-action">Explore product<ArrowRight size={16} /></span></span></button>)}</div>
        <div className="catalog-pagination"><span>Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} products</span>{visibleCount < filtered.length && <button ref={loadMoreRef} className="visual-button visual-button--secondary" onClick={showMore}>Show {Math.min(12, filtered.length - visibleCount)} more products<ArrowDown size={18} /></button>}<div aria-hidden="true"><span style={{ width: `${Math.min(100, visibleCount / filtered.length * 100)}%` }} /></div></div>
      </> : <div className="catalog-empty"><Search size={34} /><h3>A different search could be the right fit.</h3><p>Try a product name, measurement type or technology.</p><button className="visual-button" onClick={resetFilters}>Explore all products<ArrowRight size={18} /></button></div>}
    </section>
    {selectedProduct && <ProductDetails product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    {categoryBrowserOpen && <ProductCategoryBrowser selectedId={categoryId} familyId={familyId} onChoose={chooseFromBrowser} onClose={() => setCategoryBrowserOpen(false)} />}
  </div>;
}
