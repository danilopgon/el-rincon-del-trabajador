import { test, expect } from "@playwright/test";

test.describe("Header navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("desktop nav shows all main links", async ({ page }) => {
    const nav = page.locator(".hdr__nav");
    for (const label of ["Servicios", "Sectores", "Tienda", "Contacto"]) {
      await expect(nav.getByRole("link", { name: label })).toBeAttached();
    }
  });

  test("mobile burger button opens the drawer", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    const burger = page.getByRole("button", { name: /abrir menú/i });
    await expect(burger).toBeVisible();
    await burger.click();

    const drawer = page.locator("#mobile-nav");
    await expect(drawer).toHaveClass(/is-open/);
    await expect(drawer).toHaveAttribute("aria-hidden", "false");
  });

  test("mobile drawer closes on close button click", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    const burger = page.getByRole("button", { name: /abrir menú/i });
    await expect(burger).toBeVisible();
    await burger.click();

    const drawer = page.locator("#mobile-nav");
    await expect(drawer).toHaveClass(/is-open/);

    // Use specific class selector to avoid ambiguity with burger's "Cerrar menú" label
    await page.locator(".nav-drawer__close").click();

    await expect(drawer).not.toHaveClass(/is-open/);
  });

  test("pressing Escape closes the mobile drawer", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    const burger = page.getByRole("button", { name: /abrir menú/i });
    await expect(burger).toBeVisible();
    await burger.click();

    const drawer = page.locator("#mobile-nav");
    await expect(drawer).toHaveClass(/is-open/);

    await page.keyboard.press("Escape");

    await expect(drawer).not.toHaveClass(/is-open/);
  });

  test("main and footer are inert when mobile menu is open", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    const burger = page.getByRole("button", { name: /abrir menú/i });
    await expect(burger).toBeVisible();
    await burger.click();

    await expect(page.locator("#mobile-nav")).toHaveClass(/is-open/);
    await expect(page.locator("main")).toHaveAttribute("inert", "");
    await expect(page.locator("footer")).toHaveAttribute("inert", "");
  });
});
