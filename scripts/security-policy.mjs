// Production policy shared by Apache, Vercel validation and the local preview.
// React needs style attributes for layout/animation; executable inline JS is forbidden.
export const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "style-src-elem 'self' https://fonts.googleapis.com",
  "style-src-attr 'unsafe-inline'",
  "img-src 'self' data: https://images.unsplash.com",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self'",
  'frame-src https://maps.google.com https://www.google.com',
  "media-src 'self'",
  "manifest-src 'self'",
  "worker-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
  "form-action 'none'",
].join('; ');

export const securityHeaders = Object.freeze({
  'Content-Security-Policy': contentSecurityPolicy,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // No includeSubDomains/preload: other subdomains' TLS has not been verified.
  'Strict-Transport-Security': 'max-age=31536000',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Permitted-Cross-Domain-Policies': 'none',
});

// This is a static site, so old server executables have no legitimate public role.
export const privateFilePattern = /(?:^|\/)(?:\.(?!well-known(?:\/|$))[^/]+|src|scripts|node_modules|dist-ssr|(?:package(?:-lock)?\.json|(?:pnpm-lock|yarn)\.(?:yaml|lock)|(?:vite|tailwind|postcss)\.config\.[^/]+))(?=\/|$)|\.(?:php\d*|phtml|phar|asp|aspx|jspx?|cgi|fcgi|shtml|shtm|stm|asax|ascx|ashx|asmx|cs|vb|dll|exe|config|pl|py|rb|sh|bat|cmd|ps1|sql|sqlite\d*|db|bak|backup|old|orig|log|pem|key|p12|pfx|map|md)(?:\.|\/|$)/i;

export function blockedPublicPath(pathname) {
  return privateFilePattern.test(pathname);
}
