
const express = require('express');
const { chromium } = require('playwright');

const app = express();
app.use(express.json());

app.post('/login', async (req, res) => {
  const { mobile, otp } = req.body;

  const browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    await page.goto('https://your-bot-url.com');

    await page.fill('input[name="mobile"]', mobile);
    await page.click('button.send-otp');

    await page.waitForSelector('input[name="otp"]');

    await page.fill('input[name="otp"]', otp);
    await page.click('button.login');

    await page.waitForLoadState('networkidle');

    res.json({ status: 'success' });
  } catch (err) {
    res.json({ status: 'error', message: err.message });
  }

  await browser.close();
});

app.listen(3000, () => console.log('Server running'));
