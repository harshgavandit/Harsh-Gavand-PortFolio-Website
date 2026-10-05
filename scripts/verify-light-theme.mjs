import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_EXECUTABLE,
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
const out = new URL("../verification/light-theme/", import.meta.url);
mkdirSync(out, { recursive: true });
await page.goto(process.env.PORTFOLIO_URL || "http://127.0.0.1:4175/", {
  waitUntil: "networkidle",
});
await page.evaluate(() => document.fonts.ready);
await page.screenshot({
  path: new URL("desktop-hero.png", out).pathname.slice(1),
});
for (const id of [
  "projects",
  "about",
  "experience",
  "all-projects",
  "skills",
  "workflow",
  "contact",
]) {
  await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({
    path: new URL(`desktop-${id}.png`, out).pathname.slice(1),
  });
}
const responsive = [];
for (const width of [320, 375, 430, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: 950 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(400);
  const layout = await page.evaluate(() => ({
    width: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    background: getComputedStyle(document.body).backgroundColor,
    heroBackground: getComputedStyle(document.documentElement).backgroundColor,
    text: getComputedStyle(document.body).color,
    sections: [...document.querySelectorAll("main > section")].map((el) => ({
      id: el.id,
      background: getComputedStyle(el).backgroundColor,
    })),
    overflow: [...document.querySelectorAll("main *")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width && (r.right > innerWidth + 1 || r.left < -1);
      })
      .map((el) => ({ tag: el.tagName, class: el.className }))
      .slice(0, 12),
  }));
  responsive.push(layout);
  if (width === 375)
    await page.screenshot({
      path: new URL("mobile-hero.png", out).pathname.slice(1),
      fullPage: false,
    });
}
writeFileSync(
  new URL("responsive.json", out),
  JSON.stringify(responsive, null, 2),
);
console.log(JSON.stringify({ responsive, errors }, null, 2));
await page.setViewportSize({ width: 1440, height: 1000 });
await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
let accessibility = [];
for (const width of [1440, 375]) {
  await page.setViewportSize({ width, height: 950 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(400);
  const result = await page.evaluate(async () => {
    const r = await window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
    });
    return {
      violations: r.violations,
      passes: r.passes.length,
      incomplete: r.incomplete.map((x) => ({
        id: x.id,
        nodes: x.nodes.map((n) => n.target),
      })),
    };
  });
  accessibility.push({ width, ...result });
}
writeFileSync(
  new URL("accessibility.json", out),
  JSON.stringify(accessibility, null, 2),
);
console.log(
  "AXE",
  JSON.stringify(
    accessibility.map((a) => ({
      width: a.width,
      passes: a.passes,
      violations: a.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    })),
    null,
    2,
  ),
);
const interactions = [];
async function check(name, run) {
  await run();
  interactions.push({ name, passed: true });
  console.log("PASS", name);
}
await page.setViewportSize({ width: 1440, height: 1000 });
await check(
  "Project search, empty state, reset and category filters",
  async () => {
    const search = page.getByRole("searchbox", { name: "Search projects" });
    await search.fill("WebRTC");
    assert.equal(await page.locator(".archive-card").count(), 1);
    assert.equal(
      await page.locator(".archive-card h3").textContent(),
      "Zoom Clone",
    );
    await search.fill("no-match-for-this-project");
    assert.equal(await page.locator(".archive-card").count(), 0);
    await page.getByRole("button", { name: "Reset filters" }).click();
    assert.equal(await page.locator(".archive-card").count(), 6);
    assert.ok(await search.evaluate((el) => el === document.activeElement));
    for (const name of ["AI & ML", "Web & SaaS", "APIs & Tools", "All"]) {
      const button = page.getByRole("button", { name, exact: true });
      await button.click();
      assert.equal(await button.getAttribute("aria-pressed"), "true");
      assert.ok((await page.locator(".archive-card").count()) > 0);
    }
  },
);
await check(
  "Show more reveals all 22 archive projects and preserves focus",
  async () => {
    for (const total of [12, 18, 22]) {
      await page.getByRole("button", { name: "Show more projects" }).click();
      assert.equal(await page.locator(".archive-card").count(), total);
      assert.ok(
        await page.evaluate(() =>
          document.activeElement?.matches(".archive-card h3"),
        ),
      );
    }
    assert.equal(
      await page.getByRole("button", { name: "Show more projects" }).count(),
      0,
    );
  },
);
await check("Implementation details open and close by keyboard", async () => {
  const details = page.locator(".case-study .project-details").first();
  await details.locator("summary").click();
  assert.ok(await details.evaluate((el) => el.open));
  await details.locator("summary").press("Enter");
  assert.equal(await details.evaluate((el) => el.open), false);
});
await check("Walkthrough chapters and playback controls work", async () => {
  const study = page.locator(".case-study").first();
  const chapters = study.locator(".walkthrough-chapters button");
  await chapters.nth(1).click();
  assert.equal(await chapters.nth(1).getAttribute("aria-pressed"), "true");
  assert.ok(
    (await study.locator(".walkthrough-detail-label").textContent()).includes(
      (await chapters.nth(1).locator("span").nth(1).textContent()).trim(),
    ),
  );
  await study.getByRole("button", { name: /Play walkthrough for/ }).click();
  assert.equal(
    await study.getByRole("button", { name: /Pause walkthrough for/ }).count(),
    1,
  );
  await study.getByRole("button", { name: /Pause walkthrough for/ }).click();
});
await check(
  "Workflow stage selection and keyboard navigation work",
  async () => {
    const testing = page.getByRole("button", {
      name: "Explore Testing, stage 5 of 6",
      exact: true,
    });
    await testing.click();
    assert.equal(await testing.getAttribute("aria-pressed"), "true");
    await testing.press("ArrowRight");
    assert.equal(
      await page
        .getByRole("button", {
          name: "Explore Deployment, stage 6 of 6",
          exact: true,
        })
        .getAttribute("aria-pressed"),
      "true",
    );
  },
);
await check(
  "Contact validates required fields and generates the original email draft",
  async () => {
    await page.getByRole("button", { name: "Prepare email draft" }).click();
    assert.equal(
      await page.getByRole("link", { name: "Open email app to send" }).count(),
      0,
    );
    assert.ok(
      await page
        .locator('input[name="name"]')
        .evaluate((el) => el.matches(":invalid")),
    );
    await page.getByLabel("Your name").fill("Portfolio QA");
    await page
      .getByLabel("Email address", { exact: true })
      .fill("qa@example.com");
    await page.getByLabel("What’s on your mind?").fill("UI verification");
    await page
      .getByLabel("Tell me a little more")
      .fill("Checking the redesigned contact form.");
    await page.getByRole("button", { name: "Prepare email draft" }).click();
    const draft = await page
      .getByRole("link", { name: "Open email app to send" })
      .getAttribute("href");
    assert.ok(draft.startsWith("mailto:harsh.gavand.tech@gmail.com?"));
    assert.ok(decodeURIComponent(draft).includes("UI verification"));
    assert.ok(
      decodeURIComponent(draft).includes(
        "Checking the redesigned contact form.",
      ),
    );
    assert.ok(
      (await page.locator(".contact-notice").textContent()).includes(
        "Nothing has been sent",
      ),
    );
    await page.getByLabel("Your name").fill("Updated QA");
    assert.equal(
      await page.getByRole("link", { name: "Open email app to send" }).count(),
      0,
    );
    await page
      .context()
      .grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.getByRole("button", { name: "Copy email address" }).click();
    assert.equal(
      await page.evaluate(() => navigator.clipboard.readText()),
      "harsh.gavand.tech@gmail.com",
    );
  },
);
await check(
  "Mobile navigation traps focus, closes with Escape and links to sections",
  async () => {
    await page.setViewportSize({ width: 375, height: 950 });
    await page.getByRole("button", { name: "Open navigation" }).click();
    assert.ok(await page.locator("#main").evaluate((el) => el.inert));
    const menu = page.locator("#mobile-navigation");
    await page.screenshot({
      path: new URL("mobile-navigation.png", out).pathname.slice(1),
    });
    await menu.locator("a").last().focus();
    await page.keyboard.press("Tab");
    assert.ok(
      await page
        .getByRole("button", { name: "Close navigation" })
        .evaluate((el) => el === document.activeElement),
    );
    await page.keyboard.press("Escape");
    assert.equal(await menu.count(), 0);
    assert.ok(
      await page
        .getByRole("button", { name: "Open navigation" })
        .evaluate((el) => el === document.activeElement),
    );
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .getByRole("navigation", { name: "Mobile navigation" })
      .getByRole("link", { name: /Skills/ })
      .click();
    assert.equal(await menu.count(), 0);
    assert.equal(new URL(page.url()).hash, "#skills");
    assert.equal(await page.locator("#main").evaluate((el) => el.inert), false);
    for (const id of ["projects", "all-projects", "skills", "contact"]) {
      await page
        .locator(`#${id}`)
        .evaluate((el) =>
          el.scrollIntoView({ block: "start", behavior: "instant" }),
        );
      await page.waitForTimeout(350);
      await page.screenshot({
        path: new URL(`mobile-${id}.png`, out).pathname.slice(1),
      });
    }
  },
);
await check(
  "Motion toggle and system reduced motion preserve manual exploration",
  async () => {
    await page.getByRole("button", { name: "Pause visual motion" }).click();
    assert.equal(await page.locator("html").getAttribute("data-motion"), "off");
    assert.ok(
      await page.locator(".walkthrough-playback button").first().isDisabled(),
    );
    const chapter = page.locator(".walkthrough-chapters button").first();
    await chapter.click();
    assert.equal(await chapter.getAttribute("aria-pressed"), "true");
    await page.getByRole("button", { name: "Enable visual motion" }).click();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(200);
    assert.equal(await page.locator("html").getAttribute("data-motion"), "off");
    assert.ok(
      await page
        .getByRole("button", {
          name: "Reduced motion follows your system preference",
        })
        .isDisabled(),
    );
    assert.equal(
      await page
        .locator("html")
        .evaluate((el) => getComputedStyle(el).scrollBehavior),
      "auto",
    );
  },
);
await check(
  "Unknown route returns to the portfolio and resume is served",
  async () => {
    const pdf = await page.request.get(
      new URL("/Harsh_Gavand_Resume.pdf", page.url()).href,
    );
    assert.equal(pdf.status(), 200);
    assert.equal((await pdf.body()).subarray(0, 5).toString(), "%PDF-");
    await page.goto(new URL("/unknown-page", page.url()).href);
    await page.getByRole("link", { name: /Back to the portfolio/ }).click();
    await page.waitForURL((url) => url.pathname === "/");
    await page.locator(".case-study").first().waitFor();
    assert.equal(await page.locator(".case-study").count(), 4);
  },
);
writeFileSync(
  new URL("interactions.json", out),
  JSON.stringify({ interactions, errors }, null, 2),
);
console.log("INTERACTIONS", interactions.length, "passed");
await browser.close();
assert.equal(errors.length, 0, "Browser runtime errors");
assert.ok(
  responsive.every((r) => r.documentWidth === r.width),
  "Horizontal overflow",
);
assert.ok(
  accessibility.every((a) => !a.violations.length),
  "Accessibility violations",
);
