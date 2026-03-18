const { test, expect } = require('@playwright/test');

// This test assumes the Eleventy dev server is running on http://localhost:8080
// Start it with: npm run start:dev

test('homepage responds with status < 400', async ({ page }) => {
  const response = await page.goto('/');
  if (!response) throw new Error('No response from server');
  expect(response.status()).toBeLessThan(400);
});
