import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Layers3, Search, X } from 'lucide-react';
import { PRODUCT_CATEGORIES, PRODUCT_FAMILIES, PRODUCTS } from '../data/products';
import { assetPath } from '../config/deployment';

const categoryImage = category => category.products.find(product => product.id === 'electromagnetic-flow-meter') || category.products[0];

export default function ProductCategoryBrowser({ selectedId, familyId, onChoose, onClose }) {
  const dialogRef = useRef(null);
  const searchRef = useRef(null);
  const closeRef = useRef(null);
  const [browseFamily, setBrowseFamily] = useState(familyId);
  const [search, setSearch] = useState('');
  const [previewId, setPreviewId] = useState(selectedId === 'all' ? PRODUCT_CATEGORIES.find(category => familyId === 'all' || category.family === familyId).id : selectedId);
  const family = PRODUCT_FAMILIES.find(item => item.id === browseFamily);
  const preview = PRODUCT_CATEGORIES.find(item => item.id === previewId) || PRODUCT_CATEGORIES[0];
  const previewFamily = PRODUCT_FAMILIES.find(item => item.id === preview.family);
  const terms = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const categories = PRODUCT_CATEGORIES.filter(category => (browseFamily === 'all' || category.family === browseFamily) && terms.every(term => `${category.name} ${category.tagline} ${category.products.map(product => product.name).join(' ')}`.toLowerCase().includes(term)));
  const scopeProducts = PRODUCTS.filter(product => browseFamily === 'all' || product.family === browseFamily);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const dialog = dialogRef.current;
    dialog.showModal();
    const initialFocus = window.matchMedia('(pointer: coarse)').matches ? closeRef.current : searchRef.current;
    initialFocus?.focus({ preventScroll: true });
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, []);

  const choose = id => { onChoose(id, browseFamily); onClose(); };
  const browse = id => { setBrowseFamily(id); setPreviewId(PRODUCT_CATEGORIES.find(category => id === 'all' || category.family === id).id); };

  return <dialog ref={dialogRef} className="catalog-category-browser" aria-labelledby="category-browser-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }}>
    <header className="catalog-browser-heading">
      <div><span className="visual-eyebrow">THE ORBIT COLLECTION</span><h2 id="category-browser-title">A closer look.<span> The right fit.</span></h2><p>Explore {PRODUCT_CATEGORIES.length} categories. Choose what your project needs.</p></div>
      <button ref={closeRef} type="button" className="catalog-browser-close" aria-label="Close category browser" onClick={onClose}><X size={21} /></button>
    </header>
    <div className="catalog-browser-filters">
      <div className="catalog-browser-search">
        <span className="catalog-search-icon" aria-hidden="true"><Search size={20} strokeWidth={1.8} /></span>
        <label className="sr-only" htmlFor="category-browser-search">Search product categories or products</label>
        <input ref={searchRef} id="category-browser-search" type="search" placeholder="Search categories or products" autoComplete="off" spellCheck={false} value={search} onChange={event => setSearch(event.target.value)} />
        {search && <button type="button" aria-label="Clear category search" onClick={() => { setSearch(''); searchRef.current?.focus(); }}><X size={18} /></button>}
      </div>
      <div className="catalog-browser-families" aria-label="Browse categories by application">
        <button type="button" aria-pressed={browseFamily === 'all'} onClick={() => browse('all')}>All categories<span>{PRODUCT_CATEGORIES.length}</span></button>
        {PRODUCT_FAMILIES.map(item => <button type="button" key={item.id} aria-pressed={browseFamily === item.id} onClick={() => browse(item.id)}>{item.name}<span>{PRODUCT_CATEGORIES.filter(category => category.family === item.id).length}</span></button>)}
      </div>
    </div>
    <div className="catalog-browser-body">
      <aside className="catalog-browser-preview" aria-hidden="true">
        <div className="catalog-browser-landscape"><img src={assetPath(previewFamily.image)} alt="" /><span>ENGINEERED TO WORK TOGETHER.</span></div>
        <div className="catalog-browser-object" key={preview.id}><img src={assetPath(categoryImage(preview).image)} alt="" /><span>{preview.number} / THE COLLECTION</span></div>
        <div className="catalog-browser-preview-copy"><small>{previewFamily.name}</small><strong>{preview.name}</strong><p>{preview.tagline}</p><span>{preview.products.length} {preview.products.length === 1 ? 'product' : 'products'} to explore<ArrowRight size={17} /></span></div>
      </aside>
      <div className="catalog-browser-choices">
        <div className="catalog-browser-result-note" role="status">{categories.length} {categories.length === 1 ? 'category' : 'categories'}{family ? ` · ${family.name}` : ' · One connected collection'}</div>
        {!search && <button type="button" data-category-id="all" className="catalog-browser-all" aria-pressed={selectedId === 'all' && familyId === browseFamily} onClick={() => choose('all')}>
          <span className="catalog-browser-collage" aria-hidden="true">{[scopeProducts[0], scopeProducts[Math.min(2, scopeProducts.length - 1)], scopeProducts[scopeProducts.length - 1]].map((product, index) => <img key={`${product.id}-${index}`} src={assetPath(product.image)} alt="" />)}</span>
          <span><small>{scopeProducts.length} PRODUCTS</small><strong>{family ? `All in ${family.name}` : 'Explore the full collection'}</strong></span><ArrowRight size={20} />
        </button>}
        {categories.length ? <div className="catalog-browser-grid">
          {categories.map(category => <button key={category.id} type="button" data-category-id={category.id} className="catalog-browser-category" aria-pressed={selectedId === category.id} onPointerEnter={event => { if (event.pointerType !== 'touch') setPreviewId(category.id); }} onFocus={() => setPreviewId(category.id)} onClick={() => choose(category.id)}>
            <span className="catalog-browser-category-art"><span>{category.number}</span><img src={assetPath(categoryImage(category).image)} alt="" loading="lazy" /><span className="catalog-browser-category-count">{selectedId === category.id ? <Check size={14} /> : category.products.length}</span></span>
            <span className="catalog-browser-category-copy"><strong>{category.name}</strong><span>{category.products.length} {category.products.length === 1 ? 'product' : 'products'}<ArrowRight size={15} /></span></span>
          </button>)}
        </div> : <div className="catalog-browser-empty"><Layers3 size={29} /><strong>No categories found.</strong><p>Try another name or browse the full collection.</p><button type="button" onClick={() => { setSearch(''); setBrowseFamily('all'); }}>Show all categories <ArrowRight size={16} /></button></div>}
      </div>
    </div>
    <footer className="catalog-browser-footer"><Layers3 size={15} /><span>Choose a category to explore its products.</span><span>{PRODUCTS.length} products / {PRODUCT_CATEGORIES.length} categories</span></footer>
  </dialog>;
}
