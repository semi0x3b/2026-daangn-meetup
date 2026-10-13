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

  // Ensure clean formatting
  const cleanPath = subpath ? (subpath.startsWith('/') ? subpath : `/${subpath}`) : '';
  return `${origin}${cleanPath}`;
}
