import React, { useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Droplets, X } from 'lucide-react';
import '../styles/visual-system.css';
import PageLink from './PageLink';
import ResponsiveImage from './ResponsiveImage';

export function PageHero({ eyebrow, title, description, image, imageAlt, metrics = [], children }) {
  return (
    <section className="visual-hero">
      <div className="visual-hero__scene" aria-hidden="true">
        <ResponsiveImage src={image} alt="" loading="eager" fetchPriority="high" />
      </div>
      <div className="visual-container visual-hero__layout">
        <div className="visual-hero__copy">
          <div className="visual-eyebrow"><span />{eyebrow}</div>
          <h1>{title}</h1>
          <p>{description}</p>
          {children && <div className="visual-hero__actions">{children}</div>}
        </div>
        <div className="visual-hero__visual" role="img" aria-label={imageAlt || 'Water infrastructure and engineering'}>
          <div className="visual-hero__note visual-glass">
            <span className="visual-hero__icon"><Droplets size={24} /></span>
            <div><strong>Water. People. Planet.</strong><span>Engineering a brighter tomorrow.</span></div>
            <svg viewBox="0 0 180 35" aria-hidden="true"><path d="M2 29H44L72 18L103 23L142 9L176 3" /><circle cx="176" cy="3" r="3" /></svg>
          </div>
        </div>
      </div>
      {metrics.length > 0 && <div className="visual-container visual-hero__metrics-wrap"><div className="visual-hero__metrics">
        {metrics.map(({ value, label }) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
      </div><span className="visual-hero__caption">CLEANER WATER · HEALTHIER TOMORROW</span></div>}
      <div className="visual-hero__flow" aria-hidden="true" />
    </section>
  );
}

export function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return <div className={`visual-section-heading ${align === 'center' ? 'visual-section-heading--center' : ''}`}>
    {eyebrow && <span className="visual-eyebrow">{eyebrow}</span>}
    <h2>{title}</h2>
    {description && <p>{description}</p>}
  </div>;
}

export function ImageCTA({ eyebrow = 'LET’S BUILD SOMETHING THAT MATTERS', title, description, image = '/images/hero-wtp-BGjLUC-Q.jpg', onAction, actionLabel = 'Discuss your project' }) {
  return <section className="visual-container visual-cta reveal-up">
    <ResponsiveImage src={image} alt="Water treatment infrastructure" loading="lazy" />
    <div className="visual-cta__shade" />
    <div className="visual-cta__content">
      <span className="visual-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <PageLink page="contact" onAction={onAction} className="visual-button">{actionLabel}<ArrowRight size={18} /></PageLink>
    </div>
    <div className="visual-cta__mark" aria-hidden="true"><Droplets /></div>
  </section>;
}

export function MotionPhoto({ src, alt, className = '', children, loading = 'lazy', fetchPriority = loading === 'eager' ? 'high' : 'auto', sizes }) {
  const container = useRef(null);
  const frame = useRef(null);
  useEffect(() => () => { if (frame.current) cancelAnimationFrame(frame.current); }, []);
  const move = event => {
    if (event.pointerType !== 'mouse' || navigator.connection?.saveData || !window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      container.current?.style.setProperty('--photo-x', `${x * -12}px`);
      container.current?.style.setProperty('--photo-y', `${y * -12}px`);
      frame.current = null;
    });
  };
  const reset = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    container.current?.style.setProperty('--photo-x', '0px');
    container.current?.style.setProperty('--photo-y', '0px');
  };
  return <div ref={container} className={`motion-photo ${className}`} onPointerMove={move} onPointerLeave={reset}>
    <ResponsiveImage src={src} alt={alt} loading={loading} fetchPriority={fetchPriority} sizes={sizes} className="motion-photo__image" />
    {children}
  </div>;
}

function PhotoDialog({ images, index, onIndexChange, onClose }) {
  const dialog = useRef(null);
  const current = images[index] || images[0];
  useEffect(() => {
    const node = dialog.current;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    if (!node.open) node.showModal();
    document.body.style.overflow = 'hidden';
    return () => { node.close(); document.body.style.overflow = overflow; previousFocus?.focus?.(); };
  }, []);
  const change = direction => onIndexChange?.((index + direction + images.length) % images.length);
  return <dialog ref={dialog} className="photo-viewer" aria-label="Image gallery" onCancel={event => { event.preventDefault(); onClose(); }} onKeyDown={event => {
    if (images.length > 1 && ['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); change(event.key === 'ArrowLeft' ? -1 : 1); }
  }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="photo-viewer__bar"><span>ORBIT / IN FOCUS <small>{String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</small></span><button type="button" aria-label="Close image gallery" onClick={onClose}><X size={23} /></button></div>
    <div className="photo-viewer__stage">
      <ResponsiveImage key={current.src} src={current.src} alt={current.alt} loading="eager" />
      {images.length > 1 && onIndexChange && <><button type="button" className="photo-viewer__prev" aria-label="Previous image" onClick={() => change(-1)}><ChevronLeft size={24} /></button><button type="button" className="photo-viewer__next" aria-label="Next image" onClick={() => change(1)}><ChevronRight size={24} /></button></>}
    </div>
    <div className="photo-viewer__caption"><span>{current.label || current.alt}</span>{images.length > 1 && <small>Use the arrows to explore</small>}</div>
  </dialog>;
}

export function ImageViewer({ images = [], index, onIndexChange, onClose }) {
  return Number.isInteger(index) && index >= 0 && images.length ? <PhotoDialog images={images} index={index} onIndexChange={onIndexChange} onClose={onClose} /> : null;
}
