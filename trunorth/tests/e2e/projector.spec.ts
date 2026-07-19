import { test, expect, type Page } from "@playwright/test";

/**
 * Projector-resolution verification.
 *
 *   Master spec §13A.6  — "Screen resolution / aspect ratio of the venue projector (often
 *                          16:9, sometimes 4:3 or 1024×768) — the showcase scene must look
 *                          right there."
 *   Master spec §13A.8  — "[ ] Showcase scene verified at the venue's projector resolution."
 *   Master spec §13A.4  — readable from 50 feet.
 *   Consolidated §6.1   — "Verify at 1024×768, 1366×768, 1920×1080, and projector mirror mode."
 *   Consolidated §6.6   — "Test the showcase scene at 1024×768 and 1920×1080."
 *
 * ⚠️ HONEST SCOPE — two things this suite does NOT do.
 *
 * 1. **It is not the venue.** §13A.6 asks the team to *confirm the actual projector spec
 *    before the day*; this asserts the scene survives the resolutions the spec names as
 *    likely. If the venue turns out to be something else (or overscans, or mirrors at a
 *    different aspect), that is still a physical rehearsal task.
 * 2. **The §17B.7 letterbox lock is only half-built.** Measuring it here settled what the
 *    ledger had recorded as an open question: the `--px` size container *does* hold the
 *    stage at 16:9 (1024×768 → a 1024×576 stage), so the scene is never stretched. What
 *    is still missing is the explicit letterbox treatment — the leftover space is page
 *    background, not styled `.letterbox-bar` per Consolidated §6.1.
 *
 * 3. **Measured gap this suite surfaced (recorded, not asserted as a failure):** the
 *    decision overlay is a FIXED-SIZE DOM panel — the choice button measures 452×64px and
 *    16px text at 1024×768, 1366×768 *and* 1920×1080 alike. It does not scale with the
 *    stage the way characters/HUD do. It sits exactly on the §17A.4 64px floor at every
 *    resolution, so it passes — but on a large venue projector the most important surface
 *    in the demo is proportionally the *smallest* it ever gets, which cuts against §13A.4
 *    "readable from 50 feet". Tracked as a gap in `product.md` §5; the floor assertions
 *    below will fail immediately if it ever shrinks further.
 */

/** The resolutions Consolidated §6.1 names, plus the 4:3 case §13A.6 warns about. */
const PROJECTOR_MODES = [
  { name: "1024×768 (4:3 projector)", width: 1024, height: 768 },
  { name: "1366×768 (common laptop/projector mirror)", width: 1366, height: 768 },
  { name: "1920×1080 (16:9 venue standard)", width: 1920, height: 1080 },
];

/**
 * §13A.4 "readable from 50 feet". A hard px floor is the only machine-checkable proxy.
 * 12px is not "readable from 50 feet" on its own — it is the floor below which the claim
 * is definitely false. The real check is a human standing at the back of the room.
 */
const MIN_LEGIBLE_PX = 12;

async function clickText(page: Page, pattern: RegExp, timeout = 10_000): Promise<void> {
  const target = page.getByRole("button", { name: pattern }).first();
  await target.waitFor({ state: "visible", timeout });
  await target.click();
}

async function clickIfPresent(page: Page, pattern: RegExp, timeout = 2_500): Promise<boolean> {
  const target = page.getByRole("button", { name: pattern }).first();
  try {
    await target.waitFor({ state: "visible", timeout });
    await target.click();
    return true;
  } catch {
    return false;
  }
}

async function bootToShowcaseScene(page: Page): Promise<void> {
  await page.goto("/?demo=1");
  await clickText(page, /Play Now/i);
  await clickIfPresent(page, /I understand/i);
  if (await clickIfPresent(page, /Dragon \(Flicker\)/i)) {
    await clickText(page, /^Next$/i);
    await clickText(page, /Start Adventure/i);
  }
  await expect(page.getByText(/Your Journey/i)).toBeVisible({ timeout: 10_000 });

  await clickText(page, /Everbright Meadow/i);
  if (!(await clickIfPresent(page, /Skip and start playing/i))) {
    await clickText(page, /Sunny and bright|A few clouds|I try it anyway|ask someone/i);
    await clickIfPresent(page, /Skip and start playing/i, 5_000);
  }
  await expect(page.getByText(/Move: WASD/i)).toBeVisible({ timeout: 15_000 });
}

