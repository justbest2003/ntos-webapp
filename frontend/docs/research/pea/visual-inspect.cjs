/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");

const playwrightModule = process.env.PLAYWRIGHT_MODULE;
if (!playwrightModule) {
  throw new Error("Set PLAYWRIGHT_MODULE to the absolute Playwright package path");
}

const { chromium } = require(playwrightModule);

const [url, outputDir, label, widthArg, heightArg] = process.argv.slice(2);
const width = Number(widthArg);
const height = Number(heightArg);

if (!url || !outputDir || !label || !width || !height) {
  throw new Error("Usage: node visual-inspect.cjs <url> <outputDir> <label> <width> <height>");
}

async function settle(page, delay = 1200) {
  await page.waitForTimeout(delay);
}

async function scrollThroughPage(page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page, 400);
  let lastHeight = 0;
  for (let step = 0; step < 80; step += 1) {
    const state = await page.evaluate(() => ({
      y: window.scrollY,
      height: document.documentElement.scrollHeight,
      viewport: window.innerHeight,
    }));
    if (state.y + state.viewport >= state.height - 4 && state.height === lastHeight) break;
    lastHeight = state.height;
    await page.mouse.wheel(0, Math.max(480, Math.floor(height * 0.72)));
    await settle(page, 180);
  }
  await settle(page, 1800);
}

async function inspectPage(page) {
  return page.evaluate(() => {
    const pickStyle = (element) => {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        tag: element.tagName.toLowerCase(),
        id: element.id,
        className: typeof element.className === "string" ? element.className : "",
        text: (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 180),
        rect: {
          x: Math.round(rect.x + window.scrollX),
          y: Math.round(rect.y + window.scrollY),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
        style: {
          display: style.display,
          position: style.position,
          fontFamily: style.fontFamily,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
          color: style.color,
          background: style.background,
          gap: style.gap,
          padding: style.padding,
          margin: style.margin,
          borderRadius: style.borderRadius,
          overflow: style.overflow,
        },
      };
    };

    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
    };

    const structural = Array.from(document.body.querySelectorAll("header, nav, main, main > *, body > section, footer"))
      .filter(visible)
      .slice(0, 80)
      .map(pickStyle);

    const images = Array.from(document.images).map((image) => {
      const rect = image.getBoundingClientRect();
      return {
        alt: image.alt,
        src: image.src,
        currentSrc: image.currentSrc,
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
        rect: {
          x: Math.round(rect.x + window.scrollX),
          y: Math.round(rect.y + window.scrollY),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
        objectFit: getComputedStyle(image).objectFit,
        objectPosition: getComputedStyle(image).objectPosition,
      };
    });

    const headings = Array.from(document.querySelectorAll("h1, h2, h3"))
      .filter(visible)
      .map(pickStyle);

    const overflowing = Array.from(document.querySelectorAll("body *"))
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.right > innerWidth + 1 || rect.left < -1;
      })
      .slice(0, 40)
      .map(pickStyle);

    return {
      url: location.href,
      title: document.title,
      viewport: { width: innerWidth, height: innerHeight },
      document: {
        width: document.documentElement.scrollWidth,
        height: document.documentElement.scrollHeight,
      },
      body: pickStyle(document.body),
      structural,
      headings,
      overflowing,
      images,
      fonts: document.fonts
        ? Array.from(document.fonts).map((font) => ({ family: font.family, weight: font.weight, style: font.style, status: font.status }))
        : [],
      stylesheets: Array.from(document.styleSheets).map((sheet) => sheet.href).filter(Boolean),
    };
  });
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    locale: "th-TH",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
  await settle(page, 5000);
  await page.screenshot({ path: path.join(outputDir, `${label}-top.png`) });
  await scrollThroughPage(page);
  const inspection = await inspectPage(page);
  await page.screenshot({ path: path.join(outputDir, `${label}-full.png`), fullPage: true });
  fs.writeFileSync(
    path.join(outputDir, `${label}-inspection.json`),
    JSON.stringify({ ...inspection, errors }, null, 2),
  );

  await browser.close();
  process.stdout.write(JSON.stringify({ label, title: inspection.title, document: inspection.document, images: inspection.images.length, errors: errors.length }));
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
