import { test, expect } from '@playwright/test';
import { boot, count, goTab, setSt, st } from './helpers';

test('A/B VARIANTS: clicking a skill chip transforms the profile, then Variant A fully returns', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await boot(page);
  await page.waitForTimeout(1100); // let the entrance blur finish
  const before = await st(page);
  await page.getByTestId('chip-skill.1').click();
  await expect(page.getByTestId('incident-cinematic')).toBeVisible();
  await expect(page.getByTestId('incident-card')).toContainText('A/B testing');
  await expect(page.locator('.headline')).toContainText('Wizard', { timeout: 4000 });
  await expect(page.getByTestId('incident-variant')).toContainText('Variant');
  await expect(page.getByTestId('display-name')).not.toHaveText('Morgan Vale');
  await page.screenshot({ path: 'proof/screens/v2-incident.png' });
  await expect(page.getByTestId('incident-cinematic')).toHaveCount(0, { timeout: 15000 });
  await expect(page.locator('.headline')).toContainText('Principal Product Designer');
  await expect(page.getByTestId('display-name')).toHaveText('Morgan Vale');
  const after = await st(page);
  const drift = ['stat.followers', 'btn.message', 'tab.cases', 'tab.settings']; // labels may drift by design
  const strip = (t: Record<string, string>) => Object.fromEntries(Object.entries(t).filter(([k]) => !drift.includes(k)));
  expect(strip(after.texts)).toEqual(strip(before.texts)); // nothing else permanently changed
  expect(after.followers).toBe(before.followers);
  expect(after.followPhase).toBe(before.followPhase);
  expect(after.settings).toEqual(before.settings);
  expect(await page.locator('[data-glitch].variant-b, [data-glitch].variant-c, [data-glitch].variant-d').count()).toBe(0);
  expect(errors).toEqual([]);
});

test('RESHUFFLE: a harmless click rearranges the layout, then claims it never did', async ({ page }) => {
  await boot(page);
  await page.waitForTimeout(1100);
  await page.getByTestId('following-stat').click();
  await expect(page.getByTestId('profile-root')).toHaveClass(/rearranged/);
  await page.screenshot({ path: 'proof/screens/v2-reshuffle.png' });
  await expect(page.getByTestId('profile-root')).not.toHaveClass(/rearranged/, { timeout: 8000 });
  await expect(page.getByText('It was never changed.')).toBeVisible();
  // laws still work while/after rearranged
  expect(await count(page)).toBe(1248);
});

test('INTERRUPTED NAV: first Case Studies visit bounces back, second sticks', async ({ page }) => {
  await boot(page);
  await page.getByTestId('tab-cases').click();
  await expect(page.getByTestId('tab-overview')).toHaveAttribute('aria-selected', 'true', { timeout: 4000 });
  await expect(page.getByText('Halo thought you meant to stay here.')).toBeVisible();
  await page.getByTestId('tab-cases').click();
  await page.waitForTimeout(700);
  await expect(page.getByTestId('tab-cases')).toHaveAttribute('aria-selected', 'true');
});

test('PHANTOM: a notification claims something that never happened; Email is blocked after the call', async ({ page }) => {
  await boot(page);
  await page.getByTestId('tab-activity').click();
  await expect(page.getByText('Morgan accepted your connection request.').first()).toBeVisible({ timeout: 4000 });
  await expect(page.getByTestId('unread-dot')).toBeVisible();
  await page.getByTestId('message-btn').click();
  await expect(page.getByTestId('unread-dot')).toHaveCount(0);
  await expect(page.getByTestId('chat-sheet')).toContainText('Say hello');
  await page.getByTestId('chat-sheet').getByRole('button', { name: 'Close' }).click();

  // memory: after the call has happened, Email is blocked
  await setSt(page, { callBlocked: true });
  await page.getByTestId('email-btn').click();
  await expect(page.getByText('Morgan has blocked this number.')).toBeVisible();
  await expect(page.getByTestId('call-sheet')).toHaveCount(0);
});

test('VISITORS: profile views list gets stranger each time', async ({ page }) => {
  await boot(page);
  await page.getByTestId('views-stat').click();
  await expect(page.getByTestId('views-popover')).toContainText('You');
  await page.mouse.click(5, 5);
  await page.getByTestId('views-stat').click();
  await expect(page.getByTestId('views-popover')).toContainText('A very large bird');
  await expect(page.getByTestId('views-popover')).toContainText('Halo');
});

