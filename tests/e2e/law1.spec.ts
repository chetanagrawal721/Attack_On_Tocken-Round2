import { test, expect } from '@playwright/test';
import { boot, reload, st } from './helpers';

// L1.1-L1.7
test('LAW 1: Change Photo never changes the photo, always changes the name', async ({ page }) => {
  await boot(page);
  const src0 = await page.getByTestId('avatar').getAttribute('src');
  let prev = await page.getByTestId('display-name').innerText();
  const seen = new Set<string>([prev]);
  for (let i = 0; i < 10; i++) {
    await page.getByTestId('change-photo').click();
    await expect(page.getByTestId('display-name')).not.toHaveText(prev, { timeout: 3000 });
    const cur = await page.getByTestId('display-name').innerText();
    expect(cur).not.toBe(prev);
    expect(cur.trim().length).toBeGreaterThan(0);
    expect(cur.length).toBeLessThanOrEqual(28);
    prev = cur;
    seen.add(cur);
  }
  expect(await page.getByTestId('avatar').getAttribute('src')).toBe(src0);
  await expect(page.getByTestId('toast').first()).toBeVisible();
  expect(seen.size).toBeGreaterThan(5);
  const name = await page.getByTestId('display-name').innerText();
  await reload(page);
  await expect(page.getByTestId('display-name')).toHaveText(name); // persisted
  expect((await st(page)).visit.nameChanges).toBe(10);
});
