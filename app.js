require("dotenv").config();
const express = require("express");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const sharp = require("sharp");

// Configure S3 client for R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_DEV_URL = "https://pub-a11c884b6ddb49748e3139e669fc08e6.r2.dev"; // Your R2.dev subdomain

const app = express();
app.use(bodyParser.json());

// Helper function to generate a safe filename
function generateSafeFilename() {
  const now = new Date();
  const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const time = now.toTimeString().split(" ")[0].replace(/:/g, "-"); // HH-MM-SS
  return `mermaid_${date}_${time}.png`;
}

// Render Mermaid.js, convert to PNG, and upload to R2
app.post("/render", async (req, res) => {
  const { mermaid } = req.body;

  if (!mermaid) {
    return res.status(400).json({ error: "No Mermaid.js payload provided" });
  }

  try {
    // Launch Puppeteer with necessary flags
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Set up the HTML content with Mermaid.js
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; }
          .mermaid { margin: 0; }
        </style>
        <script type="module">
          import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
          window.mermaid = mermaid;
          mermaid.initialize({ startOnLoad: true });
          window.addEventListener('DOMContentLoaded', () => {
            document.body.innerHTML = \`<div class="mermaid">${mermaid}</div>\`;
            mermaid.contentLoaded();
          });
        </script>
      </head>
      <body></body>
      </html>
    `;

    await page.setContent(content);
    await page.waitForSelector(".mermaid svg");

    // Wait for the diagram to render
    await page.evaluate(() => {
      return new Promise((resolve) => {
        window.mermaid.init(undefined, document.querySelectorAll(".mermaid"));
        resolve();
      });
    });

    // Add a delay to ensure rendering
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Capture the screenshot as PNG
    const screenshot = await page.screenshot({
      fullPage: true,
      omitBackground: true,
    });

    await browser.close();

    if (!screenshot) {
      return res
        .status(500)
        .json({ error: "Failed to render Mermaid diagram" });
    }

    // Convert the screenshot to PNG using sharp
    const pngBuffer = await sharp(screenshot).png().toBuffer();

    // Generate a unique and safe file name based on current date/time
    const fileName = generateSafeFilename();

    // Upload the PNG to R2
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: pngBuffer,
      ContentType: "image/png",
    });

    await s3Client.send(uploadCommand);

    // Construct the public URL using the R2.dev subdomain
    const publicUrl = `${R2_DEV_URL}/${fileName}`;

    console.log("Public URL:", publicUrl); // Log the public URL for debugging

    res.json({ url: publicUrl });
  } catch (error) {
    console.error("Error during rendering or uploading:", error);
    res.status(500).json({ error: "Error rendering Mermaid.js" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
