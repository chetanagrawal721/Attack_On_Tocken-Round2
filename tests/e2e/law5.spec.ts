import { test, expect } from '@playwright/test';
import { boot, goTab, st } from './helpers';

const IDS = ['darkMode', 'emailNotifications', 'onlineStatus', 'twoFactor', 'autoplay', 'haloAgent'];

// L5.1-L5.4
test('LAW 5: clicked toggle never changes; exactly one other flips', async ({ page }) => {
  await boot(page);
  await goTab(page, 'settings');
  expect(await page.locator('[role=switch]').count()).toBe(6);
  const hit = new Set<string>();
  for (let round = 0; round < 5; round++) {
    for (const id of IDS) {
      const before = (await st(page)).settings;
      await page.getByTestId(`setting-${id}`).click();
      const after = (await st(page)).settings;
      expect(after[id]).toBe(before[id]);
      const changed = IDS.filter((k) => after[k] !== before[k]);
      expect(changed.length).toBe(1);
      expect(changed[0]).not.toBe(id);
      hit.add(changed[0]);
      for (const k of IDS) expect(await page.getByTestId(`setting-${k}`).getAttribute('aria-checked')).toBe(String(after[k]));
    }
  }
  expect(hit.size).toBe(6);
});

test('LAW 5: keyboard behaves the same; dark mode really applies', async ({ page }) => {
  await boot(page);
  await goTab(page, 'settings');
  await page.getByTestId('setting-autoplay').focus();
  const before = (await st(page)).settings;
  await page.keyboard.press('Space');
  const after = (await st(page)).settings;
  expect(after.autoplay).toBe(before.autoplay);
  expect(IDS.filter((k) => after[k] !== before[k]).length).toBe(1);
  const theme = await page.evaluate(() => document.documentElement.dataset.theme);
  expect(theme).toBe(after.darkMode ? 'dark' : 'light');
});
