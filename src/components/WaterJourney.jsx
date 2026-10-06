import React, { useRef, useState } from 'react';
import { ArrowDownRight, ArrowRight, Droplets, Gauge, Maximize2, Waves, Waypoints } from 'lucide-react';
import { ImageViewer, MotionPhoto, SectionHeading } from './VisualSystem';
import PageLink from './PageLink';
import ResponsiveImage from './ResponsiveImage';
import '../styles/water-journey.css';

const SCENES = [
  { label: 'At the source', title: 'Where every journey begins.', description: 'Intake structures connect a dependable water source to the entire system.', src: '/images/service_intake.jpg', alt: 'Intake tower and walkway across a blue reservoir', icon: Waves, tag: 'INTAKE & ABSTRACTION' },
  { label: 'Through treatment', title: 'Clean water. Carefully engineered.', description: 'Each stage of treatment brings us closer to safer, cleaner water.', src: '/images/hero-wtp-BGjLUC-Q.jpg', alt: 'Water treatment clarifiers reflecting the early morning sky', icon: Droplets, tag: 'TREATMENT & FILTRATION' },
  { label: 'Across the network', title: 'The energy that keeps life moving.', description: 'Pumping and distribution connect the plant to the people it serves.', src: '/images/pump-house-rehbpR99.jpg', alt: 'Large blue pumps and pipework inside a pumping station', icon: Gauge, tag: 'PUMPING & DISTRIBUTION' },
  { label: 'Into everyday life', title: 'Reliability, beyond the plant.', description: 'Storage and connected controls support water access, every day.', src: '/images/service_oht.jpg', alt: 'Elevated water storage tank above green surroundings', icon: Waypoints, tag: 'STORAGE & SUPPLY' },
];

export default function WaterJourney({ onNavigate }) {
  const [scene, setScene] = useState(0);
  const [viewer, setViewer] = useState(null);
  const buttons = useRef([]);
  const current = SCENES[scene];
  const next = (scene + 1) % SCENES.length;
  const Icon = current.icon;
  const keySelect = (event, index) => {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % SCENES.length;
    if (event.key === 'ArrowLeft') nextIndex = (index + SCENES.length - 1) % SCENES.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = SCENES.length - 1;
    if (nextIndex !== undefined) { event.preventDefault(); setScene(nextIndex); buttons.current[nextIndex]?.focus(); }
  };
  return <section className="water-journey visual-section">
    <div className="visual-container">
      <div className="journey-heading reveal-up"><SectionHeading eyebrow="INFRASTRUCTURE, IN FOCUS" title={<>Look closer.<br /><span className="visual-title-accent">It all connects.</span></>} /><p>Follow the water. Discover the engineering.<br /><span>Four perspectives. One connected system.</span></p></div>
      <div className="journey-tabs reveal-up" role="tablist" aria-label="Explore the water journey">
        {SCENES.map((item, index) => <button ref={el => { buttons.current[index] = el; }} key={item.label} id={`journey-tab-${index}`} type="button" role="tab" aria-selected={scene === index} aria-controls="journey-scene" tabIndex={scene === index ? 0 : -1} onKeyDown={event => keySelect(event, index)} onClick={() => setScene(index)}><span>0{index + 1}</span>{item.label}<ArrowDownRight size={17} /></button>)}
      </div>
      <div className="journey-composition reveal-scale">
        <div id="journey-scene" className="journey-main" role="tabpanel" aria-labelledby={`journey-tab-${scene}`}>
          <MotionPhoto key={current.src} src={current.src} alt={current.alt} className="journey-main-photo">
            <div className="journey-photo-shade" />
            <span className="journey-photo-top">0{scene + 1} / ORBIT IN FOCUS</span>
            <button type="button" className="journey-zoom" onClick={() => setViewer(scene)} aria-label={`Open ${current.label.toLowerCase()} image gallery`}><Maximize2 size={19} /></button>
            <div className="journey-photo-copy"><span><Icon size={18} />{current.tag}</span><h3>{current.title}</h3><p>{current.description}</p></div>
          </MotionPhoto>
          <span className="journey-photo-frame" aria-hidden="true" />
        </div>
        <div className="journey-side">
          <button type="button" className="journey-next" onClick={() => setScene(next)} aria-label={`Explore ${SCENES[next].label.toLowerCase()}`}>
            <ResponsiveImage src={SCENES[next].src} alt="" sizes="(min-width: 900px) 32vw, 100vw" loading="lazy" />
            <span>UP NEXT<strong>{SCENES[next].label}<ArrowRight size={20} /></strong></span>
          </button>
          <div className="journey-connecting"><svg viewBox="0 0 270 110" aria-hidden="true"><path d="M10 22H76Q110 22 110 55T144 88H260" /><circle cx="10" cy="22" r="5" /><circle cx="260" cy="88" r="5" /></svg><span>ONE CONTINUOUS PURPOSE</span><strong>Better water.<br />Better everyday life.</strong><PageLink page="solutions" onNavigate={onNavigate}>Explore the whole journey<ArrowRight size={17} /></PageLink></div>
        </div>
      </div>
    </div>
    <ImageViewer images={SCENES} index={viewer} onIndexChange={setViewer} onClose={() => setViewer(null)} />
  </section>;
}
