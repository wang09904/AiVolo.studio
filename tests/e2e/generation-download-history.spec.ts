import fs from 'fs';
import { expect, test } from '@playwright/test';

test('generates an image, downloads it, and shows it in account history', async ({ page }) => {
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];
  const prompt = 'A deterministic Playwright test image for AiVolo history';

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  page.on('requestfailed', (request) => {
    if (request.url().includes('/_next/static/webpack/') && request.url().includes('hot-update')) {
      return;
    }

    failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText || ''}`);
  });

  await page.goto('/create');
  await expect(page.getByRole('heading', { name: 'Creation Studio' })).toBeVisible();

  await page.getByTestId('create-prompt-input').fill(prompt);
  await page.getByTestId('generate-image-button').click();

  await expect(page.getByTestId('generation-result')).toBeVisible();
  await expect(page.getByTestId('generated-image')).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('download-image-button').click();
  const download = await downloadPromise;
  const failure = await download.failure();
  expect(failure).toBeNull();
  expect(download.suggestedFilename()).toMatch(/^aivolo-[a-f0-9-]{8}\.png$/);
  await expect(page.getByTestId('generation-error')).toHaveCount(0);

  const downloadedPath = test.info().outputPath(download.suggestedFilename());
  await download.saveAs(downloadedPath);
  expect(fs.statSync(downloadedPath).size).toBeGreaterThan(0);

  await page.goto('/account');
  await expect(page.getByTestId('e2e-account-history')).toBeVisible();
  await expect(page.getByTestId('history-item').first()).toContainText(prompt);
  await expect(page.getByTestId('history-download-link').first()).toBeVisible();

  expect(failedRequests).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test('refund policy exposes the only refund request entry point', async ({ page }) => {
  await page.goto('/refund');

  await expect(page.getByRole('heading', { name: 'Refund Policy' })).toBeVisible();
  await expect(page.getByText('only user-facing refund request entry point')).toBeVisible();
  await expect(page.locator('main').getByText('wang19904@gmail.com')).toBeVisible();
  await expect(page.getByText('manual review')).toBeVisible();
});
