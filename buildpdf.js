// from https://mofadlalla.io/2025/08/21/the-ultimate-guide-to-generating-pdfs-from-html-with-nodejs-and-puppeteer-2292.html
import puppeteer from 'puppeteer';
import path, { format } from 'path';
import fs from 'fs';

async function generatePdfFromHTMLFile(filename) {
  let browser;
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch();

    console.log('Opening new page...');
    const page = await browser.newPage();

    console.log('Setting page content...');
    const absolutePath = path.resolve(filename);

    await page.goto(`file://${absolutePath}`, { waitUntil: 'networkidle0' });

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
    }
  }
}

generatePdfFromHTMLFile("_site/index.html");

