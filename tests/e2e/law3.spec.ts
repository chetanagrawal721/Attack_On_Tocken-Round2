import { test, expect } from '@playwright/test';
import { boot, count, setSt } from './helpers';

// L3.1-L3.5
test('LAW 3: follower count leaks on hover, click, inspect', async ({ page }) => {
  await boot(page);
  const el = page.getByTestId('follower-count');
  await expect(el).toHaveText('1,248');
  await el.hover();
  expect(await count(page)).toBe(1247);
  const box = (await el.boundingBox())!;
  await page.mouse.move(box.x + 4, box.y + 4); // move within: no change
  expect(await count(page)).toBe(1247);
  await page.mouse.move(5, 5);
  await el.hover(); // re-enter
  expect(await count(page)).toBe(1246);
  await el.click(); // already inside; the click itself is -1
  expect(await count(page)).toBe(1245);
  await el.click({ button: 'right' });
  expect(await count(page)).toBe(1244);
  const c = await count(page);
  await page.reload();
  expect(await count(page)).toBe(c); // persisted
});

test('LAW 3: floor at zero', async ({ page }) => {
  await boot(page);
  await setSt(page, { followers: 2 });
  const el = page.getByTestId('follower-count');
  for (let i = 0; i < 5; i++) await el.click({ button: 'right' });
  expect(await count(page)).toBe(0);
});

test('LAW 3: touch tap counts once', async ({ browser }) => {
  const ctx = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await boot(page);
  await page.getByTestId('follower-count').tap();
  expect(await count(page)).toBe(1247);
  await ctx.close();
});
