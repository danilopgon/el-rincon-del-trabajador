import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has correct page title and meta description", async ({ page }) => {
    await expect(page).toHaveTitle(
      "Vestuario laboral y EPI en Tarancón · El Rincón del Trabajador"
    );
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute("content", /Ropa de trabajo/);
  });

  test("renders the hero H1 and primary CTA", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Te vestimos");
    await expect(page.getByRole("link", { name: /pedir presupuesto/i }).first()).toBeVisible();
  });

  test("skip link is present and points to main content", async ({ page }) => {
    const skipLink = page.getByRole("link", { name: /saltar al contenido/i });
    await expect(skipLink).toBeAttached();
    await expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  test("main sections are present in the page", async ({ page }) => {
    await expect(page.locator("#servicios")).toBeAttached();
    await expect(page.locator("#sectores")).toBeAttached();
    await expect(page.locator("#contacto")).toBeAttached();
  });

  test("footer shows copyright and legal links", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toContainText("© 2026 El Rincón del Trabajador");
    await expect(footer.getByRole("link", { name: "Aviso legal" })).toHaveAttribute(
      "href",
      "/aviso-legal"
    );
    await expect(footer.getByRole("link", { name: "Privacidad" })).toHaveAttribute(
      "href",
      "/privacidad"
    );
    await expect(footer.getByRole("link", { name: "Cookies" })).toHaveAttribute("href", "/cookies");
  });

  test("legal pages load with noindex and correct headings", async ({ page }) => {
    for (const href of ["/aviso-legal", "/privacidad", "/cookies"]) {
      await page.goto(href);
      const robots = page.locator('meta[name="robots"]');
      await expect(robots).toHaveAttribute("content", /noindex/);
    }
  });
});
