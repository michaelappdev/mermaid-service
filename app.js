require("dotenv").config();
const express = require("express");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const puppeteer = require("puppeteer");
const bodyParser = require("body-parser");

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

const app = express();
app.use(bodyParser.json());

// Render Mermaid.js and upload to R2
app.post("/render", async (req, res) => {
  const { mermaid } = req.body;

  if (!mermaid) {
    return res.status(400).json({ error: "No Mermaid.js payload provided" });
  }

  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch();
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
          mermaid.initialize({ startOnLoad: true });
        </script>
      </head>
      <body>
        <div class="mermaid">${mermaid}</div>
      </body>
      </html>
    `;

    await page.setContent(content);
    await page.waitForSelector(".mermaid");

    // Capture the screenshot
    const buffer = await page.screenshot({ type: "png" });

    await browser.close();

    // Generate a unique file name with current date/time
    const fileName = `mermaid_${new Date().toISOString()}.png`;

    // Upload the image to R2
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: "image/png",
    });

    await s3Client.send(command);

    // Generate a signed URL for the uploaded image
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    res.json({ url: signedUrl });
  } catch (error) {
    console.error("Error rendering Mermaid.js:", error);
    res.status(500).json({ error: "Error rendering Mermaid.js" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
