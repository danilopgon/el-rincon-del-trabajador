import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CookieBanner from "../CookieBanner";
import { CONSENT_KEY } from "../../lib/consent";

describe("CookieBanner", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders when no consent is stored", () => {
    render(<CookieBanner />);
    expect(screen.getByRole("region", { name: /aviso de cookies/i })).toBeInTheDocument();
  });

  it("does not render when consent is already stored", () => {
    window.localStorage.setItem(CONSENT_KEY, "accepted");
    const { container } = render(<CookieBanner />);
    expect(container.firstChild).toBeNull();
  });

  it("hides the banner and stores 'accepted' when the accept button is clicked", async () => {
    const user = userEvent.setup();
    render(<CookieBanner />);
    await user.click(screen.getByRole("button", { name: /aceptar todo/i }));
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(window.localStorage.getItem(CONSENT_KEY)).toBe("accepted");
  });

  it("hides the banner and stores 'rejected' when the reject button is clicked", async () => {
    const user = userEvent.setup();
    render(<CookieBanner />);
    await user.click(screen.getByRole("button", { name: /rechazar/i }));
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(window.localStorage.getItem(CONSENT_KEY)).toBe("rejected");
  });
});
