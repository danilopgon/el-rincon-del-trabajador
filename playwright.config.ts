import { defineConfig, devices } from "@playwright/test";

const previewHost = process.env.CI ? "127.0.0.1" : "localhost";
const previewUrl = `http://${previewHost}:4321`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: previewUrl,
    trace: "on-first-retry",
    reducedMotion: "reduce",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: process.env.CI ? "pnpm preview -- --host 127.0.0.1" : "pnpm dev",
    url: previewUrl,
    reuseExistingServer: !process.env.CI,
  },
});
