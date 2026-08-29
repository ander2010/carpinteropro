// =============================================================================
// EVENT TRACKING — helper opcional (sección 54 de la especificación)
// =============================================================================
// Sólo envía eventos si dataLayer (GTM) o gtag (GA4) existen en window, es decir,
// si PUBLIC_GA_ID o PUBLIC_GTM_ID están configurados. Si no hay Analytics
// configurado, trackEvent() no hace nada (no lanza errores).
// =============================================================================

export type TrackedEvent =
  | 'quote_click'
  | 'quote_submit'
  | 'phone_click'
  | 'whatsapp_click'
  | 'contact_submit'
  | 'service_view'
  | 'product_view'
  | 'project_view';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: TrackedEvent, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event, ...params });
  } else if (typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  }
}
