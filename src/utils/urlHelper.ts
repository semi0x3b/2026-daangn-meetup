/**
 * Static builds (GitHub Pages) set VITE_STATIC_SITE=true.
 * There they hide AI Q&A (needs the Express /api server) and HTML download.
 */
export const IS_STATIC_SITE = import.meta.env.VITE_STATIC_SITE === 'true';
export const AI_ENABLED = !IS_STATIC_SITE;

/**
 * Utility to get the public, shareable URL for the application.
 * In AI Studio, 'ais-dev-' URLs are developer-only private sandbox endpoints
 * that return 404 or authentication errors when opened in new tabs or shared.
 * The public shared endpoint uses 'ais-pre-'.
 */
export function getPublicShareUrl(subpath: string = ''): string {
  if (typeof window === 'undefined') {
    return 'https://ais-pre-4buvf4ovjzcb2ikto5hnza-686565984811.asia-northeast1.run.app';
  }

  let origin = window.location.origin;

  // Replace developer private preview domain with public shared domain
  if (origin.includes('ais-dev-')) {
    origin = origin.replace('ais-dev-', 'ais-pre-');
  }

  // GitHub Pages serves under /<repo>/ — BASE_URL is '/' everywhere else
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

  // Ensure clean formatting
  const cleanPath = subpath ? (subpath.startsWith('/') ? subpath : `/${subpath}`) : '';
  return `${origin}${basePath}${cleanPath}`;
}
