import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'proof', 'screens');

// Execution proof: walks the judge journey at real speed and saves numbered screenshots.
test('PROOF: full judge journey', async ({ page }) => {
  test.setTimeout(240000);
  const shot = (n: string) => page.screenshot({ path: join(OUT, `${n}.png`) });
  await page.goto('/?test=1&landing=1&reset=1&seed=21');
  await expect(page.getByTestId('landing')).toBeVisible();
  await page.waitForTimeout(500);
  await shot('00a-landing');

  // Profile button: red alert only -> back to landing
  await page.getByTestId('nav-profile').click();
  await page.waitForTimeout(900);
  await shot('00b-red-alert-ye-ni-dabana-tha');
  await expect(page.getByTestId('red-alert')).toHaveCount(0, { timeout: 8000 });
  await expect(page.getByTestId('landing')).toBeVisible();

  // Get Started: error windows -> blue screen -> crash -> back to landing
  await page.getByTestId('get-started').click();
  await page.waitForTimeout(1800);
  await shot('00d-error-windows');
  await expect(page.getByTestId('error-crash')).toHaveAttribute('data-stage', 'blue', { timeout: 8000 });
  await page.waitForTimeout(300);
  await shot('00e-blue-screen');
  await expect(page.getByTestId('error-crash')).toHaveCount(0, { timeout: 10000 });
  await expect(page.getByTestId('landing')).toBeVisible();

  // FAQ: the only way into the profile
  await page.getByTestId('hero-faq').click();
  await page.waitForTimeout(600);
  await shot('00f-faq-loading');
  await expect(page.getByTestId('faq-console')).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(2200);
  await shot('00g-faq-intrusion-window');
  await expect(page.getByTestId('faq-chaos')).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(800);
  await shot('00h-faq-chaos');
  await expect(page.getByTestId('faq-ask')).toBeVisible({ timeout: 12000 });
  await shot('00i-faq-demand');
  await page.getByTestId('faq-no').click();
  await page.waitForTimeout(1900);
  await shot('00j-faq-gunfire');
  await expect(page.getByTestId('faq-warn')).toBeVisible({ timeout: 12000 });
  await page.waitForTimeout(500);
  await shot('00k-faq-warning-popup');
  await page.getByTestId('faq-yes').click();
  await expect(page.getByTestId('follower-count')).toBeVisible({ timeout: 5000 });
  await page.waitForTimeout(1200);
  await shot('01-trust');

  await page.getByTestId('follower-count').hover();
  await page.waitForTimeout(400);
  await shot('02-followers-1247');

  await page.mouse.move(700, 600);
  await page.getByTestId('follow-button').click();
  await shot('03-follow-following');
  await expect(page.getByTestId('follow-button')).toHaveText('Unfollowed', { timeout: 3000 });
  await shot('04-follow-unfollowed');
  await page.getByTestId('follow-button').click();
  await expect(page.getByTestId('follow-button')).toHaveText('Followed successfully');
  await shot('05-followed-successfully');

  await page.getByTestId('change-photo').click();
  await page.waitForTimeout(450);
  await shot('06a-change-photo-picture-removed');
  await page.waitForTimeout(2500);
  await shot('06b-change-photo-clip-playing');
  await expect(page.getByTestId('display-name')).not.toHaveText('Morgan Vale', { timeout: 3000 });
  await shot('06-name-changed');

  await page.getByTestId('edit-name').click();
  await expect(page.getByRole('dialog', { name: 'Edit bio' })).toBeVisible();
  await shot('07-bio-editor');
  await page.getByTestId('bio-save').click();
  await page.waitForTimeout(250);
  await shot('08-letter-removed');

  await page.getByTestId('tab-settings').click();
  await page.getByTestId('setting-darkMode').click();
  await page.waitForTimeout(500);
  await shot('09-settings-flip');
  await page.getByTestId('tab-overview').click();

  await page.getByTestId('email-btn').click();
  await expect(page.getByTestId('call-sheet')).toBeVisible();
  await page.waitForTimeout(700);
  await shot('10-incoming-call-ringing');
  await page.getByTestId('call-accept').click();
  await expect(page.getByTestId('call-full')).toBeVisible();
  await page.waitForTimeout(2200);
  await shot('11-video');
  await expect(page.getByTestId('plane-crash')).toBeVisible({ timeout: 30000 });
  await page.waitForTimeout(1500);
  await shot('12a-plane');
  await page.waitForFunction(() => document.querySelector('[data-testid=plane-crash]')?.getAttribute('data-boom') === '1', null, { polling: 'raf', timeout: 10000 });
  await page.waitForTimeout(250);
  await shot('12-plane-explosion');
  await expect(page.getByTestId('plane-crash')).toHaveCount(0, { timeout: 15000 });
  await expect(page.getByTestId('tab-overview')).toHaveAttribute('aria-selected', 'true');
  await page.waitForTimeout(800);

  await page.getByTestId('tab-overview').click();
  await page.getByTestId('chip-skill.1').click();
  await page.waitForTimeout(2500);
  await shot('12b-incident');
  await expect(page.getByTestId('incident-cinematic')).toHaveCount(0, { timeout: 15000 });
  await page.getByTestId('following-stat').click();
  await page.waitForTimeout(1200);
  await shot('12c-reshuffle');
  await expect(page.getByTestId('profile-root')).not.toHaveClass(/rearranged/, { timeout: 10000 });
  await page.getByTestId('tab-cases').click();
  await page.waitForTimeout(1200); // first visit bounces back; go again
  await page.getByTestId('tab-cases').click();
  await expect(page.getByTestId('view-files')).toBeVisible();
  await page.getByTestId('view-files').click();
  await page.waitForTimeout(1500);
  await page.waitForFunction(() => !!document.querySelector('.gravity'), null, { timeout: 10000 });
  await page.waitForTimeout(400);
  await shot('13-cleanup-raw');
  await page.waitForFunction(() => !!document.querySelector('[data-testid=system-restored]'), null, { polling: 'raf', timeout: 20000 });
  await page.waitForTimeout(500);
  await shot('14-restored');
  await expect(page.getByTestId('tab-settings')).toHaveAttribute('aria-selected', 'true', { timeout: 8000 });
  await page.waitForTimeout(600);

  await expect(page.getByTestId('finale-banner')).toBeVisible();
  await page.getByTestId('review-changes').click();
  await expect(page.getByTestId('finale-diff')).toBeVisible();
  await shot('15-finale-diff');
  await page.getByTestId('revert-all').click();
  await expect(page.getByTestId('display-name')).toHaveText('You (Visitor)', { timeout: 6000 });
  await page.waitForTimeout(500);
  await shot('16-you-are-the-product');
});
