import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Droplets, Expand, MapPin, Pause, Play, Radio, ShieldCheck, Wrench } from 'lucide-react';
import { MotionPhoto } from './VisualSystem';
import ResponsiveImage from './ResponsiveImage';
import PageLink from './PageLink';
import '../styles/about-story.css';

const CHAPTER_DURATION = 7000;
const CHAPTER_ICONS = [Droplets, Wrench, Radio];

export default function AboutStory({ company, chapters, onOpenImage, onNavigate }) {
  const section = useRef(null);
  const progress = useRef(null);
  const elapsed = useRef(0);
  const chapterButtons = useRef([]);
  const [activeChapter, setActiveChapter] = useState(0);
  const [paused, setPaused] = useState(false);
  const [playRequested, setPlayRequested] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [environment, setEnvironment] = useState({ inView: false, visible: true, reducedMotion: true });

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setEnvironment(current => ({ ...current, reducedMotion: preference.matches || Boolean(navigator.connection?.saveData) }));
    const updateVisibility = () => setEnvironment(current => ({ ...current, visible: !document.hidden }));
    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(([entry]) => {
      setEnvironment(current => ({ ...current, inView: entry.isIntersecting }));
    }, { threshold: 0.15 });
    if (observer) observer.observe(section.current);
    else setEnvironment(current => ({ ...current, inView: true }));
    preference.addEventListener('change', updatePreference);
    document.addEventListener('visibilitychange', updateVisibility);
    updatePreference();
    updateVisibility();
    return () => {
      observer?.disconnect();
      preference.removeEventListener('change', updatePreference);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  const running = environment.inView && environment.visible && !environment.reducedMotion && !paused && ((!hovered && !focused) || playRequested);

  // Keep elapsed time when paused, so the progress line and image advance together.
  // Updating the line directly avoids rendering the component on every frame.
  useEffect(() => {
    if (!running) return undefined;
    let frame;
    let previous = performance.now();
    const advance = time => {
      elapsed.current += time - previous;
      previous = time;
      if (elapsed.current >= CHAPTER_DURATION) {
        elapsed.current = 0;
        setActiveChapter(current => (current + 1) % chapters.length);
      }
      if (progress.current) progress.current.style.transform = `scaleX(${elapsed.current / CHAPTER_DURATION})`;
      frame = requestAnimationFrame(advance);
    };
    frame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(frame);
  }, [running, chapters.length]);

  const selectChapter = index => {
    setPlayRequested(false);
    elapsed.current = 0;
    if (progress.current) progress.current.style.transform = 'scaleX(0)';
    setActiveChapter(index);
  };

  const handleChapterKey = (event, index) => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % chapters.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + chapters.length - 1) % chapters.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = chapters.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectChapter(next);
    chapterButtons.current[next]?.focus();
  };

  const chapter = chapters[activeChapter];
  const nextChapter = chapters[(activeChapter + 1) % chapters.length];

  return (
    <section ref={section} id="about-story" className="orbit-story" aria-labelledby="about-story-title" data-running={running} data-in-view={environment.inView}>
      <div className="visual-container orbit-story__layout">
        <div className="orbit-story__visual" onPointerEnter={event => { if (event.pointerType === 'mouse') { setHovered(true); setPlayRequested(false); } }} onPointerLeave={() => setHovered(false)} onFocusCapture={() => { setFocused(true); setPlayRequested(false); }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
          <div className="orbit-story__collage">
            <div className="orbit-story__sculpture" aria-hidden="true" />
            <svg className="orbit-story__orbit" viewBox="0 0 660 550" aria-hidden="true">
              <ellipse cx="330" cy="275" rx="311" ry="231" transform="rotate(-21 330 275)" />
              <ellipse cx="330" cy="275" rx="287" ry="253" transform="rotate(26 330 275)" />
              <circle cx="592" cy="132" r="6" /><circle cx="87" cy="414" r="4" />
            </svg>
            <figure id="orbit-story-photo" className="orbit-story__photo" aria-label={chapter.title}>
              <MotionPhoto key={chapter.image} className="orbit-story__motion-photo" src={chapter.image} alt={chapter.alt} sizes="(max-width: 600px) calc(100vw - 55px), (max-width: 1000px) 680px, 660px">
                <div className="orbit-story__photo-shade" />
                <button type="button" className="orbit-story__zoom" onClick={() => { setPaused(true); setPlayRequested(false); onOpenImage(chapter.image); }} aria-label={`View ${chapter.title.toLowerCase()} image`}><Expand size={19} /></button>
              </MotionPhoto>
              <figcaption key={chapter.title} className="orbit-story__caption">
                <span><i /> 0{activeChapter + 1} / {chapter.title}</span>
                <strong>{chapter.caption}</strong>
                {chapter.illustrative && <small>Illustrative engineering scene</small>}
              </figcaption>
            </figure>
            <div className="orbit-story__since"><span>Our journey</span><strong>{company.founded}</strong><small>Built on experience</small></div>
            <figure key={nextChapter.image} className="orbit-story__detail">
              <div className="orbit-story__detail-image"><ResponsiveImage src={nextChapter.image} alt="" loading="lazy" sizes="(max-width: 600px) 160px, 260px" /></div>
              <figcaption><span>Another perspective</span><strong>{nextChapter.title}<ArrowRight size={15} aria-hidden="true" /></strong></figcaption>
            </figure>
            <span className="orbit-story__vertical" aria-hidden="true">THE ORBIT PERSPECTIVE</span>
          </div>

          <div className="orbit-story__chapter-bar">
            <div className="orbit-story__chapter-heading"><span>One story. Three perspectives.</span><button type="button" className="orbit-story__play" onClick={() => { setPlayRequested(paused); setPaused(!paused); }} aria-label={environment.reducedMotion ? 'Automatic image changes disabled by motion preference' : paused ? 'Play image story' : 'Pause image story'} aria-pressed={paused} disabled={environment.reducedMotion}>{environment.reducedMotion || paused ? <Play size={13} /> : <Pause size={13} />}<span>{environment.reducedMotion ? 'Motion off' : paused ? 'Play' : 'Pause'}</span></button></div>
            <div className="orbit-story__chapters" role="group" aria-label="Explore our engineering story">
              {chapters.map((item, index) => {
                const Icon = CHAPTER_ICONS[index];
                return <button type="button" key={item.title} ref={node => { chapterButtons.current[index] = node; }} className="orbit-story__chapter" aria-pressed={activeChapter === index} aria-controls="orbit-story-photo" tabIndex={activeChapter === index ? 0 : -1} onClick={() => selectChapter(index)} onKeyDown={event => handleChapterKey(event, index)}>
                  <span className="orbit-story__chapter-image"><ResponsiveImage src={item.image} alt="" loading="lazy" sizes="(max-width: 600px) 120px, 220px" /><span><Icon size={15} /></span></span>
                  <span className="orbit-story__chapter-label"><small>0{index + 1}</small><strong>{item.title}</strong></span>
                </button>;
              })}
            </div>
            <div className="orbit-story__progress" aria-hidden="true"><span ref={progress} /></div>
          </div>
        </div>

        <div className="orbit-story__copy">
          <div className="orbit-story__heading">
            <span className="orbit-story__eyebrow"><i /> Our story <span> / </span> Since {company.founded}</span>
            <h2 id="about-story-title">Rooted in experience.<span>Driven by possibility.</span></h2>
          </div>
          <div className="orbit-story__body">
            <p>Founded in {company.founded}, {company.name} brings water treatment and industrial automation together under one roof.</p>
            <p>From municipal plants to smart distribution networks, our teams turn complex infrastructure into dependable everyday water access.</p>
            <div className="orbit-story__capabilities" aria-label="Our engineering capabilities">
              {chapters.map((item, index) => {
                const Icon = CHAPTER_ICONS[index];
                return <span key={item.title}><Icon size={16} />{item.title}</span>;
              })}
            </div>
            <div className="orbit-story__facts">
              <div><MapPin size={19} /><span><small>Our home</small><strong>{company.headquarters}</strong></span></div>
              <div><ShieldCheck size={19} /><span><small>Our standards</small><strong>Quality, environment &amp; safety certified</strong></span></div>
            </div>
            <PageLink page="ecosystem" onNavigate={onNavigate} className="orbit-story__link"><span>See who we work with</span><span><ArrowRight size={19} /></span></PageLink>
          </div>
        </div>
      </div>
    </section>
  );
}
