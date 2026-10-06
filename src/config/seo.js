import { siteConfig } from './siteConfig';
import { servicePages } from '../data/seoContent';
import { PRODUCT_CATEGORIES } from '../data/products';
import { procurementGuide } from '../data/procurementGuide';
import { assetPath, sitePath, INDEXABLE } from './deployment';

const configuredUrl = import.meta.env.VITE_SITE_URL || 'https://orbitengineering.com';
const origin = new URL(configuredUrl);
if (origin.protocol !== 'https:' || origin.pathname !== '/' || origin.search || origin.hash || origin.username || origin.password) {
  throw new Error('VITE_SITE_URL must be the public HTTPS origin, without a path, credentials, query or fragment.');
}
export const SITE_ORIGIN = origin.origin;
export const absoluteUrl = path => new URL(sitePath(path), SITE_ORIGIN).href;
const absoluteAsset = path => new URL(assetPath(path), SITE_ORIGIN).href;

export const corePages = [
  { id: 'home', path: '/', title: 'Orbit Engineering | Water Treatment & SCADA Automation, Bhopal', description: 'Orbit Engineering in Bhopal delivers water treatment, SCADA and PLC automation, flow instrumentation, installation and maintenance in Madhya Pradesh.' },
  { id: 'about', path: '/about', title: 'About Orbit Engineering | Bhopal, Madhya Pradesh', description: 'Meet Orbit Engineering and its child company Orbit Engineering Solutions, working on water infrastructure, automation and instrumentation from Bhopal.' },
  { id: 'solutions', path: '/solutions', title: 'Water Treatment & Industrial Automation Solutions | Orbit Engineering', description: 'Explore WTP, STP, ETP and RO treatment, SCADA PLC automation, telemetry, commissioning, maintenance and solar water solutions from Orbit Engineering, Bhopal.' },
  { id: 'products', path: '/products', title: 'Flow Meters, PLC Panels & Water Treatment Products | Orbit Engineering', description: 'Browse Orbit Engineering’s flow meters, water quality analyzers, pressure and level instruments, valves, actuators, PLC panels and solar equipment in Bhopal.' },
  { id: 'ecosystem', path: '/ecosystem', title: 'Clients & Technology Ecosystem | Orbit Engineering', description: 'Explore Orbit Engineering’s water infrastructure and industrial technology ecosystem, with client applications, instrumentation and automation platforms.' },
  { id: 'contact', path: '/contact', title: 'Contact Orbit Engineering | Bhopal Address, Phone & Enquiries', description: 'Contact Orbit Engineering in Bhopal, Madhya Pradesh for water treatment, industrial automation, instrumentation, project quotations and service support.' },
];

export const seoPages = [
  ...corePages,
  ...servicePages.map(service => ({ id: service.id, path: service.path, type: 'service', service, title: `${service.title} | Orbit Engineering`, description: service.description })),
  ...PRODUCT_CATEGORIES.map(category => ({ id: category.id, path: `/products/${category.id}`, type: 'category', category, title: `${category.name} in Bhopal | Orbit Engineering`, description: `Explore ${category.name.toLowerCase()} from Orbit Engineering Solutions, Bhopal. ${category.tagline}` })),
  { id: procurementGuide.id, path: procurementGuide.path, type: 'guide', title: `${procurementGuide.title} | Orbit Engineering`, description: procurementGuide.description, guide: procurementGuide },
];

const aliases = { home: '/', team: '/about', service: '/solutions', services: '/solutions', solution: '/solutions', projects: '/solutions' };
export function pathForPage(page) {
  if (typeof page !== 'string') return '/';
  if (page.startsWith('/')) return page;
  return aliases[page] || corePages.find(item => item.id === page)?.path || '/404';
}
export function normalizePath(path) {
  const clean = (path || '/').split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  return aliases[clean.slice(1)] || clean;
}
export function getPage(path) {
  return seoPages.find(page => page.path === normalizePath(path)) || { id: 'not-found', path: '/404', title: 'Page not found | Orbit Engineering', description: 'This page could not be found. Explore Orbit Engineering’s water treatment and automation solutions or contact the Bhopal team.', noindex: true };
}

