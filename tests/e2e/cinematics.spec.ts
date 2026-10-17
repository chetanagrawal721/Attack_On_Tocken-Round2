import { test, expect } from '@playwright/test';
import { boot, goTab, reload, setSt, st } from './helpers';

test('CALL: Email rings (caller tone), Accept plays the whole video, plane crashes, back on the profile', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await boot(page);
  await page.getByTestId('email-btn').click();
  await expect(page.getByTestId('call-sheet')).toBeVisible();
  await expect(page.getByTestId('call-sheet')).toHaveAttribute('data-ring', 'on', { timeout: 4000 }); // ringtone started
  await page.getByTestId('call-accept').click();
  await expect(page.getByTestId('call-full')).toBeVisible();
  await expect(page.getByTestId('call-sheet')).toHaveCount(0);
  await page.keyboard.press('Escape'); // the video cannot be skipped
  await page.waitForTimeout(1200);
  await expect(page.getByTestId('call-full')).toBeVisible();
  await expect(page.getByTestId('plane-crash')).toBeVisible({ timeout: 45000 });
  await expect.poll(async () => (await st(page)).cinematic, { timeout: 45000 }).toBe(null);
  await expect(page.getByTestId('tab-overview')).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByTestId('follower-count')).toBeVisible();
  const s = await st(page);
  expect(s.flags.videoSeen).toBe(true);
  expect(s.gravity).toBe(false);
  await page.getByTestId('tab-activity').click();
  await expect(page.getByText('did not consent').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('CALL: Decline also connects and plays the video', async ({ page }) => {
  await boot(page);
  await page.getByTestId('email-btn').click();
  await page.getByTestId('call-decline').click();
  await expect(page.getByTestId('call-full')).toBeVisible({ timeout: 5000 });
  await expect(page.getByTestId('plane-crash')).toBeVisible({ timeout: 45000 });
  await expect.poll(async () => (await st(page)).cinematic, { timeout: 45000 }).toBe(null);
});

test('CALL: missing video file falls back gracefully, plane still crashes (no crash of the app)', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('**/media/intrusion.*', (r) => r.fulfill({ status: 404, body: 'nope' }));
  await boot(page);
  await page.getByTestId('email-btn').click();
  await page.getByTestId('call-accept').click();
  await expect(page.getByTestId('video-fallback')).toBeVisible({ timeout: 6000 });
  await expect(page.getByTestId('plane-crash')).toBeVisible({ timeout: 15000 });
  await expect.poll(async () => (await st(page)).cinematic, { timeout: 45000 }).toBe(null);
  await expect(page.getByTestId('tab-overview')).toHaveAttribute('aria-selected', 'true');
  expect(errors).toEqual([]);
});

test('TIDY-UP: Halo declutters, restores, navigates to Settings, persists consequences', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await boot(page);
  await goTab(page, 'cases');
  await expect(page.getByTestId('file-count')).toHaveText('12 files');
  await page.getByTestId('view-files').click();
  await expect(page.getByTestId('file-panel')).toBeVisible();
  await expect(page.getByTestId('tidy-caption')).toContainText('No joy');
  await page.waitForFunction(() => !!document.querySelector('.gravity'), null, { timeout: 8000 }); // layout falls
  await page.waitForFunction(() => !!document.querySelector('[data-testid=system-restored]'), null, { polling: 'raf', timeout: 15000 });
  await expect(page.getByTestId('tab-settings')).toHaveAttribute('aria-selected', 'true', { timeout: 8000 });
  await expect(page.getByTestId('setting-haloAgent')).toHaveAttribute('aria-checked', 'true');
  await expect(page.getByText('You enabled this.')).toBeVisible();
  await expect(page.locator('.gravity')).toHaveCount(0);
  await expect(page.getByTestId('avatar')).toBeVisible();
  await reload(page, '#cases');
  await expect(page.getByTestId('file-count')).toHaveText('11 files');
  expect(errors).toEqual([]);
});

test('FINALE: banner, diff, revert -> visitor identity, start over restores Morgan', async ({ page }) => {
  await boot(page);
  const flags = (await st(page)).flags;
  await setSt(page, { entropy: 70, flags: { ...flags, bannerShown: true } });
  await expect(page.getByTestId('finale-banner')).toBeVisible();
  await page.getByTestId('review-changes').click();
  await expect(page.getByTestId('finale-diff')).toContainText('name: Morgan Vale');
  await page.getByTestId('revert-all').click();
  await expect(page.getByTestId('display-name')).toHaveText('You (Visitor)', { timeout: 6000 });
  await expect(page.getByTestId('follower-count')).toHaveText('0');
  await expect(page.locator('.headline')).toContainText("on a stranger's profile");
  await page.getByTestId('start-over').click();
  await expect(page.getByTestId('display-name')).toHaveText('Morgan Vale');
  await expect(page.getByTestId('follower-count')).toHaveText('1,248');
});

test('CHAOS: DELETE morphs to DELIGHT; Résumé pipeline ends blank; Message goes quiet; Views lie', async ({ page }) => {
  await boot(page);
  await page.getByTestId('resume-btn').click();
  await expect(page.getByText('resume_FINAL_v7.pdf · 0 bytes')).toBeVisible({ timeout: 8000 });
  await page.getByRole('button', { name: 'Open' }).click();
  await expect(page.getByTestId('resume-paper')).toContainText('Intentionally left blank by Halo.');
  await page.keyboard.press('Escape');

  await page.getByTestId('views-stat').click();
  await expect(page.getByTestId('views-popover')).toContainText('Halo');
  await expect(page.getByTestId('views-count')).toHaveText('4');

  await page.getByTestId('message-btn').click();
  await page.getByTestId('chat-input').fill('hello');
  await page.getByTestId('chat-send').click();
  await expect(page.getByText('Seen')).toBeVisible();
  await expect(page.getByTestId('typing')).toBeVisible();
  await page.getByTestId('chat-sheet').getByRole('button', { name: 'Close' }).click();

  await goTab(page, 'settings');
  await page.getByTestId('delete-account').click();
  await page.getByTestId('delete-input').fill('delete');
  await expect(page.getByTestId('delete-input')).toHaveValue('DELIGHT', { timeout: 4000 });
  await page.getByTestId('delete-confirm').click();
  await expect(page.getByText('Account delighted ✓')).toBeVisible();
});
