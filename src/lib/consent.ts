export const CONSENT_KEY = "erdt-cookie-consent";
export const CONSENT_EVENT = "erdt:consent-change";

export type ConsentValue = "accepted" | "rejected";

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(CONSENT_KEY);
  if (v === "accepted" || v === "rejected") return v;
  return null;
}

export function setConsent(value: ConsentValue): void {
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

export function onConsentChange(cb: (value: ConsentValue) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<ConsentValue>).detail);
  window.addEventListener(CONSENT_EVENT, handler);
  return () => window.removeEventListener(CONSENT_EVENT, handler);
}
