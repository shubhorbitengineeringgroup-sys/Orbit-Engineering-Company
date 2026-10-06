import ResponsiveImage from './ResponsiveImage';
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Mail, MessageSquare, X } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

function QuoteDialog({ onClose }) {
  const dialog = useRef(null);
  const [prepared, setPrepared] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', organization: '', service: 'Water treatment', message: '' });
  useEffect(() => {
    const node = dialog.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    node.showModal();
    document.body.style.overflow = 'hidden';
    return () => { node.close(); document.body.style.overflow = previousOverflow; previousFocus?.focus?.(); };
  }, []);
  const message = ['Hello ' + siteConfig.company.name + ',', '', 'Name: ' + form.name, 'Organization: ' + (form.organization || 'Not specified'), 'Phone: ' + form.phone, 'Email: ' + (form.email || 'Not specified'), 'Interested in: ' + form.service, '', form.message || 'I would like a technical consultation and quote.'].join('\n');
  const change = event => setForm(value => ({ ...value, [event.target.name]: event.target.value }));
  return <dialog ref={dialog} className="orbit-quote" aria-labelledby="quote-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose(); } }}>
    <div className="orbit-quote__hero">
      <ResponsiveImage src="/images/scada-JO4jHDve.jpg" alt="" />
      <button type="button" onClick={onClose} aria-label="Close consultation form"><X size={20} /></button>
      <span className="visual-eyebrow">LET’S ENGINEER YOUR NEXT CHAPTER</span>
      <h2 id="quote-title">A better water solution<br />starts with a conversation.</h2>
    </div>
    <div className="orbit-quote__body">
      {prepared ? <div className="orbit-quote__review" aria-live="polite">
        <CheckCircle2 size={38} /><h3>Your enquiry is ready, {form.name}.</h3>
        <p>Choose WhatsApp or email to send these details to our engineering team. Your enquiry will be sent when you confirm in the selected app.</p>
        <a href={'https://wa.me/' + siteConfig.company.contact.whatsapp.replace(/\D/g, '') + '?text=' + encodeURIComponent(message)} target="_blank" rel="noopener noreferrer" className="visual-button"><MessageSquare size={18} />Send via WhatsApp</a>
        <a href={'mailto:' + siteConfig.company.contact.emails[0] + '?subject=' + encodeURIComponent('Project enquiry: ' + form.service) + '&body=' + encodeURIComponent(message)} className="visual-button visual-button--secondary"><Mail size={18} />Send by email</a>
        <button type="button" onClick={() => setPrepared(false)} className="orbit-quote__edit">Edit my details</button>
      </div> : <form onSubmit={event => { event.preventDefault(); setPrepared(true); }}>
        <p>Tell us a little about your project.</p>
        <div className="orbit-quote__fields">
          <label htmlFor="quote-name">Your name *<input id="quote-name" name="name" autoComplete="name" maxLength={120} value={form.name} onChange={change} required placeholder="Full name" /></label>
          <label htmlFor="quote-phone">Phone number *<input id="quote-phone" name="phone" type="tel" autoComplete="tel" maxLength={20} value={form.phone} onChange={change} required placeholder="Your contact number" /></label>
          <label htmlFor="quote-email">Email<input id="quote-email" name="email" type="email" autoComplete="email" maxLength={254} value={form.email} onChange={change} placeholder="you@company.com" /></label>
          <label htmlFor="quote-org">Organisation<input id="quote-org" name="organization" autoComplete="organization" maxLength={160} value={form.organization} onChange={change} placeholder="Company / authority" /></label>
        </div>
        <label htmlFor="quote-service">What can we help with?<select id="quote-service" name="service" value={form.service} onChange={change}>{['Water treatment', 'SCADA & automation', 'Pumping & pipelines', 'Metering & instrumentation', 'Solar water solutions', 'Operation & maintenance', 'DPR / tender / BOQ'].map(service => <option key={service}>{service}</option>)}</select></label>
        <label htmlFor="quote-message">Project details<textarea id="quote-message" name="message" rows="3" maxLength={1500} value={form.message} onChange={change} placeholder="Location, capacity and what you have in mind…" /></label>
        <button type="submit" className="visual-button">Review your enquiry<ArrowRight size={18} /></button>
        <small>You’ll choose WhatsApp or email on the next step to send it.</small>
      </form>}
    </div>
  </dialog>;
}

export default function ContactModal({ isOpen, onClose }) {
  return isOpen ? <QuoteDialog onClose={onClose} /> : null;
}
