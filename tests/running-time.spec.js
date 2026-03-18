const { test, expect } = require('@playwright/test');

// This test assumes the Eleventy dev server is running on http://localhost:8080
// Start it with: npm run start:dev

test.describe('Running time calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/running-time/');
  });

  test('page loads and displays both input rows', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Running time calculator');
    
    // Check pace row (row2) exists
    await expect(page.locator('#distance2')).toBeVisible();
    await expect(page.locator('#pace-min')).toBeVisible();
    await expect(page.locator('#pace-sec')).toBeVisible();
    await expect(page.locator('#calculate2')).toBeVisible();
    
    // Check time row (row1) exists
    await expect(page.locator('#distance1')).toBeVisible();
    await expect(page.locator('#hours')).toBeVisible();
    await expect(page.locator('#minutes')).toBeVisible();
    await expect(page.locator('#seconds')).toBeVisible();
    await expect(page.locator('#calculate1')).toBeVisible();
  });

  test('pace row is selected by default', async ({ page }) => {
    const row2 = page.locator('#row2');
    const row1 = page.locator('#row1');
    
    await expect(row2).toHaveClass(/selected/);
    await expect(row1).toHaveClass(/unselected/);
  });

  test('clicking time row selects it and deselects pace row', async ({ page }) => {
    // Click on an input in row1 (time row)
    await page.locator('#distance1').click();
    
    const row1 = page.locator('#row1');
    const row2 = page.locator('#row2');
    
    await expect(row1).toHaveClass(/selected/);
    await expect(row2).toHaveClass(/unselected/);
  });

  test('distance + pace calculation works', async ({ page }) => {
    // Fill in distance and pace
    await page.locator('#distance2').fill('10');
    await page.locator('#unit2').selectOption('km');
    await page.locator('#pace-min').fill('5');
    await page.locator('#pace-sec').fill('30');
    
    // Click calculate
    await page.locator('#calculate2').click();
    
    // Check results appear
    const results = page.locator('#results-body');
    await expect(results).toContainText('Time for 10 km');
    await expect(results).toContainText('0:55:00'); // 10km at 5:30 pace = 55 minutes
    
    // Check table has km and miles columns
    await expect(results.locator('table')).toBeVisible();
    await expect(results.locator('th')).toContainText(['Kilometers', 'Time', 'Miles', 'Time']);
  });

  test('distance + time calculation works', async ({ page }) => {
    // Switch to time row
    await page.locator('#distance1').click();
    
    // Fill in distance and time
    await page.locator('#distance1').fill('5');
    await page.locator('#unit1').selectOption('km');
    await page.locator('#hours').fill('0');
    await page.locator('#minutes').fill('25');
    await page.locator('#seconds').fill('0');
    
    // Click calculate
    await page.locator('#calculate1').click();
    
    // Check results appear
    const results = page.locator('#results-body');
    await expect(results).toContainText('Pace:');
    await expect(results).toContainText('5:00'); // 5km in 25 minutes = 5:00 per km
    
    // Check table exists
    await expect(results.locator('table')).toBeVisible();
  });

  test('enter key triggers calculation for selected row', async ({ page }) => {
    // Pace row is selected by default
    await page.locator('#distance2').fill('10');
    await page.locator('#pace-min').fill('6');
    await page.locator('#pace-sec').fill('0');
    
    // Press enter in pace-min field
    await page.locator('#pace-min').press('Enter');
    
    // Check results appear
    const results = page.locator('#results-body');
    await expect(results).toContainText('Time for 10 km');
    await expect(results).toContainText('1:00:00'); // 10km at 6:00 pace = 60 minutes
  });

  test('results display both kilometers and miles', async ({ page }) => {
    await page.locator('#distance2').fill('5');
    await page.locator('#pace-min').fill('5');
    await page.locator('#pace-sec').fill('0');
    await page.locator('#calculate2').click();
    
    const results = page.locator('#results-body');
    const table = results.locator('table');
    
    // Check for common race distances
    await expect(table).toContainText('5 km');
    await expect(table).toContainText('10 km');
    await expect(table).toContainText('21.0975 km'); // Half marathon
    await expect(table).toContainText('42.195 km');  // Marathon
    
    await expect(table).toContainText('5 mi');
    await expect(table).toContainText('10 mi');
    await expect(table).toContainText('13.1094 mi'); // Half marathon
    await expect(table).toContainText('26.2188 mi'); // Marathon
  });

  test('handles invalid inputs gracefully', async ({ page }) => {
    // Try to calculate with zero distance
    await page.locator('#distance2').fill('0');
    await page.locator('#pace-min').fill('5');
    await page.locator('#calculate2').click();
    
    const results = page.locator('#results-body');
    await expect(results).toContainText('Please enter positive distance and pace');
    
    // Try to calculate with zero pace
    await page.locator('#distance2').fill('10');
    await page.locator('#pace-min').fill('0');
    await page.locator('#pace-sec').fill('0');
    await page.locator('#calculate2').click();
    
    await expect(results).toContainText('Please enter positive distance and pace');
  });

  test('pace unit label updates when unit changes', async ({ page }) => {
    const paceLabel = page.locator('#pace-unit-label');
    
    // Default should be km
    await expect(paceLabel).toHaveText('km');
    
    // Change to miles
    await page.locator('#unit2').selectOption('mi');
    await expect(paceLabel).toHaveText('mi');
    
    // Change back to km
    await page.locator('#unit2').selectOption('km');
    await expect(paceLabel).toHaveText('km');
  });

  test('calculations work with miles as unit', async ({ page }) => {
    await page.locator('#distance2').fill('3');
    await page.locator('#unit2').selectOption('mi');
    await page.locator('#pace-min').fill('8');
    await page.locator('#pace-sec').fill('0');
    await page.locator('#calculate2').click();
    
    const results = page.locator('#results-body');
    await expect(results).toContainText('Time for 3 mi');
    await expect(results).toContainText('0:24:00'); // 3 miles at 8:00 pace = 24 minutes
  });
});