test.describe("Projector resolutions (spec §13A.6, §13A.8, Consolidated §6.1/§6.6)", () => {
  for (const mode of PROJECTOR_MODES) {
    test(`showcase scene renders correctly at ${mode.name}`, async ({ page }) => {
      await page.setViewportSize({ width: mode.width, height: mode.height });
      await bootToShowcaseScene(page);

      // 1. No page-level overflow. A projector cannot be scrolled mid-demo, so anything
      //    off-canvas is simply lost to the audience.
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        scrollHeight: document.documentElement.scrollHeight,
        clientHeight: document.documentElement.clientHeight,
      }));
      expect(
        overflow.scrollWidth,
        `horizontal overflow: content ${overflow.scrollWidth}px in ${overflow.clientWidth}px viewport`,
      ).toBeLessThanOrEqual(overflow.clientWidth + 1);
      expect(
        overflow.scrollHeight,
        `vertical overflow: content ${overflow.scrollHeight}px in ${overflow.clientHeight}px viewport`,
      ).toBeLessThanOrEqual(overflow.clientHeight + 1);

      // 2. The stage itself is fully inside the viewport.
      const stage = page.locator(".game-viewport").first();
      await expect(stage).toBeVisible();
      const box = await stage.boundingBox();
      expect(box, "stage has no layout box").not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(-1);
      expect(box!.y).toBeGreaterThanOrEqual(-1);
      expect(box!.x + box!.width).toBeLessThanOrEqual(mode.width + 1);
      expect(box!.y + box!.height).toBeLessThanOrEqual(mode.height + 1);

      // 2b. The stage holds 16:9 and is never stretched (Consolidated §6.1 "do not
      //     stretch"). This is what keeps the 4:3 projector case safe.
      const aspect = box!.width / box!.height;
      expect(
        Math.abs(aspect - 16 / 9),
        `stage aspect ${aspect.toFixed(3)} at ${mode.name} — expected 16:9, scene is being stretched`,
      ).toBeLessThan(0.02);

      // 3. The HUD (skill meters) — the thing §13A.4 explicitly wants legible from the
      //    back of the room — is on screen, not clipped off the edge.
      const hud = page.locator('[aria-label="Skill meters"]').first();
      await expect(hud).toBeVisible();
      const hudBox = await hud.boundingBox();
      expect(hudBox!.x + hudBox!.width).toBeLessThanOrEqual(mode.width + 1);
      expect(hudBox!.y + hudBox!.height).toBeLessThanOrEqual(mode.height + 1);

      // 4. The decision overlay — the beat the audience is watching — is fully visible
      //    and its choice text clears the legibility floor.
      await clickText(page, /Interact with hot spot/i, 15_000);
      const choice = page.getByRole("button", { name: /want to play with us/i });
      await expect(choice).toBeVisible({ timeout: 15_000 });

      const choiceBox = await choice.boundingBox();
      expect(choiceBox!.x).toBeGreaterThanOrEqual(-1);
      expect(choiceBox!.y).toBeGreaterThanOrEqual(-1);
      expect(
        choiceBox!.y + choiceBox!.height,
        `choice button runs past the bottom of a ${mode.height}px screen`,
      ).toBeLessThanOrEqual(mode.height + 1);

      const fontPx = await choice.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
      expect(
        fontPx,
        `choice text is ${fontPx}px at ${mode.name} — below the §13A.4 legibility floor`,
      ).toBeGreaterThanOrEqual(MIN_LEGIBLE_PX);

      // 5. Hit targets: §17A.4 requires 64px minimum for the Ch.1 (ages 5–7) band. The
      //    projector case is where a shrinking layout would quietly violate it.
      expect(
        choiceBox!.height,
        `choice hit target is ${choiceBox!.height}px at ${mode.name} — §17A.4 wants ≥64px for Ch.1`,
      ).toBeGreaterThanOrEqual(64);
    });
  }

  test("initial showcase load stays inside the §13A.5 budget", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    const started = Date.now();
    await page.goto("/?demo=1");
    await page.getByRole("button", { name: /Play Now/i }).first().waitFor({ state: "visible" });
    const loadMs = Date.now() - started;

    // §19: "Initial showcase load < 3 s on demo laptop after static server start."
    console.log(`initial load to interactive: ${loadMs}ms (§19 budget: 3000ms)`);
    expect(loadMs, "initial load exceeded the §19 3s budget").toBeLessThan(3000);
  });
});
