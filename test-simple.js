require("dotenv").config();
const axios = require("axios");

const testMermaidDiagram = `
graph TD;
  A-->B;
  A-->C;
  B-->D;
  C-->D;
`;

async function testRender() {
  try {
    const response = await axios.post(
      `http://localhost:${process.env.PORT || 3001}/render`,
      {
        mermaid: testMermaidDiagram,
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.status === 200 && response.data.url) {
      console.log("Mermaid diagram rendered successfully!");
      console.log("Image URL:", response.data.url);
    } else {
      console.error("Failed to render Mermaid diagram");
      console.error(response.data);
    }
  } catch (error) {
    console.error("Error during testing:", error.response ? error.response.data : error.message);
  }
}

testRender();