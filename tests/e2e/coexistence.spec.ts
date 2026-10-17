import { test, expect, type Page } from '@playwright/test';
import { boot, count, goTab, letters, setSt, st } from './helpers';

const IDS = ['darkMode', 'emailNotifications', 'onlineStatus', 'twoFactor', 'autoplay', 'haloAgent'];

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

async function waitIdle(page: Page) {
  await expect.poll(async () => (await st(page)).cinematic, { timeout: 30000 }).toBe(null);
  await expect.poll(async () => (await st(page)).rearranged, { timeout: 15000 }).toBe(false);
}

test('MONKEY: 300 random interactions, then every law still holds', async ({ page }) => {
  test.setTimeout(240000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(m.text()); });
  await boot(page);
  const rnd = lcg(42);

  for (let i = 0; i < 300; i++) {
    const r = rnd();
    if (r < 0.06) { await page.keyboard.press('Escape'); continue; }
    if (r < 0.1) { await page.mouse.move(rnd() * 1200, rnd() * 800); continue; }
    await page.evaluate((x) => {
      const els = Array.from(document.querySelectorAll<HTMLElement>('button, [role=tab], [role=switch], [data-testid=follower-count]'))
        .filter((e) => {
          const b = e.getBoundingClientRect();
          return b.width > 0 && b.height > 0 && !(e as HTMLButtonElement).disabled && e.dataset.testid !== 'start-over' && e.dataset.testid !== 'profile-faq' && e.dataset.testid !== 'revert-all';
        });
      if (els.length) els[Math.floor(x * els.length)].click();
    }, rnd());
    if (i % 25 === 0) await page.waitForTimeout(120);
  }
  await page.keyboard.press('Escape');
  await waitIdle(page);
  await page.waitForTimeout(500);

  // invariants
  const s = await st(page);
  expect(Number.isInteger(s.followers) && s.followers >= 0).toBe(true);
  expect(s.profile.displayName.trim().length).toBeGreaterThan(0);
  expect(Object.keys(s.settings).length).toBe(6);
  await expect(page.locator('#root')).not.toBeEmpty();
  expect(await page.locator('.scrim').count()).toBeLessThanOrEqual(1);

  // re-verify law 5 (clicked never changes; exactly one other flips)
  await page.keyboard.press('Escape');
  await page.evaluate(() => { document.querySelectorAll('.scrim').forEach((e) => e.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))); });
  await goTab(page, 'settings');
  for (const id of IDS) {
    const b = (await st(page)).settings;
    await page.getByTestId(`setting-${id}`).click();
    const a = (await st(page)).settings;
    expect(a[id]).toBe(b[id]);
    expect(IDS.filter((k) => a[k] !== b[k]).length).toBe(1);
  }
  // re-verify law 3 (hover -1 + right-click -1)
  await goTab(page, 'overview');
  await setSt(page, { followers: 500 });
  await page.getByTestId('follower-count').click({ button: 'right' });
  expect(await count(page)).toBe(498);
  // re-verify law 1
  const nm = await page.getByTestId('display-name').innerText();
  await page.getByTestId('change-photo').click();
  await expect(page.getByTestId('display-name')).not.toHaveText(nm, { timeout: 3000 });
  // re-verify law 2 (exactly one letter per save)
  const before = letters((await st(page)).texts);
  await page.getByTestId('edit-name').click();
  await page.getByTestId('bio-save').click();
  expect(before - letters((await st(page)).texts)).toBe(1);
  // re-verify law 4 labels (reset phase, then sequence)
  await setSt(page, { followPhase: 'follow' });
  await page.getByTestId('follow-button').click();
  await expect(page.getByTestId('follow-button')).toHaveText('Following');
  await expect(page.getByTestId('follow-button')).toHaveText('Unfollowed', { timeout: 3500 });
  await page.getByTestId('follow-button').click();
  await expect(page.getByTestId('follow-button')).toHaveText('Followed successfully');
  expect(errors).toEqual([]);
});

test('SAFETY: no external requests, downloads, dialogs or mailto', async ({ page }) => {
  const external: string[] = [];
  let dialogs = 0, downloads = 0;
  page.on('request', (r) => { const u = new URL(r.url()); if (!['localhost', '127.0.0.1'].includes(u.hostname) && !r.url().startsWith('data:') && !r.url().startsWith('blob:')) external.push(r.url()); });
  page.on('dialog', (d) => { dialogs++; d.dismiss(); });
  page.on('download', () => downloads++);
  await boot(page);
  await page.getByTestId('resume-btn').click();
  await page.getByTestId('email-btn').click();
  await page.getByTestId('call-accept').click();
  await expect.poll(async () => (await st(page)).cinematic, { timeout: 45000 }).toBe(null);
  await goTab(page, 'cases');
  await page.getByTestId('view-files').click();
  await expect(page.getByTestId('tab-settings')).toHaveAttribute('aria-selected', 'true', { timeout: 20000 });
  expect(await page.locator('a[href^="mailto:"]').count()).toBe(0);
  expect(external).toEqual([]);
  expect(dialogs).toBe(0);
  expect(downloads).toBe(0);
});
