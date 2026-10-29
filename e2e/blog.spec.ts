import { test, expect } from "@playwright/test";

test.describe("Blog", () => {
  test("blog index lists posts", async ({ page }) => {
    await page.goto("/blog/");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const articles = page.locator("main article");
    await expect(articles.first()).toBeVisible();
    await expect(articles.first().locator("a").first()).toHaveAttribute(
      "href",
      /^\/blog\/[^/]+\/$/
    );
  });

  test("blog post has title, canonical and contact CTA", async ({ page }) => {
    await page.goto("/blog/");
    const href = await page.locator("main article a").first().getAttribute("href");
    await page.goto(href!);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /^https:\/\/elrincondeltrabajador\.com\/blog\/[^/]+\/$/
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
    await expect(page.locator('#contacto a[href^="https://wa.me/"]')).toBeAttached();
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(jsonLd.some((text) => text.includes('"BlogPosting"'))).toBe(true);
  });
});

test.describe("Blog navigation", () => {
  test("section links from a blog post go back to the home page", async ({ page }) => {
    await page.goto("/blog/");
    const href = await page.locator("main article a").first().getAttribute("href");
    await page.goto(href!);

    const nav = page.locator(".hdr__nav");
    await expect(nav.getByRole("link", { name: "Servicios" })).toHaveAttribute(
      "href",
      "/#servicios"
    );
    await expect(page.locator("footer").getByRole("link", { name: "Industria" })).toHaveAttribute(
      "href",
      "/#sectores"
    );

    await nav.getByRole("link", { name: "Servicios" }).click();
    await expect(page).toHaveURL(/\/#servicios$/);
    await expect(page.locator("#servicios")).toBeVisible();
  });
});
