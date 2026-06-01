import { test, expect } from "@playwright/test";

const CONSENT_KEY = "erdt-cookie-consent";

test.describe("Cookie consent banner", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate first (any origin), clear storage, reload so page sees empty state
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("banner is visible on first visit", async ({ page }) => {
    const banner = page.getByRole("region", { name: /aviso de cookies/i });
    await expect(banner).toBeVisible({ timeout: 8000 });
  });

  test("banner is hidden when consent is already stored", async ({ page }) => {
    await page.evaluate(([key]) => localStorage.setItem(key, "accepted"), [CONSENT_KEY]);
    await page.reload();
    await expect(page.getByRole("region", { name: /aviso de cookies/i })).not.toBeVisible({
      timeout: 4000,
    });
  });

  test("accepting cookies hides the banner and stores consent", async ({ page }) => {
    const banner = page.getByRole("region", { name: /aviso de cookies/i });
    await expect(banner).toBeVisible({ timeout: 8000 });

    await page.getByRole("button", { name: /aceptar todo/i }).click();

    await expect(banner).not.toBeVisible();
    const stored = await page.evaluate(([key]) => localStorage.getItem(key), [CONSENT_KEY]);
    expect(stored).toBe("accepted");
  });

  test("rejecting cookies hides the banner and stores consent", async ({ page }) => {
    const banner = page.getByRole("region", { name: /aviso de cookies/i });
    await expect(banner).toBeVisible({ timeout: 8000 });

    await page.getByRole("button", { name: /rechazar/i }).click();

    await expect(banner).not.toBeVisible();
    const stored = await page.evaluate(([key]) => localStorage.getItem(key), [CONSENT_KEY]);
    expect(stored).toBe("rejected");
  });

  test("consent persists across page reload", async ({ page }) => {
    await expect(page.getByRole("region", { name: /aviso de cookies/i })).toBeVisible({
      timeout: 8000,
    });
    await page.getByRole("button", { name: /aceptar todo/i }).click();

    // Normal reload — no initScript clears storage, so consent persists
    await page.reload();

    await expect(page.getByRole("region", { name: /aviso de cookies/i })).not.toBeVisible({
      timeout: 4000,
    });
  });
});
