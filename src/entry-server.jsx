import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { seoPages, renderSeoHead, getPage, SITE_ORIGIN } from './config/seo';
import { BASE_PATH, URL_STYLE, INDEXABLE, sitePath } from './config/deployment';

export { seoPages, SITE_ORIGIN, BASE_PATH, URL_STYLE, INDEXABLE, sitePath };
export function render(path) {
  return { html: renderToString(<App initialPath={path} />), head: renderSeoHead(getPage(path)) };
}
