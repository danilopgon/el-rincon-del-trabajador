import { describe, it, expect, beforeEach, vi } from "vitest";
import { getConsent, setConsent, onConsentChange, CONSENT_KEY, CONSENT_EVENT } from "../consent";

describe("consent", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  describe("getConsent", () => {
    it("returns null when no consent is stored", () => {
      expect(getConsent()).toBeNull();
    });

    it("returns 'accepted' when consent is 'accepted'", () => {
      window.localStorage.setItem(CONSENT_KEY, "accepted");
      expect(getConsent()).toBe("accepted");
    });

    it("returns 'rejected' when consent is 'rejected'", () => {
      window.localStorage.setItem(CONSENT_KEY, "rejected");
      expect(getConsent()).toBe("rejected");
    });

    it("returns null for an unrecognised value", () => {
      window.localStorage.setItem(CONSENT_KEY, "unknown");
      expect(getConsent()).toBeNull();
    });
  });

  describe("setConsent", () => {
    it("stores the value in localStorage", () => {
      setConsent("accepted");
      expect(window.localStorage.getItem(CONSENT_KEY)).toBe("accepted");
    });

    it("dispatches a custom event with the consent value", () => {
      const handler = vi.fn();
      window.addEventListener(CONSENT_EVENT, handler);
      setConsent("rejected");
      window.removeEventListener(CONSENT_EVENT, handler);
      expect(handler).toHaveBeenCalledOnce();
      const event = handler.mock.calls[0][0] as CustomEvent;
      expect(event.detail).toBe("rejected");
    });
  });

  describe("onConsentChange", () => {
    it("calls the callback when consent changes", () => {
      const cb = vi.fn();
      const unsubscribe = onConsentChange(cb);
      setConsent("accepted");
      unsubscribe();
      expect(cb).toHaveBeenCalledWith("accepted");
    });

    it("returns an unsubscribe function that stops future callbacks", () => {
      const cb = vi.fn();
      const unsubscribe = onConsentChange(cb);
      unsubscribe();
      setConsent("rejected");
      expect(cb).not.toHaveBeenCalled();
    });
  });
});
