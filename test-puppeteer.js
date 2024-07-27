const puppeteer = require("puppeteer");

const testMermaidDiagram = async (mermaidDefinition) => {
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
          mermaid.initialize({ startOnLoad: true });
          window.addEventListener('DOMContentLoaded', () => {
            document.body.innerHTML = \`<div class="mermaid">${mermaidDefinition}</div>\`;
            mermaid.contentLoaded();
          });
        </script>
      </head>
      <body></body>
      </html>
    `;

    await page.setContent(content);
    await page.waitForSelector(".mermaid");

    // Capture the screenshot
    const buffer = await page.screenshot({ type: "png" });
    await browser.close();

    console.log("Mermaid diagram rendered successfully!");
    const fs = require("fs");
    fs.writeFileSync("mermaid_diagram.png", buffer);
    console.log("Screenshot saved as mermaid_diagram.png");
  } catch (error) {
    console.error("Error during Puppeteer rendering:", error);
  }
};

// Example Mermaid.js definition
const exampleMermaidDefinition = `
  graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;
`;

testMermaidDiagram(exampleMermaidDefinition);
