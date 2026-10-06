export const BASE_PATH = import.meta.env.BASE_URL || '/';
export const URL_STYLE = import.meta.env.VITE_URL_STYLE === 'directory' ? 'directory' : 'clean';
export const INDEXABLE = import.meta.env.VITE_INDEXABLE !== 'false';
const prefix = BASE_PATH.replace(/\/$/, '');

export function fromSitePath(value) {
  if (!prefix) return value;
  if (value === prefix || value === prefix + '/') return '/';
  return value.startsWith(prefix + '/') ? value.slice(prefix.length) : '/404';
}

export function assetPath(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || !prefix) return value;
  // Vite already prefixes imported files. Public files are supplied as logical URLs.
  if (value.startsWith(prefix + '/assets/') || value.startsWith(prefix + '/src/')) return value;
  return prefix + value;
}

export function sitePath(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return value;
  const [, pathname, suffix] = value.match(/^([^?#]*)(.*)$/s);
  let result = prefix + pathname;
  if (URL_STYLE === 'directory' && !result.endsWith('/') && !/\.[^/]+$/.test(result)) result += '/';
  return result + suffix;
}
