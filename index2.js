import { chromium } from "playwright";

(async () => {
  // Option A: Launch local headless Chromium (simplest in CodeSandbox)
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
  });

  // Create a new browser context
  const context = await browser.newContext();

  // Open a new page
  const page = await context.newPage();
  await page.goto("https://mannco.store");

  // Log the page title
  console.log(await page.title());

  // Close the browser
  await browser.close();
})();
