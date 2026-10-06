import { sitePath } from './deployment';
const PAGE_PATHS = {
  home: '/',
  about: '/about',
  products: '/products',
  solutions: '/solutions',
  ecosystem: '/ecosystem',
  contact: '/contact',
  team: '/about#leadership-team',
};

export function pageHref(page) {
  if (PAGE_PATHS[page]) return sitePath(PAGE_PATHS[page]);
  if (['service', 'services', 'solution', 'projects'].includes(page)) return sitePath('/solutions');
  return sitePath(typeof page === 'string' && page.startsWith('/') ? page : '/');
}

// Keep real URLs available to crawlers, new tabs, downloads and browsers without JS.
export function handlePageLink(event, page, onNavigate) {
  if (!onNavigate || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.currentTarget.target === '_blank' || event.currentTarget.hasAttribute('download')) return;
  event.preventDefault();
  onNavigate(page);
}
