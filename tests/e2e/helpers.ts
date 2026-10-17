import { expect, type Page } from '@playwright/test';

export const url = (q = '') => `/?test=1&reset=1&seed=11&fast=1${q}`;
export const reload = async (p: Page, q = '') => {
  await p.goto(`/?test=1&seed=11&fast=1${q}`);
  await p.reload(); // a hash-only goto would not reload the document
};

export async function boot(p: Page, q = '') {
  await p.goto(url(q));
  await expect(p.getByTestId('follower-count')).toBeVisible();
}

export const st = (p: Page) => p.evaluate(() => (window as any).__halo.get());
export const setSt = (p: Page, patch: any) => p.evaluate((x) => (window as any).__halo.set(x), patch);
export const letters = (texts: Record<string, string>) =>
  Object.values(texts).reduce((n, t) => n + (t.match(/[A-Za-z]/g) || []).length, 0);
export const count = async (p: Page) => Number((await p.getByTestId('follower-count').innerText()).replace(/,/g, ''));
// The first visit to Case Studies is interrupted by Halo (it bounces back), so retry once.
export async function goTab(p: Page, id: string) {
  const tab = p.getByTestId(`tab-${id}`);
  await tab.click();
  await p.waitForTimeout(450);
  if ((await tab.getAttribute('aria-selected')) !== 'true') await tab.click();
  await expect(tab).toHaveAttribute('aria-selected', 'true');
}
export const landingUrl = (q = '') => `/?test=1&landing=1&reset=1&seed=11&fast=1${q}`;
