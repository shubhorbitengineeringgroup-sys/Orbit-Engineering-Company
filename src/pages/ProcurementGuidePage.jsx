import React from 'react';
import { ArrowRight, ClipboardCheck } from 'lucide-react';
import PageLink from '../components/PageLink';
import { procurementGuide } from '../data/procurementGuide';
import '../styles/procurement-guide.css';

export default function ProcurementGuidePage({ onNavigate }) {
  const guide = procurementGuide;

  return (
    <article className="visual-page procurement-guide">
      <header className="procurement-guide__hero">
        <div className="visual-container">
          <nav className="procurement-guide__breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><PageLink page="home" onNavigate={onNavigate}>Home</PageLink></li>
              <li><PageLink page="solutions" onNavigate={onNavigate}>Solutions</PageLink></li>
              <li aria-current="page">Procurement guide</li>
            </ol>
          </nav>
          <div className="procurement-guide__hero-layout">
            <div>
              <span className="visual-eyebrow">Orbit Engineering · Bhopal</span>
              <h1>{guide.title}</h1>
              <p>{guide.intro}</p>
              <PageLink page="contact" onNavigate={onNavigate} className="visual-button">Discuss your project brief <ArrowRight size={17} aria-hidden="true" /></PageLink>
            </div>
            <div className="procurement-guide__brief" aria-label="Three procurement priorities">
              <ClipboardCheck size={30} strokeWidth={1.5} aria-hidden="true" />
              <span>A clear brief. A comparable proposal.</span>
              <ul>
                <li><span>01</span>Defined scope</li>
                <li><span>02</span>Written acceptance</li>
                <li><span>03</span>Lifecycle support</li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <div className="visual-container procurement-guide__layout">
        <aside className="procurement-guide__contents" aria-label="Guide contents">
          <p>In this guide</p>
          <nav aria-label="On this page">
            {guide.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
            <a href="#handover-checklist">Handover checklist</a>
          </nav>
        </aside>

        <div className="procurement-guide__body">
          {guide.sections.map((section, index) => (
            <section className="procurement-guide__section" key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`}>{section.title}</h2>
              {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              {index === 0 && (
                <div className="procurement-guide__table-wrap" role="region" aria-labelledby="procurement-comparison-caption" tabIndex={0}>
                  <table>
                    <caption id="procurement-comparison-caption">Compare proposals against your application</caption>
                    <thead><tr><th scope="col">Application</th><th scope="col">Requirements to share</th><th scope="col">Question to ask</th></tr></thead>
                    <tbody>{guide.comparison.map(row => <tr key={row.application}><th scope="row">{row.application}</th><td>{row.requirements}</td><td>{row.question}</td></tr>)}</tbody>
                  </table>
                </div>
              )}
            </section>
          ))}

          <section className="procurement-guide__handover" id="handover-checklist" aria-labelledby="handover-checklist-title">
            <h2 id="handover-checklist-title">Keep a complete handover file</h2>
            <ul>{guide.handoverChecklist.map(item => <li key={item}><ClipboardCheck size={17} aria-hidden="true" /><span>{item}</span></li>)}</ul>
          </section>
        </div>
      </div>

      <section className="procurement-guide__next" aria-labelledby="procurement-related-title">
        <div className="visual-container">
          <span className="visual-eyebrow">Turn the brief into a project scope</span>
          <h2 id="procurement-related-title">Explore the relevant services and equipment.</h2>
          <nav className="procurement-guide__related" aria-label="Related services and equipment">
            {guide.relatedLinks.map(link => <PageLink key={link.path} page={link.path} onNavigate={onNavigate}>{link.label}<ArrowRight size={16} aria-hidden="true" /></PageLink>)}
          </nav>
          <div className="procurement-guide__contact">
            <p>{guide.closing}</p>
            <PageLink page="contact" onNavigate={onNavigate} className="visual-button">Contact Orbit Engineering <ArrowRight size={17} aria-hidden="true" /></PageLink>
          </div>
        </div>
      </section>
    </article>
  );
}
