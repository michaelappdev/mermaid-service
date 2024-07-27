require("dotenv").config();
const axios = require("axios");

const testMermaidDiagram = `
sequenceDiagram
    actor System
    actor ProcessFunction as "Process Function"
    
    System->>System: Initialize
    System->>System: Get list of items to process
    System->>System: Create list of unprocessed items
    System->>ProcessFunction: Call Process Item
    ProcessFunction-->>System: Process Item Function
    alt Error occurred?
        ProcessFunction-->>System: Yes
        System->>ProcessFunction: Retry Process Item
    else
        ProcessFunction-->>System: No
        alt More items to process?
            ProcessFunction-->>System: Yes
            System->>ProcessFunction: Call Process Item
        else
            ProcessFunction-->>System: No
            System->>System: Wait for next cycle
        end
    end
`;

async function testRender() {
  try {
    const response = await axios.post(
      `http://localhost:${process.env.PORT || 3001}/render`,
      {
        mermaid: testMermaidDiagram,
      },
      { headers: { "Content-Type": "application/json" } },
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
}

testRender();
