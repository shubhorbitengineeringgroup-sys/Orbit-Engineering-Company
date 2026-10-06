import React from 'react';
import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function Footer({ onNavigate, onOpenQuote }) {
  const company = siteConfig.company;
  return <footer className="orbit-footer">
    <div className="visual-container orbit-footer__top">
      <div className="orbit-footer__brand">
        <button type="button" onClick={() => onNavigate?.('home')} aria-label="Orbit Engineering home" className="orbit-footer__logo">
          <img src="/logo.png" alt="" /><span>ORBIT<small>ENGINEERING COMPANY</small></span>
        </button>
        <p>Engineering cleaner water and smarter infrastructure. From Bhopal, for a better tomorrow.</p>
        <span className="orbit-footer__cert"><ShieldCheck size={16} /> ISO 9001 · 14001 · 45001</span>
      </div>
      <div>
        <h3>Explore Orbit</h3>
        <nav aria-label="Footer navigation">{[
          ['About us', 'about'], ['Our products', 'products'], ['Water solutions', 'solutions'], ['Our ecosystem', 'ecosystem'], ['Contact us', 'contact'],
        ].map(([label, page]) => <button key={page} type="button" onClick={() => onNavigate?.(page)}>{label}<ArrowUpRight size={13} /></button>)}</nav>
      </div>
      <div className="orbit-footer__contact">
        <h3>Let’s talk</h3>
        <a href={'tel:' + company.contact.phonePrimary}><Phone size={15} />{company.contact.phonePrimary}</a>
        <a href={'tel:' + company.contact.phoneSecondary}><Phone size={15} />{company.contact.phoneSecondary}</a>
        <a href={'mailto:' + company.contact.emails[0]}><Mail size={15} />{company.contact.emails[0]}</a>
        <button type="button" className="orbit-footer__enquire" onClick={onOpenQuote}>Start a conversation<ArrowUpRight size={15} /></button>
      </div>
      <div className="orbit-footer__visit">
        <h3>Find us in Bhopal</h3>
        <p><MapPin size={17} />{company.offices[0].address}</p>
        <span>Mon–Sat, 10 AM–7 PM IST</span>
        <a href={company.offices[0].mapsUrl} target="_blank" rel="noopener noreferrer">Get directions on Google Maps<ArrowUpRight size={14} /></a>
        <a href={company.contact.indiamart} target="_blank" rel="noopener noreferrer">Explore our IndiaMART store<ArrowUpRight size={14} /></a>
      </div>
    </div>
    <div className="visual-container orbit-footer__signature" aria-hidden="true">WATER. PEOPLE. PLANET.<span>↗</span></div>
    <div className="visual-container orbit-footer__bottom"><span>© {new Date().getFullYear()} {company.name}. All rights reserved.</span><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>Back to top<ArrowUp size={15} /></button></div>
  </footer>;
}