const companyId = absoluteUrl('/#organization');
const websiteId = absoluteUrl('/#website');
export function structuredData(page) {
  const { company } = siteConfig;
  const url = absoluteUrl(page.path);
  const graph = [
    { '@type': 'ProfessionalService', '@id': companyId, name: company.name, alternateName: ['Orbit Engineering Co.', 'Orbit Engineering Company'], url: absoluteUrl('/'), logo: absoluteUrl('/logo.png'), image: absoluteUrl('/images/design-v2/about-engineering.webp'), description: 'Water infrastructure, industrial automation and instrumentation engineering in Bhopal, Madhya Pradesh.', telephone: company.contact.phonePrimary, email: company.contact.emails[0], address: { '@type': 'PostalAddress', ...company.offices[0].structuredAddress }, areaServed: [{ '@type': 'AdministrativeArea', name: 'Madhya Pradesh' }, { '@type': 'Country', name: 'India' }], openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '10:00', closes: '19:00' }], hasMap: company.offices[0].mapsUrl, subOrganization: { '@id': absoluteUrl('/#solutions-organization') }, contactPoint: [{ '@type': 'ContactPoint', telephone: company.contact.phonePrimary, email: company.contact.emails[0], contactType: 'project enquiries', areaServed: 'IN' }] },
    { '@type': 'Organization', '@id': absoluteUrl('/#solutions-organization'), name: company.childCompanyName, alternateName: 'OES', url: company.childCompanyUrl, parentOrganization: { '@id': companyId }, sameAs: [company.contact.indiamart] },
    { '@type': 'WebSite', '@id': websiteId, url: absoluteUrl('/'), name: company.name, alternateName: 'Orbit Engineering', publisher: { '@id': companyId }, inLanguage: 'en-IN' },
    { '@type': page.type === 'category' || ['products', 'solutions', 'ecosystem'].includes(page.id) ? 'CollectionPage' : page.id === 'contact' ? 'ContactPage' : page.id === 'about' ? 'AboutPage' : 'WebPage', '@id': `${url}#webpage`, url, name: page.title, description: page.description, isPartOf: { '@id': websiteId }, about: { '@id': companyId }, inLanguage: 'en-IN', ...(page.type === 'service' ? { mainEntity: { '@id': `${url}#service` } } : {}) },
  ];
  if (page.path !== '/' && !page.noindex) {
    const crumbs = [{ name: 'Home', item: absoluteUrl('/') }];
    if (page.type === 'service' || page.type === 'category') crumbs.push({ name: page.type === 'service' ? 'Solutions' : 'Products', item: absoluteUrl(page.type === 'service' ? '/solutions' : '/products') });
    crumbs.push({ name: page.service?.shortTitle || page.category?.name || page.guide?.shortTitle || page.id[0].toUpperCase() + page.id.slice(1), item: url });
    graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs.map((crumb, i) => ({ '@type': 'ListItem', position: i + 1, ...crumb })) });
  }
  if (page.type === 'service') {
    graph.push({ '@type': 'Service', '@id': `${url}#service`, name: page.service.title, description: page.service.description, serviceType: page.service.shortTitle, provider: { '@id': companyId }, areaServed: [{ '@type': 'AdministrativeArea', name: 'Madhya Pradesh' }, { '@type': 'Country', name: 'India' }], url });
    if (page.service.faqs.length) graph.push({ '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: page.service.faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) });
  }
  if (page.type === 'category') graph.push({ '@type': 'ItemList', name: page.category.name, itemListElement: page.category.products.map((product, i) => ({ '@type': 'ListItem', position: i + 1, name: product.name, url: `${url}#${product.id}` })) });
  if (page.type === 'guide') graph.push({ '@type': 'Article', '@id': `${url}#article`, headline: page.guide.title, description: page.guide.description, author: { '@id': companyId }, publisher: { '@id': companyId }, mainEntityOfPage: { '@id': `${url}#webpage` }, inLanguage: 'en-IN' });
  return { '@context': 'https://schema.org', '@graph': graph };
}

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
export function renderSeoHead(page) {
  const url = absoluteUrl(page.path);
  const image = absoluteAsset('/images/hero-wtp-BGjLUC-Q.jpg');
  const meta = (attribute, name, value) => `<meta data-seo ${attribute}="${escapeHtml(name)}" content="${escapeHtml(value)}" />`;
  return [
    `<title data-seo>${escapeHtml(page.title)}</title>`,
    meta('name', 'description', page.description),
    meta('name', 'robots', page.noindex || !INDEXABLE ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'),
    ...(page.noindex ? [] : [`<link data-seo rel="canonical" href="${escapeHtml(url)}" />`]),
    meta('property', 'og:type', 'website'), meta('property', 'og:site_name', siteConfig.company.name), meta('property', 'og:locale', 'en_IN'),
    meta('property', 'og:title', page.title), meta('property', 'og:description', page.description), meta('property', 'og:url', url), meta('property', 'og:image', image), meta('property', 'og:image:alt', 'Water treatment infrastructure — Orbit Engineering'),
    meta('name', 'twitter:card', 'summary_large_image'), meta('name', 'twitter:title', page.title), meta('name', 'twitter:description', page.description), meta('name', 'twitter:image', image), meta('name', 'twitter:image:alt', 'Water treatment infrastructure — Orbit Engineering'),
    ...(import.meta.env.VITE_GOOGLE_SITE_VERIFICATION ? [meta('name', 'google-site-verification', import.meta.env.VITE_GOOGLE_SITE_VERIFICATION)] : []),
    ...(import.meta.env.VITE_BING_SITE_VERIFICATION ? [meta('name', 'msvalidate.01', import.meta.env.VITE_BING_SITE_VERIFICATION)] : []),
    ...(page.noindex ? [] : [`<script data-seo type="application/ld+json">${JSON.stringify(structuredData(page)).replace(/</g, '\\u003c')}</script>`]),
  ].join('\n    ');
}

export function updateSeoHead(path) {
  const template = document.createElement('template');
  template.innerHTML = renderSeoHead(getPage(path));
  document.head.querySelectorAll('[data-seo]').forEach(node => node.remove());
  document.head.append(template.content);
}
