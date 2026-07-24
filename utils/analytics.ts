import { createRef } from 'react';

/**
 * Referencia global a la WebView de Analytics.
 * Esto permite disparar eventos sin importar si estamos dentro de un componente React o en un archivo normal (ej. Zustand, hooks).
 */
export const analyticsPixelRef = createRef<any>();

type SupportedEvent =
  | 'PageView'
  | 'CompleteRegistration'
  | 'Purchase'
  | 'Login'
  | 'AddToCart'
  | 'ViewContent'; // Puedes agregar más eventos según las docs oficiales

/**
 * Función para disparar eventos de Meta y TikTok a través del PixelWebView oculto.
 * 
 * @param platforms - Qué pixel debe recibir el evento: 'meta', 'tiktok' o 'both'
 * @param eventName - Nombre estándar del evento (ej. 'Purchase')
 * @param data - (Opcional) Datos adicionales como valor, currency, email hasheado, etc.
 */
export const trackPixelEvent = (
  platforms: 'meta' | 'tiktok' | 'both',
  eventName: SupportedEvent | (string & {}),
  data?: Record<string, any>
) => {
  if (!analyticsPixelRef.current) {
    console.warn('[Analytics] PixelWebView ref is not ready. Event missed:', eventName);
    return;
  }

  let script = '';
  const dataString = data ? `, ${JSON.stringify(data)}` : '';

  if (platforms === 'meta' || platforms === 'both') {
    script += `fbq('track', '${eventName}'${dataString});\n`;
  }

  if (platforms === 'tiktok' || platforms === 'both') {
    script += `ttq.track('${eventName}'${dataString});\n`;
  }

  // React Native WebView requiere que el script inyectado retorne un valor (por eso true al final)
  script += 'true;';

  analyticsPixelRef.current.injectJavaScript(script);
};
