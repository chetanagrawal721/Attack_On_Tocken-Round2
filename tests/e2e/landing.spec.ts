import { test, expect } from '@playwright/test';
import { landingUrl } from './helpers';

test('LANDING: looks normal, no chaos visible, profile is not reachable directly', async ({ page }) => {
  await page.goto(landingUrl());
  await expect(page.getByTestId('landing')).toBeVisible();
  await expect(page.getByTestId('nav-profile')).toBeVisible();
  await expect(page.getByTestId('get-started')).toBeVisible();
  await expect(page.getByTestId('hero-faq')).toBeVisible();
  await expect(page.getByTestId('nav-faq')).toBeVisible();
  await expect(page.getByTestId('follower-count')).toHaveCount(0);
  const html = (await page.content()).toLowerCase();
  for (const w of ['chaos', 'prank', 'troll', 'gun', 'galat']) expect(html).not.toContain(w);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await page.screenshot({ path: 'proof/screens/v2-landing.png' });
});

test('LANDING: Profile button shows only the red alert (no video), then returns to landing', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(landingUrl());
  await page.getByTestId('nav-profile').click();
  await expect(page.getByTestId('red-alert')).toBeVisible();
  await expect(page.getByTestId('red-alert')).toContainText('YE NI DABANA THA');
  await expect.poll(() => page.evaluate(() => (window as any).__sfx.map((x: any) => x.name)), { timeout: 4000 }).toContain('profileAlert');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'proof/screens/v3-red-alert.png' });
  await expect(page.getByTestId('video-interrupt')).toHaveCount(0);
  await expect(page.getByTestId('red-alert')).toHaveCount(0, { timeout: 8000 });
  await expect(page.getByTestId('video-interrupt')).toHaveCount(0);
  await expect(page.getByTestId('landing')).toBeVisible();
  await expect(page.getByTestId('follower-count')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('LANDING: Get Started shows error windows, crashes, then returns to the landing page', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(landingUrl());
  await page.evaluate(() => {
    (window as any).__stages = [];
    new MutationObserver(() => {
      const v = document.querySelector('[data-testid=error-crash]')?.getAttribute('data-stage');
      const a = (window as any).__stages;
      if (v && a[a.length - 1] !== v) a.push(v);
    }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-stage'] });
  });
  await page.getByTestId('get-started').click();
  const crash = page.getByTestId('error-crash');
  await expect(crash).toBeVisible();
  await expect(crash).toHaveAttribute('data-stage', 'errors');
  await expect(page.locator('.errwin').nth(5)).toBeVisible({ timeout: 4000 });
  await page.screenshot({ path: 'proof/screens/v3-error-windows.png' });
  await expect(crash).toHaveCount(0, { timeout: 10000 });
  await expect(page.getByTestId('landing')).toBeVisible();
  await expect(page.getByTestId('follower-count')).toHaveCount(0); // profile only opens through the FAQ
  expect(await page.evaluate(() => (window as any).__stages)).toEqual(['errors', 'blue', 'crash', 'dead']);
  expect(errors).toEqual([]);
});

test('LANDING: FAQ -> fake deletion -> demand; No = gunfire + warning then asks again; Yes = profile', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(landingUrl());
  // record every stage the sequence passes through (short stages are easy to miss when polling)
  await page.evaluate(() => {
    (window as any).__stages = [];
    new MutationObserver(() => {
      const el = document.querySelector('[data-testid=faq-sequence]');
      const v = el?.getAttribute('data-stage');
      const a = (window as any).__stages;
      if (v && a[a.length - 1] !== v) a.push(v);
    }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-stage'] });
  });
  await page.getByTestId('hero-faq').click();
  await expect.poll(() => page.evaluate(() => (window as any).__sfx.map((x: any) => x.name)), { timeout: 4000 }).toContain('faqAlert');
  await expect(page.getByTestId('faq-sequence')).toHaveAttribute('data-stage', 'delete', { timeout: 8000 });
  await page.screenshot({ path: 'proof/screens/v2-faq-delete.png' });
  await expect(page.getByTestId('faq-console')).toContainText('INTRUSION DETECTED');
  await expect(page.getByTestId('faq-console')).toContainText('[DEL]');
  const box = (await page.getByTestId('faq-console').boundingBox())!;
  expect(Math.abs(box.x + box.width / 2 - 720)).toBeLessThan(20); // centered
  await expect(page.getByTestId('faq-chaos')).toBeVisible({ timeout: 8000 });
  await page.screenshot({ path: 'proof/screens/v2-faq-chaos.png' });
  await expect(page.getByTestId('faq-ask')).toBeVisible({ timeout: 10000 });
  expect(await page.evaluate(() => (window as any).__stages)).toEqual(['loading', 'glitch', 'delete', 'black', 'chaos', 'ask']);
  await expect(page.getByTestId('faq-message')).toContainText('Attack on Token');
  await expect(page.getByTestId('faq-yes')).toBeVisible();
  await expect(page.getByTestId('faq-no')).toBeVisible();
  await page.screenshot({ path: 'proof/screens/v2-faq-ask.png' });

  // No -> simulated gunfire + gun sound -> warning popup -> the same Yes / No question again
  await expect(page.getByTestId('faq-warn')).toHaveCount(0);
  await page.getByTestId('faq-no').click();
  await expect(page.getByTestId('faq-sequence')).toHaveAttribute('data-stage', 'fire');
  // the warning is never shown while the gun is still firing
  expect(await page.evaluate(() => document.querySelector('[data-testid=faq-sequence]')?.getAttribute('data-stage') === 'fire' && !!document.querySelector('[data-testid=faq-warn]'))).toBe(false);
  await expect.poll(() => page.evaluate(() => (window as any).__sfx.map((x: any) => x.name)), { timeout: 4000 }).toContain('gunshot');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'proof/screens/v2-faq-fire.png' });
  await expect(page.getByTestId('faq-sequence')).toHaveAttribute('data-stage', 'ask', { timeout: 10000 });
  await expect(page.getByTestId('faq-warn')).toBeVisible();
  await expect(page.getByTestId('faq-warn')).toContainText('maar diye jaoge');
  await page.screenshot({ path: 'proof/screens/v2-faq-warning.png' });
  await expect(page.getByTestId('faq-yes')).toBeEnabled();
  await expect(page.getByTestId('faq-no')).toBeEnabled();
  await expect(page.getByTestId('follower-count')).toHaveCount(0);

  // Yes -> the existing profile opens
  await page.getByTestId('faq-yes').click();
  await expect(page.getByTestId('follower-count')).toBeVisible({ timeout: 5000 });
  await expect(page.getByTestId('follower-count')).toHaveText('1,248');
  await expect(page.getByTestId('follow-button')).toHaveText('Follow');
  expect(errors).toEqual([]);
});

test('LANDING: safety - no external requests, dialogs or downloads', async ({ page }) => {
  const external: string[] = [];
  let bad = 0;
  page.on('request', (r) => { const u = new URL(r.url()); if (!['localhost', '127.0.0.1'].includes(u.hostname) && !/^(data|blob):/.test(r.url())) external.push(r.url()); });
  page.on('dialog', (d) => { bad++; d.dismiss(); });
  page.on('download', () => bad++);
  await page.goto(landingUrl());
  await page.getByTestId('hero-faq').click();
  await expect(page.getByTestId('faq-ask')).toBeVisible({ timeout: 15000 });
  await page.getByTestId('faq-yes').click();
  await expect(page.getByTestId('follower-count')).toBeVisible();
  expect(external).toEqual([]);
  expect(bad).toBe(0);
});
