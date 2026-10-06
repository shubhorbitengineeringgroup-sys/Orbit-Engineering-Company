import ResponsiveImage from './ResponsiveImage';
import React, { useEffect, useState } from 'react';
import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import PageLink from './PageLink';

export default function Footer({ onNavigate, onOpenQuote }) {
  const company = siteConfig.company;
  const [copyrightYear, setCopyrightYear] = useState(typeof __SITE_BUILD_YEAR__ === 'undefined' ? 2026 : __SITE_BUILD_YEAR__);
  useEffect(() => { setCopyrightYear(new Date().getFullYear()); }, []);
  return <footer className="orbit-footer">
    <div className="visual-container orbit-footer__top">
      <div className="orbit-footer__brand">
        <PageLink page="home" onNavigate={onNavigate} aria-label="Orbit Engineering home" className="orbit-footer__logo">
          <ResponsiveImage src="/logo.png" sizes="80px" alt="" width="951" height="662" loading="lazy" decoding="async" /><span>ORBIT<small>ENGINEERING COMPANY</small></span>
        </PageLink>
        <p>Engineering cleaner water and smarter infrastructure. From Bhopal, for a better tomorrow.</p>
        <p>Our child company: <a href={company.childCompanyUrl} target="_blank" rel="noopener noreferrer">{company.childCompanyName}<ArrowUpRight size={13} className="inline ml-1" /></a></p>
        <span className="orbit-footer__cert"><ShieldCheck size={16} /> ISO 9001 · 14001 · 45001</span>
      </div>
      <div>
        <h3>Explore Orbit</h3>
        <nav aria-label="Footer navigation">{[
          ['About us', 'about'], ['Our products', 'products'], ['Water solutions', 'solutions'], ['Our ecosystem', 'ecosystem'], ['Choosing an engineering partner', '/guides/choosing-water-treatment-automation-partner-bhopal'], ['Contact us', 'contact'],
        ].map(([label, page]) => <PageLink key={page} page={page} onNavigate={onNavigate}>{label}<ArrowUpRight size={13} /></PageLink>)}</nav>
      </div>
      <div className="orbit-footer__contact">
        <h3>Let’s talk</h3>
        <a href={'tel:' + company.contact.phonePrimary}><Phone size={15} />{company.contact.phonePrimary}</a>
        <a href={'tel:' + company.contact.phoneSecondary}><Phone size={15} />{company.contact.phoneSecondary}</a>
        <a href={'mailto:' + company.contact.emails[0]}><Mail size={15} />{company.contact.emails[0]}</a>
        <PageLink page="contact" onNavigate={onNavigate} onAction={onOpenQuote} className="orbit-footer__enquire">Start a conversation<ArrowUpRight size={15} /></PageLink>
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
    <div className="visual-container orbit-footer__bottom"><span>© {copyrightYear} {company.name}. All rights reserved.</span><a href="#main-content">Back to top<ArrowUp size={15} /></a></div>
  </footer>;
}
