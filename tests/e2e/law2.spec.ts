import { test, expect } from '@playwright/test';
import { boot, letters, reload, st } from './helpers';

// L2.1-L2.8
test('LAW 2: Edit Name opens Bio editor; each save removes exactly one letter', async ({ page }) => {
  await boot(page);
  await page.getByTestId('edit-name').click();
  await expect(page.getByRole('dialog', { name: 'Edit bio' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Edit bio' })).toBeVisible();
  expect(await page.locator('input[type=text], input:not([type])').count()).toBe(0); // no name input anywhere

  // cancel erodes nothing
  let before = letters((await st(page)).texts);
  await page.getByTestId('bio-cancel').click();
  expect(letters((await st(page)).texts)).toBe(before);

  // 30 saves with unchanged text => exactly one letter removed each time
  for (let i = 0; i < 30; i++) {
    before = letters((await st(page)).texts);
    await page.getByTestId('edit-name').click();
    await page.getByTestId('bio-save').click();
    const after = letters((await st(page)).texts);
    expect(before - after).toBe(1);
  }
  expect((await st(page)).erosions.length).toBe(30);

  // law trigger labels stay intact
  await expect(page.getByTestId('change-photo')).toHaveText('Change Photo');
  await expect(page.getByTestId('edit-name')).toHaveText('Edit Name');
  await expect(page.getByTestId('follow-button')).toHaveText('Follow');

  // typed bio is saved (minus the eroded letter)
  await page.getByTestId('edit-name').click();
  await page.getByTestId('bio-input').fill('Zzzz qqqq xxxx wwww');
  await page.getByTestId('bio-save').click();
  const s1 = await st(page);
  expect(s1.texts.bio.replace(/\s/g, '').length).toBeGreaterThanOrEqual(15);

  const n = s1.erosions.length;
  await reload(page);
  expect((await st(page)).erosions.length).toBe(n); // persisted
});
