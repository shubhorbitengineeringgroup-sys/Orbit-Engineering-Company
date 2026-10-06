import React, { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, Cpu, Droplets, ExternalLink, Globe2, Info, Landmark, Maximize2, Search, Waves, X } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { ecosystemClients, ecosystemPartners, clientGroups, partnerGroups, industryStories } from '../data/ecosystem';
import { ImageViewer, MotionPhoto, SectionHeading } from '../components/VisualSystem';
import PageLink from '../components/PageLink';
import ResponsiveImage, { responsiveImageProps } from '../components/ResponsiveImage';
import '../styles/ecosystem.css';
import '../styles/ecosystem-interactions.css';

const COMMUNITY_IMAGE = '/images/design-v2/ecosystem-riverfront.webp';
const websiteLinkProps = entry => ({ href: entry.website, target: '_blank', rel: 'noopener noreferrer', 'aria-label': `Visit ${entry.name} official website (opens in a new tab)` });

function EcosystemProfile({ entry, onClose }) {
  const dialog = useRef(null);
  const isPartner = Boolean(entry.category);
  useEffect(() => {
    const node = dialog.current;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    node.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      node.close();
      document.body.style.overflow = overflow;
      previousFocus?.focus?.();
    };
  }, []);
  return <dialog ref={dialog} className="ecosystem-profile" aria-labelledby="ecosystem-profile-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="ecosystem-profile-scene">
      <ResponsiveImage src={isPartner ? entry.image : entry.group === 'Private & corporate' ? '/images/pump-house-rehbpR99.jpg' : '/images/intake-well-BztrG-Xc.jpg'} alt="" loading="eager" />
      <span className="visual-eyebrow">{isPartner ? 'TECHNOLOGY & MANUFACTURING PARTNER' : 'OUR CLIENT ECOSYSTEM'}</span>
      <button type="button" aria-label="Close ecosystem profile" onClick={onClose}><X size={20} /></button>
      <div className="ecosystem-profile-logo"><ResponsiveImage src={entry.logo} alt={`${entry.name} logo`} /></div>
    </div>
    <div className="ecosystem-profile-body">
      <span className="ecosystem-profile-group">{entry.group}</span>
      <h2 id="ecosystem-profile-title">{entry.name}</h2>
      <p className="ecosystem-profile-sector">{entry.category || entry.sector}</p>
      {isPartner && <p className="ecosystem-profile-origin"><Globe2 size={15} /> {entry.origin}</p>}
      <div className="ecosystem-profile-scope"><span><Droplets size={17} /> {isPartner ? 'Technology capabilities' : 'Engineering scope'}</span><p>{entry.scope}</p></div>
      <div className="ecosystem-profile-actions">{entry.website && <a {...websiteLinkProps(entry)} className="visual-button">Visit official website <ExternalLink size={17} /></a>}<button type="button" onClick={onClose} className="visual-button visual-button--secondary">Back to ecosystem <ArrowRight size={17} /></button></div>
    </div>
  </dialog>;
}

function FilterBar({ groups, selected, onSelect, entries, allLabel }) {
  return <div className="ecosystem-filters" role="group" aria-label={allLabel}>
    {groups.map((group, index) => <button key={group} type="button" aria-pressed={selected === group} onClick={() => onSelect(group)}>{group}<span>{index === 0 ? entries.length : entries.filter(entry => entry.group === group).length}</span></button>)}
  </div>;
}

