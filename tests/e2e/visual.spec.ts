import { test, expect } from '@playwright/test';
import { boot, setSt } from './helpers';

for (const [name, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844], ['narrow', 360, 740]] as const) {
  for (const dark of [false, true]) {
    test(`VISUAL: ${name} ${dark ? 'dark' : 'light'} looks calm, trustworthy and does not overflow`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: h });
      await boot(page);
      if (dark) await setSt(page, { settings: { darkMode: true, emailNotifications: true, onlineStatus: true, twoFactor: true, autoplay: false, haloAgent: false } });
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      await page.screenshot({ path: `proof/screens/visual-${name}-${dark ? 'dark' : 'light'}.png` });
    });
  }
}

test('VISUAL: nothing looks chaotic before interaction', async ({ page }) => {
  await boot(page);
  const html = (await page.content()).toLowerCase();
  for (const w of ['chaos', 'prank', 'troll', 'marquee', 'comic sans']) expect(html).not.toContain(w);
  await expect(page.getByTestId('toast')).toHaveCount(0);
  await expect(page.getByTestId('display-name')).toHaveText('Morgan Vale');
});