test('SETTINGS: rows reshuffle and sync conflict appears every 3rd toggle; laws intact', async ({ page }) => {
  await boot(page);
  await goTab(page, 'settings');
  const order0 = (await st(page)).settingsOrder.join();
  const ids = ['darkMode', 'emailNotifications', 'onlineStatus'];
  for (const id of ids) {
    const b = (await st(page)).settings;
    await page.getByTestId(`setting-${id}`).click();
    const a = (await st(page)).settings;
    expect(a[id]).toBe(b[id]);
  }
  await expect(page.getByTestId('sync-banner')).toBeVisible();
  const order1 = (await st(page)).settingsOrder.join();
  expect(order1.split(',').sort()).toEqual(order0.split(',').sort());
  await expect(page.getByTestId('sync-banner')).toHaveCount(0, { timeout: 6000 });
});

test('DELETE ZONE: button flees twice, countdown never finishes, confirm implodes then restores', async ({ page }) => {
  await boot(page);
  await goTab(page, 'settings');
  const row = page.getByTestId('danger-zone').locator('.row').last();
  const firstLabel = async () => (await row.locator('button').first().innerText()).trim();
  expect(await firstLabel()).toBe('Delete account');
  await page.getByTestId('delete-account').hover();
  await expect.poll(firstLabel).toBe('Keep my account');
  await page.getByTestId('delete-account').hover();
  await expect.poll(firstLabel).toBe('Delete account');
  await page.getByTestId('delete-account').hover(); // gives up after 2
  await expect.poll(firstLabel).toBe('Delete account');
  await page.getByTestId('delete-account').evaluate((e: HTMLElement) => e.click());
  await expect(page.getByTestId('delete-countdown')).toContainText('Deletion scheduled in');
  await page.getByTestId('delete-input').fill('delete');
  await expect(page.getByTestId('delete-input')).toHaveValue('DELIGHT', { timeout: 4000 });
  await page.getByTestId('delete-confirm').click();
  await expect(page.getByText('Account delighted ✓')).toBeVisible();
  await expect(page.getByTestId('danger-zone')).toBeVisible({ timeout: 4000 });
  await page.waitForTimeout(1700);
  const box = await page.getByTestId('danger-zone').boundingBox();
  expect(box && box.width > 100).toBe(true);
});

test('FOLLOW HINT: a separate hint makes the unfollow obvious while the button stays identical', async ({ page }) => {
  await page.clock.install({ time: 0 });
  await page.goto('/?test=1&reset=1&seed=11');
  await page.clock.pauseAt(10000);
  const b = page.getByTestId('follow-button');
  const style = () => b.evaluate((e) => { const c = getComputedStyle(e); return [c.backgroundColor, c.color, c.borderColor, e.className].join('|'); });
  const s0 = await style();
  await b.click();
  await expect(page.getByTestId('follow-hint')).toContainText('Following');
  await page.clock.runFor(2000);
  await expect(b).toHaveText('Unfollowed');
  await expect(page.getByTestId('follow-hint')).toContainText('unfollowed them');
  await expect(page.locator('.fx-broken')).toBeVisible();
  expect(await style()).toBe(s0);
  await b.click();
  await expect(page.getByTestId('follow-hint')).toContainText('Followed successfully');
  expect(await style()).toBe(s0);
});

test('CHANGE PHOTO: chaos animation plays, the picture itself never changes', async ({ page }) => {
  await boot(page);
  const src0 = await page.getByTestId('avatar').getAttribute('src');
  await page.getByTestId('change-photo').click();
  await expect(page.getByTestId('avatar-wrap')).toHaveClass(/photo-chaos/);
  await expect(page.locator('.pfx').first()).toBeVisible();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'proof/screens/v3-photo-chaos.png' });
  await expect(page.getByTestId('avatar-wrap')).not.toHaveClass(/photo-chaos/, { timeout: 4000 });
  expect(await page.getByTestId('avatar').getAttribute('src')).toBe(src0);
  await expect(page.getByTestId('display-name')).not.toHaveText('Morgan Vale');
});

test('PROFILE FAQ: the attack runs on the profile too, then Yes returns to a clean profile', async ({ page }) => {
  await boot(page);
  await page.getByTestId('profile-faq').click();
  await expect(page.getByTestId('faq-console')).toContainText('INTRUSION DETECTED', { timeout: 8000 });
  await expect(page.getByTestId('faq-ask')).toBeVisible({ timeout: 15000 });
  await page.getByTestId('faq-yes').click();
  await expect(page.getByTestId('faq-sequence')).toHaveCount(0);
  expect(await page.locator('.dmg-gone').count()).toBe(0);
  await expect(page.getByTestId('follower-count')).toBeVisible();
  await expect(page.getByTestId('follower-count')).toHaveText('1,248');
});