function ClientTile({ entry, onOpen, index }) {
  const Tile = entry.website ? 'a' : 'button';
  const surface = useRef(null);
  const frame = useRef(null);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const move = event => {
    if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      surface.current?.style.setProperty('--ripple-x', `${x}px`);
      surface.current?.style.setProperty('--ripple-y', `${y}px`);
    });
  };
  return <div className="ecosystem-client-tile reveal-up" data-ecosystem-id={entry.id} style={{ '--tile-delay': `${index % 4 * 55}ms` }}>
    <Tile ref={surface} className="ecosystem-card-link" {...(entry.website ? websiteLinkProps(entry) : { type: 'button', 'aria-label': `View ${entry.name} engineering scope`, onClick: () => onOpen(entry) })} onPointerMove={move} onPointerLeave={() => cancelAnimationFrame(frame.current)}>
      <span className="ecosystem-client-emblem"><ResponsiveImage src={entry.logo} alt="" loading="lazy" /></span>
      <span className="ecosystem-client-name"><small>{entry.sector}</small><strong>{entry.name}</strong></span>
      {entry.website ? <ExternalLink className="ecosystem-client-chevron" size={16} aria-hidden="true" /> : <Info className="ecosystem-client-chevron" size={16} aria-hidden="true" />}
      <span className="ecosystem-client-ripple" aria-hidden="true" />
      <svg className="ecosystem-client-waterline" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true"><path d="M0 8Q35 8 65 5T125 5T185 5T245 5T305 5" pathLength="1" /></svg>
    </Tile>
    {entry.website && <button type="button" className="ecosystem-card-details" aria-label={`View ${entry.name} engineering scope`} title="View engineering scope" onClick={() => onOpen(entry)}><Info size={17} /></button>}
  </div>;
}

function PartnerTile({ entry, onOpen, onPreview, onLeave, active, index }) {
  const Tile = entry.website ? 'a' : 'button';
  return <div className="ecosystem-partner-tile reveal-up" data-ecosystem-id={entry.id} style={{ '--tile-delay': `${index % 3 * 70}ms` }}>
    <Tile className={`ecosystem-card-link ${active ? 'is-active' : ''}`} {...(entry.website ? websiteLinkProps(entry) : { type: 'button', 'aria-label': `View ${entry.name} technology capabilities`, onClick: () => { onPreview(entry.id, true); onOpen(entry); } })} onPointerEnter={event => { if (event.pointerType === 'mouse') onPreview(entry.id); }} onPointerLeave={onLeave} onFocus={() => onPreview(entry.id, true)}>
      <span className="ecosystem-partner-logo-plate"><ResponsiveImage src={entry.logo} alt="" loading="lazy" /></span>
      <span className="ecosystem-partner-module-copy"><small>{entry.category}</small><strong>{entry.name}</strong><span>{entry.origin}</span></span>
      <span className="ecosystem-partner-node" aria-hidden="true">{entry.website ? <ExternalLink size={13} /> : <Info size={14} />}</span>
      <span className="ecosystem-partner-connection" aria-hidden="true" />
    </Tile>
    {entry.website && <button type="button" className="ecosystem-card-details" aria-label={`View ${entry.name} technology capabilities`} title="View technology capabilities" onFocus={() => onPreview(entry.id, true)} onClick={() => { onPreview(entry.id, true); onOpen(entry); }}><Info size={17} /></button>}
  </div>;
}

