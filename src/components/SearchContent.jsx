import React from 'react';
import { ArrowRight, ChevronDown, Cpu, Droplets, Gauge, MapPin, Network, Sun, Wrench } from 'lucide-react';
import { servicePages, searchPageContent } from '../data/seoContent';
import { ecosystemClients, ecosystemPartners } from '../data/ecosystem';
import { assetPath, sitePath } from '../config/deployment';
import ResponsiveImage from './ResponsiveImage';
import '../styles/seo-content.css';
import '../styles/ecosystem-context.css';

// Keep deployment-aware hrefs usable in static HTML, with optional SPA navigation.
export function navigateSearchLink(event, path, onNavigate) {
  if (!onNavigate || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  onNavigate(path);
}

export function ServiceLinks({ onNavigate, excludeId, compact = false }) {
  return (
    <nav className={`seo-service-links${compact ? ' seo-service-links--compact' : ''}`} aria-label="Engineering service guides">
      {servicePages.filter(service => service.id !== excludeId).map(service => (
        <a key={service.id} href={sitePath(service.path)} onClick={event => navigateSearchLink(event, service.path, onNavigate)}>
          <span>{service.shortTitle}</span>
          <ArrowRight size={17} aria-hidden="true" />
        </a>
      ))}
    </nav>
  );
}

export function VisibleFAQs({ faqs = [], id = 'service-faq', title = 'Common questions' }) {
  if (!faqs.length) return null;
  return (
    <section className="seo-faq" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      <div className="seo-faq__items">
        {faqs.map(faq => (
          <details key={faq.question}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

const ecosystemProjectVisuals = [
  { clientId: 'bmc', image: '/images/hero-wtp-BGjLUC-Q.jpg', alt: 'Circular water treatment clarifiers at sunrise', category: 'Municipal water', location: 'Idgah Hills, Bhopal', Icon: Droplets },
  { clientId: 'mp-jal-nigam', image: '/images/pipeline-3e9YAzse.jpg', alt: 'Water transmission pipeline extending through a landscape', category: 'Water networks', location: 'Madhya Pradesh', Icon: Network },
  { clientId: 'lupin', image: '/images/flow-meter-DSWy7kTd.jpg', alt: 'Stainless steel process piping with flow measurement instruments', category: 'Pharmaceutical', location: 'Mandideep', Icon: Droplets },
  { clientId: 'prism', image: '/images/electro-mech-BjrTidAv.jpg', alt: 'Industrial measuring instruments and process gauges', category: 'Industrial control', location: 'Satna', Icon: Gauge },
];

const ecosystemTechnologyVisuals = [
  { partnerId: 'siemens', label: 'PLC & SCADA', Icon: Cpu },
  { partnerId: 'prominent', label: 'Dosing & disinfection', Icon: Droplets },
  { partnerId: 'regada', label: 'Valve actuation', Icon: Wrench },
  { partnerId: 'nivelco', label: 'Level measurement', Icon: Gauge },
];

const serviceGuideIcons = [Droplets, Cpu, Gauge, Wrench, Wrench, Sun];

function EcosystemContext({ content, onNavigate }) {
  return (
    <section className="ecosystem-context" aria-labelledby="seo-ecosystem-title">
      <div className="visual-container">
        <div className="ecosystem-context__heading">
          <div>
            <span className="visual-eyebrow">{content.eyebrow}</span>
            <h2 id="seo-ecosystem-title">From water<br />to industry.</h2>
          </div>
          <div className="ecosystem-context__intro">
            <p>See the applications behind our client and technology ecosystem.</p>
            <details className="ecosystem-context__details">
              <summary>Explore the project context <ChevronDown size={16} aria-hidden="true" /></summary>
              <div>
                <p>{content.title}</p>
                {content.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </details>
          </div>
        </div>

        <div className="ecosystem-context__projects">
          {content.examples.map((example, index) => {
            const visual = ecosystemProjectVisuals[index];
            const client = ecosystemClients.find(item => item.id === visual.clientId);
            const Icon = visual.Icon;
            return (
              <article className="ecosystem-context__project" key={example.title}>
                <div className="ecosystem-context__photo-wrap">
                  <span className="ecosystem-context__photo-frame" aria-hidden="true" />
                  <div className="ecosystem-context__photo">
                    <ResponsiveImage src={visual.image} alt={visual.alt} loading="lazy" sizes="(max-width: 559px) calc(100vw - 48px), (max-width: 1099px) 44vw, 22vw" />
                    <span className="ecosystem-context__image-label">Engineering imagery</span>
                    <span className="ecosystem-context__project-icon" aria-hidden="true"><Icon size={22} strokeWidth={1.7} /></span>
                  </div>
                  <div className="ecosystem-context__logo-plate">
                    <img src={assetPath(client.logo)} alt={`${example.title} logo`} loading="lazy" width="92" height="58" />
                  </div>
                </div>
                <div className="ecosystem-context__project-copy">
                  <span className="ecosystem-context__category">{visual.category}</span>
                  <h3>{example.title}</h3>
                  <p>{example.text}</p>
                  <span className="ecosystem-context__location"><MapPin size={13} aria-hidden="true" />{visual.location}</span>
                </div>
              </article>
            );
          })}
        </div>

        <div className="ecosystem-context__technology">
          <div className="ecosystem-context__technology-heading">
            <span className="ecosystem-context__technology-symbol" aria-hidden="true"><Cpu size={26} strokeWidth={1.5} /></span>
            <div>
              <span className="visual-eyebrow">Technology in application</span>
              <h3>Measured. Controlled. Connected.</h3>
            </div>
          </div>
          <div className="ecosystem-context__technology-brands">
            {ecosystemTechnologyVisuals.map(({ partnerId, label, Icon }) => {
              const partner = ecosystemPartners.find(item => item.id === partnerId);
              return (
                <div className="ecosystem-context__technology-brand" key={partnerId}>
                  <div><img src={assetPath(partner.logo)} alt={partner.name} width="124" height="46" loading="lazy" /></div>
                  <span><Icon size={14} aria-hidden="true" />{label}</span>
                </div>
              );
            })}
          </div>
          <details className="ecosystem-context__details ecosystem-context__details--technology">
            <summary>How the technology connects <ChevronDown size={16} aria-hidden="true" /></summary>
            <div><p>{content.technologyNote}</p></div>
          </details>
        </div>

        <div className="ecosystem-context__guides-heading">
          <div><span className="visual-eyebrow">Explore the engineering</span><h3>A guide for every application.</h3></div>
          <span>Choose a service to see its scope <ArrowRight size={16} aria-hidden="true" /></span>
        </div>
        <nav className="ecosystem-context__guides" aria-label="Engineering service guides">
          {servicePages.map((service, index) => {
            const Icon = serviceGuideIcons[index];
            return (
              <a key={service.id} href={sitePath(service.path)} onClick={event => navigateSearchLink(event, service.path, onNavigate)}>
                <span className="ecosystem-context__guide-photo">
                  <ResponsiveImage src={service.image} alt="" loading="lazy" sizes="(max-width: 767px) 44vw, 110px" />
                  <span aria-hidden="true"><Icon size={21} strokeWidth={1.6} /></span>
                </span>
                <span className="ecosystem-context__guide-copy"><small>Service guide {String(index + 1).padStart(2, '0')}</small><strong>{service.shortTitle}</strong></span>
                <span className="ecosystem-context__guide-arrow" aria-hidden="true"><ArrowRight size={17} /></span>
              </a>
            );
          })}
        </nav>
        <VisibleFAQs faqs={content.faqs} id="seo-ecosystem-faq" />
      </div>
    </section>
  );
}

export function SearchContent({ page, onNavigate }) {
  const content = searchPageContent[page];
  if (!content) return null;
  if (page === 'ecosystem') return <EcosystemContext content={content} onNavigate={onNavigate} />;
  return (
    <section className="seo-overview" aria-labelledby={`seo-${page}-title`}>
      <div className="visual-container">
        <div className="seo-overview__heading">
          <div>
            <span className="visual-eyebrow">{content.eyebrow}</span>
            <h2 id={`seo-${page}-title`}>{content.title}</h2>
          </div>
          <div className="seo-overview__copy">
            {content.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            {content.hindiSummary && <p lang="hi" className="seo-hindi-summary">{content.hindiSummary}</p>}
          </div>
        </div>
        {content.examples && (
          <div className="seo-context-grid">
            {content.examples.map(example => (
              <article key={example.title}>
                <h3>{example.title}</h3>
                <p>{example.text}</p>
              </article>
            ))}
          </div>
        )}
        {content.technologyNote && <p className="seo-technology-note">{content.technologyNote}</p>}
        <ServiceLinks onNavigate={onNavigate} />
        {content.guideLink && (
          <a className="seo-inline-link" href={sitePath(content.guideLink.path)} onClick={event => navigateSearchLink(event, content.guideLink.path, onNavigate)}>
            {content.guideLink.label} <ArrowRight size={16} aria-hidden="true" />
          </a>
        )}
        <VisibleFAQs faqs={content.faqs} id={`seo-${page}-faq`} />
      </div>
    </section>
  );
}

export default SearchContent;
