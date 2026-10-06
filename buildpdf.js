// from https://mofadlalla.io/2025/08/21/the-ultimate-guide-to-generating-pdfs-from-html-with-nodejs-and-puppeteer-2292.html
import puppeteer from 'puppeteer';
import path, { format } from 'path';
import express from 'express';
import fs from 'fs';
import { URL, fileURLToPath } from 'url';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '_site')));

async function generatePdfFromHTMLFile(filename) {
  let browser;
  let instance;
  try {

    instance = await new Promise((resolve) => {
      const server = app.listen(port, () => {
        console.log(`Express server running on http://localhost:${port}`);
        resolve(server);
      });
    });

    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage' // Prevents memory crash issues in CI
      ]
    });

    console.log('Opening new page...');
    const page = await browser.newPage();

    console.log('Setting page content...');
    const absolutePath = new URL(filename, "http://localhost:3000");

    await page.goto(`${absolutePath}`, { waitUntil: ['networkidle0', 'load'] });

    await page.emulateMediaType('print');

    const pdfPageFormats = [
      'A4', 'Letter', 'Legal'
    ]
    for (const format of pdfPageFormats) {
      console.log(`Generating PDF... (format = ${format})`);
      const pdfBuffer = await page.pdf({
        format: format, margin: {
          bottom: 48,
          top: 48,
          left: 48,
          right: 48,
        }
      });

      console.log('Saving PDF...');
      const filePath = `_site/pdf/${format}/Ross David Tan.pdf`;
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, pdfBuffer);
      console.log(`PDF generated successfully: pdf/${format}/Ross David Tan.pdf`);

    }

  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    if (browser) {
      console.log('Closing browser...');
      await browser.close();
      instance.close();
    }
  }
}

generatePdfFromHTMLFile("index.html");

