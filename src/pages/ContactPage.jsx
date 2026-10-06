import React, { useRef, useState } from 'react';
import { assetPath } from '../config/deployment';
import { ArrowDown, ArrowLeft, ArrowRight, Building2, Check, CheckCircle2, Clock, Droplets, ExternalLink, Gauge, Mail, MapPin, MessageSquare, Navigation, Phone, Settings2, Sun, Wrench } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { MotionPhoto, SectionHeading } from '../components/VisualSystem';
import '../styles/contact.css';

const SERVICE_OPTIONS = [
  { id: 'wtp', label: 'Water treatment', detail: 'WTP · STP · RO · ETP', icon: Droplets, value: 'Water Treatment Plant (WTP / STP / RO / ETP)' },
  { id: 'scada', label: 'Smart automation', detail: 'SCADA & PLC systems', icon: Settings2, value: 'SCADA & PLC Automation' },
  { id: 'jjm', label: 'Water schemes', detail: 'JJM & AMRUT telemetry', icon: Building2, value: 'JJM / AMRUT Telemetry Scheme' },
  { id: 'meters', label: 'Instrumentation', detail: 'Flow meters & analyzers', icon: Gauge, value: 'Flow Meters & Water Analyzers' },
  { id: 'amc', label: 'Care & maintenance', detail: 'Annual service contracts', icon: Wrench, value: 'Annual Maintenance Contract (AMC)' },
  { id: 'solar', label: 'Solar pumping', detail: 'Solar water systems', icon: Sun, value: 'Solar Pump System / PM KUSUM' },
];
const QUICK_PROMPTS = ['BOQ & tender documents', 'Site inspection', '10 MLD capacity', 'SCADA integration', 'Operation & maintenance'];

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', organization: '', serviceType: SERVICE_OPTIONS[0].value, message: '', selectedService: null });
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const formRef = useRef(null);
  const selectedService = SERVICE_OPTIONS.find(service => service.id === formData.selectedService);
  const contact = siteConfig.company.contact;
  const office = siteConfig.company.offices[0];
  const inquiryText = `Hello Orbit Engineering Solutions,\n\nName: ${formData.name || 'Client'}\nOrganization: ${formData.organization || 'N/A'}\nPhone: ${formData.phone || 'N/A'}\nEmail: ${formData.email || 'N/A'}\nInterest: ${formData.serviceType}\n\nProject: ${formData.message || 'I would like a quotation and technical review.'}`;
  const whatsappUrl = `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(inquiryText)}`;
  const emailUrl = `mailto:${contact.emails[0]}?subject=${encodeURIComponent(`Project inquiry: ${formData.serviceType}`)}&body=${encodeURIComponent(inquiryText)}`;

  const updateField = event => setFormData(current => ({ ...current, [event.target.name]: event.target.value }));
  const nextStep = event => {
    event.preventDefault();
    if (step === 1 && !selectedService) return;
    if (step === 2 && !formRef.current.reportValidity()) return;
    setStep(current => Math.min(current + 1, 3));
  };
  const handleSubmit = event => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="visual-page contact-page">
      <section className="contact-invitation">
        <div className="contact-invitation-rings" aria-hidden="true"><span /><span /><span /></div>
        <div className="visual-container contact-invitation-grid">
          <div className="contact-invitation-copy">
            <span className="visual-eyebrow">AN IDEA. A CONVERSATION. A BETTER TOMORROW.</span>
            <h1>Great projects<br />start with<br /><span>a conversation.</span></h1>
            <p>Bring your vision. We'll bring the engineering.</p>
            <div className="contact-invitation-actions">
              <a href="#project-inquiry" className="visual-button">Start your project <ArrowDown size={18} /></a>
              <a href={`tel:${contact.phonePrimary}`} className="contact-hero-call"><Phone size={18} /><span>Speak to our team<small>{contact.phonePrimary}</small></span></a>
            </div>
            <div className="contact-invitation-note"><span className="contact-note-line" /><MapPin size={15} /><span>Bhopal, India <small>Water expertise. Open conversations.</small></span></div>
          </div>
          <div className="contact-invitation-scene">
            <MotionPhoto src="/images/service_wtp.jpg" alt="Water treatment infrastructure beside a river at sunset" loading="eager" className="contact-invitation-landscape">
              <div className="contact-landscape-caption"><span>THE POSSIBILITIES ARE FLOWING.</span><strong>Your next chapter,<br />engineered together.</strong></div>
              <a href={contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="contact-invitation-chat" aria-label="Start a conversation on WhatsApp"><MessageSquare size={25} /><ArrowRight size={17} /></a>
            </MotionPhoto>
            <div className="contact-engineering-inset"><MotionPhoto src="/images/electro-mech-BjrTidAv.jpg" alt="Industrial gauges and precision water instrumentation"><div><Settings2 size={17} /><span>Ideas meet expertise.</span></div></MotionPhoto></div>
            <span className="contact-scene-coordinate" aria-hidden="true">BHOPAL, MADHYA PRADESH</span>
          </div>
        </div>
      </section>

      <section className="visual-section visual-container contact-project-section" id="project-inquiry">
        <div className="contact-project-heading reveal-up">
          <SectionHeading eyebrow="YOUR NEXT CHAPTER" title={<>A little detail. <span className="visual-title-accent">A clear direction.</span></>} description="Choose a service, share your details, and send your project brief directly to our team." />
        </div>
        <div className="contact-project-grid">
          <div className="contact-form-card reveal-up">
            {submitted ? (
              <div className="contact-ready" role="status" aria-live="polite">
                <span className="contact-ready-icon"><CheckCircle2 size={34} /></span>
                <span className="visual-eyebrow">ONE STEP TO CONNECT</span>
                <h2>Your project brief is ready.</h2>
                <p>Thanks, {formData.name}. Send your brief through WhatsApp or your email app to connect with Orbit.</p>
                <div className="contact-summary">
                  <span>{selectedService?.label}</span>
                  <strong>{formData.name}</strong>
                  <span>{formData.phone}{formData.organization ? ` · ${formData.organization}` : ''}</span>
                </div>
                <a className="visual-button contact-whatsapp-button" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageSquare size={18} /> Send via WhatsApp <ArrowRight size={17} /></a>
                <a className="visual-button visual-button--secondary" href={emailUrl}><Mail size={18} /> Send via email</a>
                <button type="button" className="contact-text-button" onClick={() => { setSubmitted(false); setStep(3); }}>Edit project brief</button>
              </div>
            ) : (
              <>
                <ol className="contact-progress" aria-label="Project inquiry steps">
                  {['Your service', 'Your details', 'Project brief'].map((label, index) => (
                    <li key={label} className={step >= index + 1 ? 'is-active' : ''} aria-current={step === index + 1 ? 'step' : undefined}>
                      <span>{step > index + 1 ? <Check size={14} /> : `0${index + 1}`}</span><p>{label}</p>
                    </li>
                  ))}
                </ol>
                <form ref={formRef} onSubmit={handleSubmit}>
                  <div className="contact-form-step" key={step}>
                    {step === 1 && (
                      <fieldset>
                        <legend>What can we help you with?</legend>
                        <p className="contact-field-hint">Select the solution closest to your project.</p>
                        <div className="contact-services">
                          {SERVICE_OPTIONS.map(service => (
                            <button type="button" key={service.id} aria-pressed={formData.selectedService === service.id} className={`contact-service-option ${formData.selectedService === service.id ? 'is-selected' : ''}`} onClick={() => setFormData(current => ({ ...current, selectedService: service.id, serviceType: service.value }))}>
                              <service.icon size={24} strokeWidth={1.5} /><span><strong>{service.label}</strong><small>{service.detail}</small></span>{formData.selectedService === service.id && <CheckCircle2 className="contact-service-check" size={16} />}
                            </button>
                          ))}
                        </div>
                      </fieldset>
                    )}
                    {step === 2 && (
                      <fieldset>
                        <legend>Nice to meet you.</legend>
                        <p className="contact-field-hint">Share the best way for our team to reach you.</p>
                        <div className="contact-fields">
                          <div><label htmlFor="inquiry-name">Full name <span>*</span></label><input id="inquiry-name" name="name" autoComplete="name" maxLength={120} required placeholder="Your name" value={formData.name} onChange={updateField} /></div>
                          <div><label htmlFor="inquiry-phone">Phone number <span>*</span></label><input id="inquiry-phone" name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={20} placeholder="+91" value={formData.phone} onChange={updateField} /></div>
                          <div><label htmlFor="inquiry-organization">Organization</label><input id="inquiry-organization" name="organization" autoComplete="organization" maxLength={160} placeholder="Company or authority" value={formData.organization} onChange={updateField} /></div>
                          <div><label htmlFor="inquiry-email">Email address</label><input id="inquiry-email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@company.com" value={formData.email} onChange={updateField} /></div>
                        </div>
                        <div className="contact-selected-service"><selectedService.icon size={21} /><div><small>YOUR SELECTED SERVICE</small><strong>{selectedService.label}</strong></div><button type="button" className="contact-text-button" onClick={() => setStep(1)}>Change</button></div>
                      </fieldset>
                    )}
                    {step === 3 && (
                      <fieldset>
                        <legend>Bring us into the picture.</legend>
                        <p className="contact-field-hint">Location, capacity, goals, or a challenge you're solving.</p>
                        <label className="contact-sr-only" htmlFor="inquiry-message">Project description</label>
                        <textarea id="inquiry-message" name="message" rows={5} maxLength={1500} placeholder="Tell us about your project…" value={formData.message} onChange={updateField} />
                        <div className="contact-message-meta"><span>A short brief is a great starting point.</span><span>{formData.message.length}/1500</span></div>
                        <div className="contact-quick-prompts">{QUICK_PROMPTS.map(prompt => <button type="button" key={prompt} onClick={() => setFormData(current => ({ ...current, message: `${current.message}${current.message ? ', ' : ''}${prompt}`.slice(0, 1500) }))}>+ {prompt}</button>)}</div>
                        <div className="contact-selected-service"><selectedService.icon size={21} /><div><small>PROJECT FOR {formData.name.toUpperCase()}</small><strong>{selectedService.label}</strong></div><span className="contact-review-label">Ready to review</span></div>
                      </fieldset>
                    )}
                  </div>
                  <div className="contact-form-actions">
                    {step > 1 && <button type="button" onClick={() => setStep(current => current - 1)} className="contact-back-button"><ArrowLeft size={17} /> Back</button>}
                    {step < 3 ? <button type="button" disabled={step === 1 && !selectedService} onClick={nextStep} className="visual-button">Continue <ArrowRight size={17} /></button> : <button type="submit" className="visual-button">Review project brief <ArrowRight size={17} /></button>}
                  </div>
                  <p className="contact-form-note">Your brief is sent when you choose WhatsApp or email in the next step.</p>
                </form>
              </>
            )}
          </div>
          <aside className="contact-side-panel reveal-up">
            <MotionPhoto className="contact-photo-card" src="/images/scada-JO4jHDve.jpg" alt="Industrial control room with process monitoring screens">
              <div className="contact-photo-caption visual-glass"><span><Settings2 size={20} /></span><div><strong>Ideas into infrastructure.</strong><p>Water. Automation. Engineering.</p></div></div>
            </MotionPhoto>
            <div className="contact-direct">
              <span className="visual-eyebrow">PREFER A DIRECT CONNECTION?</span>
              <a href={`tel:${contact.phonePrimary}`}><span className="contact-channel-icon"><Phone size={20} /></span><span><small>CALL OUR TEAM</small><strong>{contact.phonePrimary}</strong></span><ArrowRight size={18} /></a>
              <a href={`mailto:${contact.emails[0]}`}><span className="contact-channel-icon"><Mail size={20} /></span><span><small>DROP US A LINE</small><strong>{contact.emails[0]}</strong></span><ArrowRight size={18} /></a>
              <a href={contact.whatsappLink} target="_blank" rel="noopener noreferrer"><span className="contact-channel-icon"><MessageSquare size={20} /></span><span><small>LET'S CHAT</small><strong>Connect on WhatsApp</strong></span><ArrowRight size={18} /></a>
              <p className="contact-hours"><Clock size={16} /> {contact.hours}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="contact-location-section" aria-labelledby="contact-location-title">
        <div className="visual-container visual-section">
          <div className="contact-location-heading reveal-up">
            <div>
              <span className="visual-eyebrow">COME SAY HELLO</span>
              <h2 id="contact-location-title">Find your way <span>to Orbit.</span></h2>
            </div>
            <p>Let's put your next project on the map.<br />Meet our team in Bhopal.</p>
          </div>
          <article className="contact-location-card reveal-up">
            <div className="contact-location-copy">
              <div className="contact-location-brand"><img src={assetPath('/logo.png')} alt="" width="951" height="662" loading="lazy" decoding="async" /><span>ORBIT<small>ENGINEERING COMPANY</small></span></div>
              <div className="contact-location-marker"><span><MapPin size={26} strokeWidth={1.6} /></span><div><small>OUR OFFICE</small><strong>Bhopal, Madhya Pradesh</strong></div></div>
              <h3>A conversation.<br /><span>A new possibility.</span></h3>
              <address>{office.address}</address>
              <div className="contact-location-actions">
                <a href={office.mapsUrl} target="_blank" rel="noopener noreferrer" className="visual-button" aria-label="Get directions to Orbit Engineering's Bhopal office on Google Maps (opens in a new tab)"><Navigation size={18} />Get directions<ArrowRight size={17} /></a>
                <a href={`tel:${contact.phonePrimary.replace(/\s/g, '')}`} className="contact-location-call"><Phone size={17} /><span>Call our team<small>{contact.phonePrimary}</small></span></a>
              </div>
              <p className="contact-location-note">Call ahead to arrange your visit.</p>
              <div className="contact-location-art" aria-hidden="true"><span /><span /><span /><Droplets size={77} strokeWidth={.75} /></div>
            </div>
            <div className="contact-location-map">
              <div className="contact-location-map-bar"><span><MapPin size={16} />Your destination, found.</span><a href={office.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Open Orbit Engineering's office location in Google Maps (opens in a new tab)">Google Maps<ExternalLink size={15} /></a></div>
              <iframe title={`${siteConfig.company.name} office at ${office.address}`} src={office.mapsEmbedUrl} loading="lazy" referrerPolicy="no-referrer" allowFullScreen />
              <div className="contact-location-map-footer"><span>BHOPAL · INDIA</span><span>462043</span></div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
