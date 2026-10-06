import ResponsiveImage from '../components/ResponsiveImage';
import React from 'react';
import { ArrowRight, Phone } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { sitePath } from '../config/deployment';
import { PRODUCT_CATEGORIES } from '../data/products';
import { ServiceLinks, VisibleFAQs, navigateSearchLink } from '../components/SearchContent';
import '../styles/seo-content.css';

export function ServiceDetailPage({ service, onNavigate, onOpenQuote }) {
  if (!service) return null;
  const projects = service.relatedProjectIds.map(id => siteConfig.projects.find(project => project.id === id)).filter(Boolean);
  const categories = service.productCategoryIds.map(id => PRODUCT_CATEGORIES.find(category => category.id === id)).filter(Boolean);
  const phone = siteConfig.company.contact.phonePrimary;
  const phoneHref = `tel:${phone.replace(/\s/g, '')}`;
  const openEnquiry = event => {
    if (!onOpenQuote || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    onOpenQuote();
  };

  return (
    <article className="visual-page seo-detail-page">
      <header className="seo-detail-hero">
        <div className="visual-container">
          <nav className="seo-breadcrumbs" aria-label="Breadcrumb">
            <ol>
              <li><a href={sitePath('/')} onClick={event => navigateSearchLink(event, '/', onNavigate)}>Home</a></li>
              <li><a href={sitePath('/solutions')} onClick={event => navigateSearchLink(event, '/solutions', onNavigate)}>Solutions</a></li>
              <li aria-current="page">{service.shortTitle}</li>
            </ol>
          </nav>
          <div className="seo-detail-hero__grid">
            <div className="seo-detail-hero__copy">
              <span className="visual-eyebrow">Orbit Engineering · Bhopal</span>
              <h1>{service.title}</h1>
              <p>{service.intro}</p>
              <div className="seo-detail-actions">
                <a className="visual-button" href={sitePath('/contact')} onClick={openEnquiry}>Discuss your project <ArrowRight size={18} aria-hidden="true" /></a>
                <a className="seo-phone-link" href={phoneHref}><Phone size={17} aria-hidden="true" />{phone}</a>
              </div>
            </div>
            <div className="seo-detail-hero__photo">
              <ResponsiveImage src={service.image} alt={service.imageAlt} sizes="(min-width: 1024px) 560px, 100vw" loading="eager" fetchPriority="high" decoding="async" />
              <span>Water & industrial engineering</span>
            </div>
          </div>
        </div>
      </header>

      <div className="visual-container seo-detail-body">
        <aside className="seo-detail-contents" aria-label="On this page">
          <span>In this guide</span>
          <nav>
            {service.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
            {projects.length > 0 && <a href="#project-context">Published project examples</a>}
            <a href="#service-questions">Common questions</a>
          </nav>
          <a href={sitePath('/contact')} onClick={event => navigateSearchLink(event, '/contact', onNavigate)} className="seo-detail-contents__contact">Contact the Bhopal team <ArrowRight size={16} aria-hidden="true" /></a>
        </aside>

        <div className="seo-detail-main">
          {service.sections.map(section => (
            <section className="seo-detail-section" id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`}>{section.title}</h2>
              {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              {section.items && <ul>{section.items.map(item => <li key={item}>{item}</li>)}</ul>}
            </section>
          ))}

          {projects.length > 0 && (
            <section className="seo-detail-section" id="project-context" aria-labelledby="project-context-title">
              <span className="visual-eyebrow">From the Orbit portfolio</span>
              <h2 id="project-context-title">Published project examples</h2>
              <div className="seo-project-context">
                {projects.map(project => (
                  <article key={project.id}>
                    <h3>{project.name}</h3>
                    <p className="seo-project-context__location">{project.location}</p>
                    <p><strong>Client:</strong> {project.client}</p>
                    <p>{project.scope}</p>
                  </article>
                ))}
              </div>
              <a className="seo-inline-link" href={sitePath('/ecosystem')} onClick={event => navigateSearchLink(event, '/ecosystem', onNavigate)}>Explore the client & technology ecosystem <ArrowRight size={16} aria-hidden="true" /></a>
            </section>
          )}

          {categories.length > 0 && (
            <section className="seo-detail-section seo-related-equipment" aria-labelledby="related-equipment-title">
              <h2 id="related-equipment-title">Related equipment</h2>
              <p>Explore the relevant catalogue categories and include the application requirements in your enquiry.</p>
              <ul>{categories.map(category => <li key={category.id}><a href={sitePath(`/products/${category.id}`)} onClick={event => navigateSearchLink(event, `/products/${category.id}`, onNavigate)}>{category.name} <ArrowRight size={15} aria-hidden="true" /></a></li>)}</ul>
            </section>
          )}

          <div id="service-questions">
            <VisibleFAQs faqs={service.faqs} id={`${service.id}-faq`} />
          </div>
        </div>
      </div>

      <section className="seo-detail-next" aria-labelledby="seo-next-title">
        <div className="visual-container">
          <span className="visual-eyebrow">Plan the complete system</span>
          <h2 id="seo-next-title">Explore connected services.</h2>
          <ServiceLinks onNavigate={onNavigate} excludeId={service.id} compact />
          <div className="seo-detail-contact">
            <div>
              <h3>Bring your requirements to the Bhopal team.</h3>
              <p>Share your site location, equipment details, drawings and the work you need.</p>
            </div>
            <a className="visual-button" href={sitePath('/contact')} onClick={openEnquiry}>Start an enquiry <ArrowRight size={18} aria-hidden="true" /></a>
          </div>
        </div>
      </section>
    </article>
  );
}

export default ServiceDetailPage;