function PartnerPreview({ entry, onOpen }) {
  const Brand = entry?.website ? 'a' : 'div';
  const stage = useRef(null);
  const companionImage = entry?.group === 'Automation & data' ? '/images/pump-house-rehbpR99.jpg'
    : entry?.group === 'Water & mechanical' ? '/images/service_wtp.jpg'
      : entry?.image === '/images/flow-meter-DSWy7kTd.jpg' ? '/images/electro-mech-BjrTidAv.jpg' : '/images/flow-meter-DSWy7kTd.jpg';
  const [scene, setScene] = useState({ current: entry?.image, previous: null });
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setInView(true); return; }
    const observer = new IntersectionObserver(([item]) => {
      stage.current?.classList.toggle('is-in-view', item.isIntersecting);
      if (item.isIntersecting) setInView(true);
    }, { threshold: .1 });
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!entry?.image || !inView || scene.current === entry.image) return;
    if (navigator.connection?.saveData || ['slow-2g', '2g'].includes(navigator.connection?.effectiveType) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setScene({ current: entry.image, previous: null });
      return;
    }
    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (!cancelled) setScene(current => current.current === entry.image ? current : { current: entry.image, previous: current.current });
    };
    const responsive = responsiveImageProps(entry.image);
    if (responsive.sizes) image.sizes = responsive.sizes;
    if (responsive.srcSet) image.srcset = responsive.srcSet;
    image.src = responsive.src;
    return () => { cancelled = true; };
  }, [entry?.image, inView]);
  return <div className="ecosystem-technology-collage">
    <div className="ecosystem-technology-orbits" aria-hidden="true"><span /><span /><i /></div>
    <div ref={stage} className="ecosystem-technology-stage">
    {entry ? <>
      {scene.previous && <div className="ecosystem-technology-photo ecosystem-technology-photo--previous" aria-hidden="true"><ResponsiveImage src={scene.previous} alt="" /></div>}
      <MotionPhoto key={scene.current} src={scene.current} alt={`${entry.category} — related engineering imagery`} className="ecosystem-technology-photo" />
      <div className="ecosystem-technology-shade" aria-hidden="true" />
      <div className="ecosystem-technology-topline"><span><Cpu size={14} /> TECHNOLOGY IN FOCUS</span><span className="ecosystem-technology-signal" aria-hidden="true"><i /><i /><i /></span></div>
      <Brand key={`${entry.id}-brand`} className="ecosystem-technology-brand" {...(entry.website ? websiteLinkProps(entry) : {})}><ResponsiveImage src={entry.logo} alt={`${entry.name} logo`} loading="lazy" /></Brand>
      <div key={`${entry.id}-copy`} className="ecosystem-technology-content">
        <span className="ecosystem-technology-origin"><Globe2 size={14} /> {entry.origin}</span>
        <h3>{entry.category}</h3><p>{entry.name}</p>
        <div className="ecosystem-technology-actions">{entry.website && <a {...websiteLinkProps(entry)}>Visit {entry.name} <ExternalLink size={16} /></a>}<button type="button" onClick={() => onOpen(entry)}>Capabilities <Info size={16} /></button></div>
      </div>
      <svg key={`${entry.id}-trace`} className="ecosystem-technology-circuit" viewBox="0 0 480 620" preserveAspectRatio="none" aria-hidden="true"><path d="M0 180H24L50 206V500L80 530H200" /><path d="M480 280H449L428 301V577H255" /><circle cx="200" cy="530" r="3" /><circle cx="255" cy="577" r="3" /></svg>
      <span className="ecosystem-technology-image-note">Engineering imagery</span>
    </> : <div className="ecosystem-technology-idle"><Cpu size={38} /><h3>A connected world<br />of technology.</h3><p>Adjust your search to explore our partners.</p></div>}
    </div>
    {entry && <>
      <div className="ecosystem-technology-inset" aria-hidden="true"><ResponsiveImage src={companionImage} alt="" loading="lazy" sizes="(max-width: 700px) 150px, 240px" /><span><Droplets size={13} /> Connected in the field</span></div>
      <span className="ecosystem-technology-float"><span><Cpu size={19} /></span><span><strong>From field to control.</strong><small>Expertise working together</small></span></span>
    </>}
  </div>;
}

