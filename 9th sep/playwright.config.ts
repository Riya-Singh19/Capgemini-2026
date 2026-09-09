import { defineConfig, devices } from '@playwright/test';

// export default defineConfig({
//   testDir: './tests/9th sep',
//   use: {
//     baseURL: 'https://phptravels.net/',
//     headless: true,
//     screenshot: 'only-on-failure',
//     trace: 'retain-on-failure',
//     video: 'retain-on-failure'
//   },
export default defineConfig({
  testDir: '.',
});

  
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    }
  ]
});
