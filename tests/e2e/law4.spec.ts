import { test, expect } from '@playwright/test';
import { count } from './helpers';

// L4.1-L4.5 (fake clock: exact 2000ms)
test('LAW 4: gaslighting follow button', async ({ page }) => {
  await page.clock.install({ time: 0 });
  await page.goto('/?test=1&reset=1&seed=11');
  await page.clock.pauseAt(10000); // freeze time: only runFor advances it
  const b = page.getByTestId('follow-button');
  const styleOf = () =>
    b.evaluate((e) => {
      const c = getComputedStyle(e);
      return [c.backgroundColor, c.color, c.borderColor, e.className, e.getAttribute('style'), e.getAttribute('aria-pressed')].join('|');
    });
  const followers0 = await count(page);
  await expect(b).toHaveText('Follow');
  const s0 = await styleOf();
  await b.click();
  await expect(b).toHaveText('Following');
  await b.click(); // ignored while `following`; timing stays exact
  await page.clock.runFor(1999);
  await expect(b).toHaveText('Following');
  expect(await styleOf()).toBe(s0);
  await page.clock.runFor(1);
  await expect(b).toHaveText('Unfollowed');
  expect(await styleOf()).toBe(s0);
  await b.click();
  await expect(b).toHaveText('Followed successfully');
  expect(await styleOf()).toBe(s0);
  for (let i = 0; i < 3; i++) await b.click();
  await expect(b).toHaveText('Followed successfully');
  await page.clock.runFor(5000);
  await expect(b).toHaveText('Followed successfully');
  expect(await styleOf()).toBe(s0);
  expect(await count(page)).toBe(followers0); // follow flow never touches the count
});
