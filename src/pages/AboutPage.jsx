import React, { useState } from 'react';
import { ArrowRight, Award, Building2, CheckCircle2, ChevronDown, Expand, Leaf, MapPin, Phone, ShieldCheck, Target, Users, Zap } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { SectionHeading, ImageCTA, MotionPhoto, ImageViewer } from '../components/VisualSystem';
import PageLink from '../components/PageLink';
import ResponsiveImage from '../components/ResponsiveImage';
import AboutStory from '../components/AboutStory';
import '../styles/about.css';

const IMAGES = {
  collaboration: '/images/design-v2/about-engineering.webp',
  field: '/images/network-LUJb9Wxw.jpg',
  treatment: '/images/hero-wtp-BGjLUC-Q.jpg',
  aerial: '/images/wtp_hero.jpg',
  pumps: '/images/pump-house-rehbpR99.jpg',
  automation: '/images/scada-JO4jHDve.jpg',
  pipeline: '/images/pipeline-3e9YAzse.jpg',
  instruments: '/images/electro-mech-BjrTidAv.jpg',
  storyWater: '/images/design-v2/about-story-water.webp',
  storyField: '/images/design-v2/about-story-field.webp',
  storyControl: '/images/design-v2/about-story-control.webp',
};

const COMMITMENTS = [
  { title: 'One accountable package', description: 'Intake, treatment, transmission, storage and automation, delivered through one coordinated engineering team.', image: IMAGES.aerial, alt: 'Aerial view of water treatment infrastructure' },
  { title: 'Design and build, together', description: 'Hydraulic modelling, structural design and site execution work together from the first drawing to the final trial.', image: IMAGES.pumps, alt: 'Industrial pumping equipment and pipework' },
  { title: 'Standards at every stage', description: 'Engineering guided by CPHEEO, BIS 10500, IS 456, IS 3370 and CPCB requirements.', image: IMAGES.treatment, alt: 'Circular water treatment basins at sunrise' },
  { title: 'Quality you can trace', description: 'Material certificates, weld inspection, concrete testing and hydrostatic checks support dependable infrastructure.', image: IMAGES.instruments, alt: 'Precision pressure gauges and flow instruments' },
  { title: 'Automation from day one', description: 'Instrumentation, PLC control and telemetry are planned alongside the civil and mechanical systems.', image: IMAGES.automation, alt: 'Water utility SCADA monitoring room' },
  { title: 'Commissioned with care', description: 'Full-load testing and performance stabilization help each system move confidently from construction to operation.', image: IMAGES.pumps, alt: 'Pumping station with blue motors and steel pipes' },
  { title: 'Support through the lifecycle', description: 'AMC support, field engineers and spare parts keep the focus on performance long after handover.', image: IMAGES.pipeline, alt: 'Transmission pipeline through an open landscape' },
];

const TABS = [
  { id: 'certifications', label: 'Certifications', icon: ShieldCheck },
  { id: 'departments', label: 'Our teams', icon: Users },
  { id: 'offices', label: 'Our office', icon: MapPin },
];
const DEPARTMENT_IMAGES = [IMAGES.automation, '/images/network-LUJb9Wxw.jpg', '/images/pump_house.jpg'];
const CERT_ICONS = [Award, Leaf, ShieldCheck];
const STORY_CHAPTERS = [
  { image: IMAGES.storyWater, title: 'Water infrastructure', caption: 'From a single source to an entire community.', alt: 'Illustrative aerial scene of turquoise water clarifiers in a landscaped treatment campus', illustrative: true },
  { image: IMAGES.storyField, title: 'Field engineering', caption: 'Good plans meet careful work on the ground.', alt: 'Illustrative scene of two engineers reviewing water infrastructure plans on a protected walkway', illustrative: true },
  { image: IMAGES.storyControl, title: 'Connected systems', caption: 'Bringing the whole water network into focus.', alt: 'Illustrative scene of engineers monitoring a water network in a modern control room', illustrative: true },
];
const ABOUT_GALLERY = [
  { src: IMAGES.collaboration, alt: 'Illustrative scene of engineers reviewing plans above a water treatment plant', label: 'Engineering collaboration · Illustrative scene' },
  { src: IMAGES.field, alt: 'Engineers installing a water pipeline in an excavated trench', label: 'Field engineering' },
  { src: IMAGES.aerial, alt: 'Aerial view of treatment buildings and water basins', label: 'Water infrastructure' },
  { src: IMAGES.pumps, alt: 'Blue water pumps and stainless steel piping', label: 'Pumping systems' },
  { src: IMAGES.automation, alt: 'A blue-lit water utility SCADA monitoring room', label: 'Connected water systems' },
  { src: IMAGES.instruments, alt: 'Precision pressure and flow instruments', label: 'Instrumentation and quality' },
  { src: IMAGES.pipeline, alt: 'Transmission pipeline through an open landscape', label: 'Water transmission' },
  { src: IMAGES.treatment, alt: 'Circular treatment clarifiers at sunrise', label: 'Water treatment' },
  ...STORY_CHAPTERS.map(chapter => ({ src: chapter.image, alt: chapter.alt, label: `${chapter.title} · Illustrative scene` })),
];