export default function EcosystemPage({ onOpenQuote }) {
  const [clientGroup, setClientGroup] = useState(clientGroups[0]);
  const [partnerGroup, setPartnerGroup] = useState(partnerGroups[0]);
  const [clientSearch, setClientSearch] = useState('');
  const [partnerSearch, setPartnerSearch] = useState('');
  const [profile, setProfile] = useState(null);
  const [activeIndustry, setActiveIndustry] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(null);
  const [previewPartnerId, setPreviewPartnerId] = useState(ecosystemPartners[0].id);
  const previewTimer = useRef(null);
  useEffect(() => () => clearTimeout(previewTimer.current), []);
  const cancelPreview = () => clearTimeout(previewTimer.current);
  const previewTechnology = (id, immediate = false) => {
    cancelPreview();
    if (immediate) setPreviewPartnerId(id);
    else previewTimer.current = setTimeout(() => setPreviewPartnerId(id), 100);
  };
  const matches = (entry, query) => `${entry.name} ${entry.sector || entry.category} ${entry.scope} ${entry.origin || ''}`.toLowerCase().includes(query.trim().toLowerCase());
  const visibleClients = ecosystemClients.filter(client => (clientGroup === clientGroups[0] || client.group === clientGroup) && matches(client, clientSearch));
  const visiblePartners = ecosystemPartners.filter(partner => (partnerGroup === partnerGroups[0] || partner.group === partnerGroup) && matches(partner, partnerSearch));
  const currentIndustry = industryStories[activeIndustry];
  const currentClient = ecosystemClients.find(client => client.id === currentIndustry.clientId);
  const previewPartner = visiblePartners.find(entry => entry.id === previewPartnerId) || visiblePartners[0];
  const galleryImages = industryStories.map(story => ({ src: story.image, alt: story.alt, label: `${story.domain} / Engineering imagery` }));
  const industryKeys = event => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? industryStories.length - 1 : (activeIndustry + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1) + industryStories.length) % industryStories.length;
    setActiveIndustry(next);
    document.getElementById(`industry-tab-${next}`)?.focus();
  };

  return (
    <div className="visual-page ecosystem-page">
      <section className="ecosystem-landscape-hero">
        <MotionPhoto src={COMMUNITY_IMAGE} alt="An envisioned contemporary Indian green riverfront with clean water infrastructure integrated into the landscape" loading="eager" className="ecosystem-hero-landscape" />
        <div className="ecosystem-hero-light" aria-hidden="true" />
        <div className="visual-container ecosystem-hero-content">
          <div className="ecosystem-hero-panel">
            <span className="visual-eyebrow">CLIENTS & TECHNOLOGY PARTNERS</span>
            <h1>Shared ambition.<br /><span>Lasting impact.</span></h1>
            <p>The people, organisations and technology<br />{' '}connecting water to a better tomorrow.</p>
            <div><a href="#our-ecosystem" className="visual-button">Meet our clients <ArrowDown size={17} /></a><a href="#technology-partners" className="ecosystem-hero-link">Technology partners <ArrowRight size={18} /></a></div>
          </div>
          <div className="ecosystem-hero-aside"><span>COMMUNITIES<br />CONNECTED<br />BY WATER.</span><div><Waves size={24} /><small>A vision for<br />a better tomorrow.</small></div></div>
        </div>
        <svg className="ecosystem-hero-flow" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path d="M-40 95C280 -40 530 190 850 75S1200 -10 1490 80" /></svg>
      </section>

      <nav className="ecosystem-pathways" aria-label="Explore our ecosystem"><div className="visual-container">
        <span>CONNECTED BY ENGINEERING</span>
        <a href="#our-ecosystem"><span className="ecosystem-pathway-icon"><Landmark size={23} /></span><span><strong>Our clients</strong><small>22 organisations · Shared progress</small></span><ArrowDown size={18} /></a>
        <a href="#technology-partners"><span className="ecosystem-pathway-icon"><Cpu size={23} /></span><span><strong>Technology partners</strong><small>17 brands · Connected expertise</small></span><ArrowDown size={18} /></a>
      </div></nav>

      <section className="visual-section visual-container ecosystem-public" id="our-ecosystem" aria-labelledby="ecosystem-clients-title">
        <div className="ecosystem-heading-row"><SectionHeading eyebrow="22 ORGANISATIONS · ONE SHARED COMMITMENT" title={<><span id="ecosystem-clients-title">Our clients.<br /><span className="visual-title-accent">Progress, together.</span></span></>} description="Government, infrastructure and industry. Meet the organisations we deliver water and automation projects for." /><span className="ecosystem-section-index" aria-hidden="true">01 / CLIENTS</span></div>
        <div className="ecosystem-directory-tools" id="ecosystem-client-tools">
          <FilterBar groups={clientGroups} selected={clientGroup} onSelect={setClientGroup} entries={ecosystemClients} allLabel="Filter clients by sector" />
          <label className="ecosystem-search"><Search size={17} /><span className="ecosystem-sr-only">Search clients by name, sector or scope</span><input type="search" value={clientSearch} onChange={event => setClientSearch(event.target.value)} placeholder="Find a client or scope" />{clientSearch && <button type="button" onClick={() => setClientSearch('')} aria-label="Clear client search"><X size={15} /></button>}</label>
        </div>
        <div className="ecosystem-directory-status"><p aria-live="polite">Showing <strong>{visibleClients.length}</strong> of {ecosystemClients.length} clients</p><span>Logo: official website · <Info size={13} /> Project scope</span></div>
        <div className="ecosystem-client-directory">
          {clientGroup === clientGroups[0] && !clientSearch.trim() && <div className="ecosystem-directory-feature reveal-up">
            <MotionPhoto src="/images/intake-well-BztrG-Xc.jpg" alt="Intake water tower and bridge across a calm reservoir" className="ecosystem-directory-source"><div className="ecosystem-photo-label"><span className="visual-eyebrow">FROM SOURCE TO COMMUNITY</span><h3>Every connection<br />starts somewhere.</h3></div></MotionPhoto>
            <MotionPhoto src="/images/service_wtp.jpg" alt="Circular water treatment tanks beside a green landscape" className="ecosystem-directory-inset" sizes="(max-width: 700px) 260px, 300px"><span><Droplets size={15} /> Water, thoughtfully engineered.</span></MotionPhoto>
          </div>}
          {visibleClients.map((client, index) => <ClientTile key={client.id} entry={client} index={index} onOpen={setProfile} />)}
        </div>
        {!visibleClients.length && <div className="ecosystem-empty"><Search size={26} /><h3>No matching clients</h3><p>Try an organisation name, a sector or an engineering scope.</p><button type="button" onClick={() => { setClientSearch(''); setClientGroup(clientGroups[0]); }}>Show all 22 clients <ArrowRight size={16} /></button></div>}
      </section>

      <section className="ecosystem-industry-section">
        <div className="visual-container visual-section">
          <div className="ecosystem-heading-row"><SectionHeading eyebrow="INDUSTRY, IN FOCUS" title={<>Different challenges.<br /><span className="visual-title-accent">Shared possibilities.</span></>} description="Select an industry and explore where water, precision and automation come together." /><span className="ecosystem-section-index" aria-hidden="true">02 / INDUSTRY</span></div>
          <div className="ecosystem-industrial-explorer reveal-up">
            <div className="ecosystem-industry-selector" role="tablist" aria-label="Industrial clients" aria-orientation="vertical" onKeyDown={industryKeys}>
              {industryStories.map((story, index) => {
                const client = ecosystemClients.find(entry => entry.id === story.clientId);
                return <button key={story.clientId} type="button" role="tab" id={`industry-tab-${index}`} aria-controls="industry-story-panel" aria-selected={activeIndustry === index} tabIndex={activeIndustry === index ? 0 : -1} className={`ecosystem-industry-tab ${activeIndustry === index ? 'is-selected' : ''}`} onClick={() => setActiveIndustry(index)}><span>{`0${index + 1}`}</span><span><small>{story.domain}</small><strong>{client.name}</strong></span><ArrowRight size={18} /></button>;
              })}
            </div>
            <div id="industry-story-panel" role="tabpanel" aria-labelledby={`industry-tab-${activeIndustry}`} className="ecosystem-industry-story" tabIndex={0}>
              <MotionPhoto key={activeIndustry} src={currentIndustry.image} alt={currentIndustry.alt} className="ecosystem-industry-story-image"><span className="ecosystem-industry-domain">{currentIndustry.domain}</span><button type="button" className="ecosystem-enlarge" aria-label={`View ${currentIndustry.domain} engineering image`} onClick={() => setGalleryIndex(activeIndustry)}><Maximize2 size={19} /></button><div className="ecosystem-industry-story-caption"><h3>{currentIndustry.title}</h3><button type="button" onClick={() => setProfile(currentClient)}>Explore {currentClient.name} <ArrowRight size={16} /></button><small>Engineering imagery</small></div></MotionPhoto>
              <div className="ecosystem-industry-story-footer"><span>{`0${activeIndustry + 1}`} <small>/ {`0${industryStories.length}`}</small></span><p>Different industries. A shared engineering focus.</p><button type="button" onClick={() => setActiveIndustry(current => (current + 1) % industryStories.length)} aria-label="Explore the next industrial client"><ArrowRight size={22} /></button></div>
            </div>
          </div>
        </div>
      </section>

      <section className="visual-section ecosystem-partners" id="technology-partners" aria-labelledby="ecosystem-partners-title">
        <div className="visual-container">
          <div className="ecosystem-heading-row"><SectionHeading eyebrow="17 TECHNOLOGY & MANUFACTURING BRANDS" title={<><span id="ecosystem-partners-title">Technology partners.<br /><span className="visual-title-accent">Expertise, connected.</span></span></>} description="The equipment brands we integrate into our systems. Explore their technology, capabilities and country of origin." /><span className="ecosystem-section-index" aria-hidden="true">03 / PARTNERS</span></div>
          <div className="ecosystem-directory-tools">
            <FilterBar groups={partnerGroups} selected={partnerGroup} onSelect={setPartnerGroup} entries={ecosystemPartners} allLabel="Filter technology partners by capability" />
            <label className="ecosystem-search"><Search size={17} /><span className="ecosystem-sr-only">Search partners by name or technology</span><input type="search" value={partnerSearch} onChange={event => setPartnerSearch(event.target.value)} placeholder="Find a partner or technology" />{partnerSearch && <button type="button" onClick={() => setPartnerSearch('')} aria-label="Clear partner search"><X size={15} /></button>}</label>
          </div>
          <div className="ecosystem-directory-status ecosystem-partner-status"><p aria-live="polite">Showing <strong>{visiblePartners.length}</strong> of {ecosystemPartners.length} partners</p><span className="ecosystem-desktop-hint">Hover to preview · Click to visit website</span><span className="ecosystem-touch-hint">Tap logo to visit · ⓘ for capabilities</span></div>
          <div className={`ecosystem-partner-showroom${visiblePartners.length > 0 && visiblePartners.length <= 3 ? ' ecosystem-partner-showroom--focused' : ''}`} style={{ '--focused-columns': Math.max(1, Math.min(3, visiblePartners.length)) }}>
            <PartnerPreview entry={previewPartner} onOpen={setProfile} />
            <div className="ecosystem-partner-directory-wrap">
              <div className="ecosystem-partner-directory">{visiblePartners.slice(0, 6).map((partner, index) => <PartnerTile key={partner.id} entry={partner} index={index} active={previewPartner?.id === partner.id} onPreview={previewTechnology} onLeave={cancelPreview} onOpen={setProfile} />)}</div>
              {!visiblePartners.length && <div className="ecosystem-empty"><Search size={26} /><h3>No matching partners</h3><p>Try a brand name or a technology such as PLC, flow or level.</p><button type="button" onClick={() => { setPartnerSearch(''); setPartnerGroup(partnerGroups[0]); }}>Show all 17 partners <ArrowRight size={16} /></button></div>}
            </div>
          </div>
          {visiblePartners.length > 6 && <div className="ecosystem-partner-continuation">{visiblePartners.slice(6).map((partner, index) => <PartnerTile key={partner.id} entry={partner} index={index + 6} active={previewPartner?.id === partner.id} onPreview={previewTechnology} onLeave={cancelPreview} onOpen={setProfile} />)}</div>}
        </div>
      </section>

      <section className="visual-section visual-container ecosystem-connect">
        <div className="ecosystem-marketplace reveal-up"><div className="ecosystem-marketplace-brand"><span>india<span>MART</span></span><small>OUR MARKETPLACE PRESENCE</small></div><div><span className="visual-eyebrow">ANOTHER WAY TO CONNECT</span><h2>Explore our product range.</h2><p>Find Orbit Engineering Solutions on IndiaMART.</p></div><a href={siteConfig.company.contact.indiamart} target="_blank" rel="noopener noreferrer" className="visual-button visual-button--secondary">Visit our store <ExternalLink size={16} /></a></div>
        <div className="ecosystem-partnership reveal-up"><div className="ecosystem-partnership-orbit" aria-hidden="true"><ResponsiveImage src={COMMUNITY_IMAGE} alt="" loading="lazy" sizes="400px" /><span /><span /></div><div><span className="visual-eyebrow">A SHARED VISION</span><h2>The next connection<br />could start with you.</h2><PageLink page="contact" onAction={onOpenQuote} className="visual-button">Discuss a partnership <ArrowRight size={18} /></PageLink></div></div>
      </section>
      {profile && <EcosystemProfile entry={profile} onClose={() => setProfile(null)} />}
      <ImageViewer images={galleryImages} index={galleryIndex} onIndexChange={setGalleryIndex} onClose={() => setGalleryIndex(null)} />
    </div>
  );
}
