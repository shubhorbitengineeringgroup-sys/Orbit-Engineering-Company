import React from 'react';
import { handlePageLink, pageHref } from '../config/navigation';

const PageLink = React.forwardRef(function PageLink({ page = 'contact', onNavigate, onAction, onClick, children, ...props }, ref) {
  return <a {...props} ref={ref} href={pageHref(page)} onClick={event => {
    onClick?.(event);
    handlePageLink(event, page, onAction ? () => onAction() : onNavigate);
  }}>{children}</a>;
});

export default PageLink;