export default function AboutPage({ onNavigate, onOpenQuote }) {
  const [activeTab, setActiveTab] = useState('certifications');
  const [activeCommitment, setActiveCommitment] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(null);
  const openImage = (src) => setGalleryIndex(ABOUT_GALLERY.findIndex((image) => image.src === src));
  const company = siteConfig.company;
  const commitment = COMMITMENTS[activeCommitment];

  const handleTabKey = (event, index) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % TABS.length;
    if (event.key === 'ArrowLeft') next = (index + TABS.length - 1) % TABS.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = TABS.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setActiveTab(TABS[next].id);
    event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next].focus();
  };

  return (
    <div className="visual-page about-page">
      <section className="about-editorial" aria-labelledby="about-editorial-title">
        <div className="visual-container about-editorial__layout">
          <div className="about-editorial__copy">
            <span className="about-editorial__eyebrow"><span /> About Orbit <i /> Since {company.founded}</span>
            <h1 id="about-editorial-title">Better water<br />begins with<br /><span>better thinking.</span></h1>
            <p>Engineering is our craft. A better tomorrow is our purpose. We bring people, ideas and technology together to make water work for everyone.</p>
            <div className="about-editorial__actions">
              <PageLink page="contact" onNavigate={onNavigate} onAction={onOpenQuote} className="visual-button">Build with Orbit <ArrowRight size={18} /></PageLink>
              <a className="about-editorial__explore" href="#about-story">Discover our story <span>↓</span></a>
            </div>
            <dl className="about-editorial__facts">
              <div><dt>{company.experience}</dt><dd>Years of<br />engineering experience</dd></div>
              <div><dt>{company.projectsDelivered.split(' ')[0]}</dt><dd>Mega schemes<br />delivered</dd></div>
              <div><dt>₹200<span>Cr+</span></dt><dd>Infrastructure<br />portfolio</dd></div>
            </dl>
          </div>
          <div className="about-editorial__collage">
            <svg className="about-editorial__orbits" viewBox="0 0 700 700" aria-hidden="true"><ellipse cx="350" cy="350" rx="310" ry="270" /><ellipse cx="350" cy="350" rx="280" ry="325" /><circle cx="350" cy="25" r="5" /><circle cx="660" cy="350" r="4" /></svg>
            <figure className="about-editorial__portrait">
              <MotionPhoto src={IMAGES.collaboration} alt={ABOUT_GALLERY[0].alt} loading="eager" sizes="(max-width: 380px) 340px, (max-width: 560px) calc(100vw - 67px), (max-width: 800px) 530px, (max-width: 1100px) 460px, 620px">
                <button className="about-photo-open" onClick={() => openImage(IMAGES.collaboration)} aria-label="View engineering collaboration image"><span><Expand size={18} /></span></button>
              </MotionPhoto>
              <figcaption>Ideas into action.</figcaption>
            </figure>
            <figure className="about-editorial__inset">
              <MotionPhoto src={IMAGES.field} alt={ABOUT_GALLERY[1].alt} loading="eager" fetchPriority="auto" sizes="(max-width: 560px) 152px, (max-width: 800px) 220px, (max-width: 1100px) 195px, 230px">
                <button className="about-photo-open" onClick={() => openImage(IMAGES.field)} aria-label="View field engineering image"><span><Expand size={15} /></span></button>
              </MotionPhoto>
              <figcaption><span>01 / On the ground</span><strong>Built by people.<br />Made for people.</strong></figcaption>
            </figure>
            <span className="about-editorial__vertical">DESIGN · BUILD · CONNECT</span>
            <span className="about-editorial__caption">Engineering collaboration · Illustrative scene</span>
          </div>
        </div>
      </section>

      <AboutStory company={company} chapters={STORY_CHAPTERS} onOpenImage={openImage} onNavigate={onNavigate} />

      <section className="about-purpose visual-section" aria-label="Our mission and vision">
        <div className="visual-container">
          <SectionHeading eyebrow="Our purpose" title={<>Cleaner water.<br /><span className="visual-title-accent">A shared future.</span></>} description="Every project starts with the same belief: good engineering should make life better." />
          <div className="about-purpose__grid">
            <article className="about-purpose-card reveal-up">
              <ResponsiveImage src={IMAGES.pipeline} alt="Water transmission pipeline stretching across a landscape" loading="lazy" sizes="(max-width: 560px) 600px, 660px" />
              <div className="about-purpose-card__copy">
                <span className="about-purpose-card__label"><Target size={18} /> Our mission</span>
                <h3>Safe water.<br />Within reach.</h3>
                <p>Design, build and maintain resilient water systems that connect communities and industries to reliable, safe water.</p>
              </div>
            </article>
            <article className="about-purpose-card reveal-up" style={{ transitionDelay: '100ms' }}>
              <ResponsiveImage src={IMAGES.automation} alt="Engineers overseeing connected water systems in a SCADA room" loading="lazy" sizes="(max-width: 560px) 600px, 660px" />
              <div className="about-purpose-card__copy">
                <span className="about-purpose-card__label"><Zap size={18} /> Our vision</span>
                <h3>Smarter systems.<br />Lasting impact.</h3>
                <p>Advance sustainable water infrastructure through intelligent automation, responsible resource use and lifelong asset care.</p>
              </div>
            </article>
          </div>
          <div className="about-values reveal-up">
            {[['Accountability', Building2], ['Engineering rigor', ShieldCheck], ['Innovation', Zap], ['Sustainability', Leaf]].map(([label, Icon]) => (
              <div key={label}><Icon size={21} /><span>{label}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="visual-section visual-container" id="leadership-team" aria-label="Executive leadership">
        <SectionHeading eyebrow="The people behind Orbit" title={<>Experience that leads.<br /><span className="visual-title-accent">A team that delivers.</span></>} description="Our co-founders bring project leadership and technical expertise to a common purpose." />
        <div className="about-leadership">
          {company.leadership.map((leader, index) => (
            <article className="about-leader reveal-up" key={leader.name} style={{ transitionDelay: `${index * 100}ms` }}>
              <div className="about-leader__portrait"><ResponsiveImage src={leader.image} alt={leader.name} loading="lazy" /></div>
              <div className="about-leader__copy">
                <span className="visual-eyebrow">{leader.role}</span>
                <h3>{leader.name}</h3>
                <p>{leader.focus}</p>
                <span className="about-leader__experience"><Award size={17} />{leader.experience}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-credentials visual-section" aria-label="Company credentials and facilities">
        <div className="visual-container">
          <div className="about-credentials__heading">
            <SectionHeading eyebrow="Built on strong foundations" title={<>People. Processes.<br /><span className="visual-title-accent">Proven standards.</span></>} />
            <div className="about-tabs" role="tablist" aria-label="Explore Orbit">
              {TABS.map((tab, index) => {
                const Icon = tab.icon;
                return <button key={tab.id} id={`about-tab-${tab.id}`} role="tab" aria-selected={activeTab === tab.id} aria-controls={`about-panel-${tab.id}`} tabIndex={activeTab === tab.id ? 0 : -1} onClick={() => setActiveTab(tab.id)} onKeyDown={(event) => handleTabKey(event, index)}><Icon size={17} />{tab.label}</button>;
              })}
            </div>
          </div>
          <div className="about-tab-panel" id={`about-panel-${activeTab}`} role="tabpanel" aria-labelledby={`about-tab-${activeTab}`} tabIndex={0} key={activeTab}>
            {activeTab === 'certifications' && <div className="about-card-grid">
              {company.certifications.map((cert, index) => {
                const Icon = CERT_ICONS[index] || ShieldCheck;
                return <article className="about-cert" key={cert.code}>
                  <span className="about-icon"><Icon size={25} /></span>
                  <span className="about-cert__number">0{index + 1}</span>
                  <h3>{cert.code}</h3><h4>{cert.title}</h4><p>{cert.desc}</p>
                  <span className="about-cert__status"><CheckCircle2 size={16} /> Certified standards</span>
                </article>;
              })}
            </div>}
            {activeTab === 'departments' && <div className="about-card-grid">
              {company.departments.map((department, index) => <article className="about-department" key={department.name}>
                <div className="about-department__image"><ResponsiveImage src={DEPARTMENT_IMAGES[index]} alt={department.name} loading="lazy" sizes="(max-width: 560px) 520px, (max-width: 800px) 440px, 430px" /><span className="visual-glass"><Users size={15} /> {department.count}</span></div>
                <div className="about-department__copy"><h3>{department.name}</h3><p>{department.desc}</p></div>
              </article>)}
            </div>}
            {activeTab === 'offices' && <div className="about-card-grid" style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
              {company.offices.map((office) => <article className="about-office" key={office.name}>
                <span className="about-icon"><MapPin size={25} /></span><span className="visual-eyebrow">{office.type}</span><h3>{office.name}</h3><address>{office.address}</address><p>{office.role}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 24px' }}>
                  <a className="about-text-link" href={`tel:${office.phone.replace(/\s/g, '')}`}><Phone size={17} /> {office.phone}</a>
                  <a className="about-text-link" href={office.mapsUrl} target="_blank" rel="noopener noreferrer">Get directions <ArrowRight size={17} /></a>
                </div>
              </article>)}
            </div>}
          </div>
        </div>
      </section>

      <section className="visual-section visual-container about-commitments" aria-label="Our engineering commitments">
        <div className="about-commitments__visual reveal-right">
          <ResponsiveImage key={commitment.image} src={commitment.image} alt={commitment.alt} loading="lazy" />
          <button className="about-commitments__zoom" onClick={() => openImage(commitment.image)} aria-label="View current engineering image"><Expand size={19} /></button><div className="about-commitments__caption"><span>Our promise to every project</span><strong>Designed for trust.<br />Built to last.</strong></div>
          <span className="about-commitments__seal visual-glass"><ShieldCheck size={24} /><span>Asset integrity<br /><strong>From day one</strong></span></span>
        </div>
        <div className="about-commitments__copy reveal-left">
          <SectionHeading eyebrow="The Orbit commitment" title={<>Seven commitments.<br /><span className="visual-title-accent">One dependable partner.</span></>} />
          <div className="about-accordion">
            {COMMITMENTS.map((item, index) => <div className={`about-accordion__item ${activeCommitment === index ? 'is-active' : ''}`} key={item.title}>
              <h3><button id={`about-commitment-${index}`} onClick={() => setActiveCommitment(index)} aria-expanded={activeCommitment === index} aria-controls={`about-commitment-detail-${index}`}><span className="about-accordion__number">0{index + 1}</span><span>{item.title}</span><ChevronDown size={18} /></button></h3>
              <div id={`about-commitment-detail-${index}`} role="region" aria-labelledby={`about-commitment-${index}`} hidden={activeCommitment !== index}><p>{item.description}</p></div>
            </div>)}
          </div>
        </div>
      </section>

      <ImageViewer images={ABOUT_GALLERY} index={galleryIndex} onIndexChange={setGalleryIndex} onClose={() => setGalleryIndex(null)} />

      <ImageCTA eyebrow="Let's build what comes next" title="Your water vision. Our engineering." description="Bring us your challenge. Together, we can turn it into infrastructure that makes a difference." image={IMAGES.pumps} onAction={onOpenQuote} actionLabel="Talk to our team" />
    </div>
  );
}
