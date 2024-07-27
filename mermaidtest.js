require("dotenv").config();
const axios = require("axios");

const testMermaidDefinition = async (mermaidDefinition) => {
  try {
    const response = await axios.post(
      `http://localhost:${process.env.PORT}/render`,
      {
        mermaid: mermaidDefinition,
      },
    );

    if (response.status === 200 && response.data.url) {
      console.log("Mermaid diagram rendered successfully!");
      console.log("Image URL:", response.data.url);
    } else {
      console.error("Failed to render Mermaid diagram");
      console.error(response.data);
    }
  } catch (error) {
    console.error(
      "Error during testing:",
      error.response ? error.response.data : error.message,
    );
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

testMermaidDefinition(exampleMermaidDefinition);
