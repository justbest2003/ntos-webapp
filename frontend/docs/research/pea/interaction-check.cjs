/* eslint-disable @typescript-eslint/no-require-imports */
const playwrightModule = process.env.PLAYWRIGHT_MODULE;
if (!playwrightModule) throw new Error("Set PLAYWRIGHT_MODULE");
const { chromium } = require(playwrightModule);

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "เปิดเมนู" }).click();
  const menuVisible = await page.locator(".primary-nav").evaluate((node) => getComputedStyle(node).display !== "none");
  await page.getByRole("tab", { name: "ลูกค้าธุรกิจ/อุตสาหกรรม/ราชการ" }).click();
  const selectedTab = await page.getByRole("tab", { name: "ลูกค้าธุรกิจ/อุตสาหกรรม/ราชการ" }).getAttribute("aria-selected");
  await page.getByRole("button", { name: "ปิด", exact: true }).click();
  const cookieHidden = await page.locator(".cookie-banner").count() === 0;
  const geometry = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
  const failedImages = await page.locator("img").evaluateAll((images) => images.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.getAttribute("src")));

  await browser.close();
  const result = { menuVisible, selectedTab, cookieHidden, geometry, failedImages, errors };
  process.stdout.write(JSON.stringify(result));
  if (!menuVisible || selectedTab !== "true" || !cookieHidden || geometry.width !== geometry.scrollWidth || failedImages.length || errors.length) process.exitCode = 1;
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
