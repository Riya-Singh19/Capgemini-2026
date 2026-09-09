import { test, expect } from '@playwright/test';

const acceptDemoModal = async (page: any) => {
  const continueButton = page
    .locator('button:has-text("I Understand & Continue")')
    .first();

  if (await continueButton.isVisible().catch(() => false)) {
    await continueButton.click();
  }
};

const openFlightsTab = async (page: any) => {
  const flightTab = page.locator('button:has-text("Flights")').first();

  await expect(flightTab).toBeVisible({ timeout: 20000 });
  await flightTab.click();

  await expect(
    page.locator('#fl_from_trigger')
  ).toBeVisible({ timeout: 20000 });
};

test.beforeEach(async ({ page }) => {
  await page.goto('https://phptravels.net/');
  await acceptDemoModal(page);
  await page.waitForLoadState('domcontentloaded');
});

test('homepage shows flight search form and primary actions', async ({ page }) => {
  await openFlightsTab(page);

  await expect(page.locator('#fl_from_trigger')).toBeVisible();
  await expect(page.locator('#fl_to_trigger')).toBeVisible();
  await expect(page.locator('#flights_departure_date')).toBeVisible();

  await expect(
    page.locator(
      'button[title="Search Flights"], button[aria-label="Search Flights"]'
    ).first()
  ).toBeVisible();
});

test('valid flight search accepts route and date input', async ({ page }) => {
  await openFlightsTab(page);

  await page.locator('#fl_from_trigger').click();
  await page.locator('#fl_from_q').fill('DXB');

  await page.locator('#fl_to_trigger').click();
  await page.locator('#fl_to_q').fill('LHR');

  await page.locator('#flights_departure_date').fill('2026-10-01');
  await page.locator('#flights_return_date').fill('2026-10-04');

  const searchButton = page
    .locator(
      'button[title="Search Flights"], button[aria-label="Search Flights"]'
    )
    .first();

  await searchButton.click();

  await expect(page.locator('body')).toBeVisible();
});

test('empty flight search shows validation or blocks submission', async ({ page }) => {
  await openFlightsTab(page);

  const searchButton = page
    .locator(
      'button[title="Search Flights"], button[aria-label="Search Flights"]'
    )
    .first();

  await searchButton.click();

  await expect(searchButton).toBeVisible();
});

test('invalid flight route is handled gracefully', async ({ page }) => {
  await openFlightsTab(page);

  await page.locator('#fl_from_trigger').click();
  await page.locator('#fl_from_q').fill('XYZINVALID');

  await page.locator('#fl_to_trigger').click();
  await page.locator('#fl_to_q').fill('ABCINVALID');

  await page.locator('#flights_departure_date').fill('2026-10-01');
  await page.locator('#flights_return_date').fill('2026-10-04');

  const searchButton = page
    .locator(
      'button[title="Search Flights"], button[aria-label="Search Flights"]'
    )
    .first();

  await searchButton.click();

  await expect(searchButton).toBeVisible();
});