test('EVIDENCE: exhibit stamps, a viewer that opens the wrong study, and a shuffle on close', async ({ page }) => {
  await boot(page);
  await goTab(page, 'cases');
  await expect(page.locator('.exh').first()).toContainText('EXHIBIT');
  const order0 = await page.locator('[data-testid^=case-card-]').evaluateAll((els) => els.map((e) => e.getAttribute('data-testid')));
  await page.getByTestId('case-card-f0').click();
  await expect(page.getByTestId('case-loading')).toBeVisible();
  await expect(page.getByTestId('case-wrong-note')).toBeVisible({ timeout: 5000 });
  await expect(page.getByTestId('case-wrong-note')).toContainText('Halo felt this one was stronger');
  await page.screenshot({ path: 'proof/screens/v3-evidence-viewer.png' });
  await expect(page.getByText('−48%')).toBeVisible({ timeout: 4000 });
  await page.getByTestId('case-close').click();
  await expect(page.getByTestId('case-viewer')).toHaveCount(0);
  await page.waitForTimeout(800);
  const order1 = await page.locator('[data-testid^=case-card-]').evaluateAll((els) => els.map((e) => e.getAttribute('data-testid')));
  expect(order1.slice().sort()).toEqual(order0.slice().sort());
  expect(order1.join()).not.toBe(order0.join());
  expect((await st(page)).files.length).toBe(12); // nothing was lost
});

test('EMAIL: first click rings with Accept/Decline even if a previous visit already saw the call', async ({ page }) => {
  await boot(page);
  const s = await st(page);
  await setSt(page, { flags: { ...s.flags, videoSeen: true } }); // as if saved from an earlier visit
  await page.getByTestId('email-btn').click();
  await expect(page.getByTestId('call-sheet')).toBeVisible();
  await expect(page.getByTestId('call-accept')).toBeVisible();
  await expect(page.getByTestId('call-decline')).toBeVisible();
  await page.getByTestId('call-accept').click();
  await expect.poll(async () => (await st(page)).cinematic, { timeout: 45000 }).toBe(null);
  await page.getByTestId('email-btn').click();
  await expect(page.getByText('Morgan has blocked this number.')).toBeVisible();
  await expect(page.getByTestId('call-sheet')).toHaveCount(0);
});

test('CHANGE PHOTO: the picture pops out, profile_clip plays in the frame and pauses at the end', async ({ page }) => {
  await boot(page);
  await page.waitForTimeout(1000);
  const src0 = await page.getByTestId('avatar').getAttribute('src');
  const name0 = await page.getByTestId('display-name').innerText();
  await page.getByTestId('change-photo').click();
  await expect(page.getByTestId('avatar')).toHaveClass(/poof/); // the picture is removed
  const clip = page.getByTestId('profile-clip');
  await expect(clip).toBeVisible({ timeout: 4000 });
  await expect(clip).toHaveAttribute('src', '/media/profile_clip.mp4');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'proof/screens/v4-profile-clip.png' });
  // the clip sits exactly in the avatar frame
  const fr = (await page.getByTestId('avatar-wrap').boundingBox())!;
  const cb = (await clip.boundingBox())!;
  expect(Math.abs(cb.width - fr.width)).toBeLessThan(2);
  expect(Math.abs(cb.height - fr.height)).toBeLessThan(2);
  // it plays to the end, then stays paused on the last frame
  await page.waitForFunction(() => (document.querySelector('[data-testid=profile-clip]') as HTMLVideoElement)?.ended === true, null, { timeout: 25000 });
  const st1 = await clip.evaluate((v: HTMLVideoElement) => ({ paused: v.paused, ended: v.ended, t: v.currentTime }));
  expect(st1.paused).toBe(true);
  await page.waitForTimeout(800);
  const t2 = await clip.evaluate((v: HTMLVideoElement) => v.currentTime);
  expect(t2).toBeCloseTo(st1.t, 1); // no further playback
  await expect(clip).toBeVisible();
  // Law 1 still holds: the <img> never changed, the name did
  expect(await page.getByTestId('avatar').getAttribute('src')).toBe(src0);
  await expect(page.getByTestId('display-name')).not.toHaveText(name0);
});
