require("dotenv").config();
const axios = require("axios");

const testMermaidDiagram = `
sequenceDiagram
    participant Requester
    participant System
    participant Support
    participant Management
    participant Reviewers
    participant Teams
    participant Stakeholders

    Requester->>System: Submits request
    System->>Support: Handles request as routine task
    alt Significant impact
        System->>Management: Follows project path
    end
    Management->>Reviewers: Facilitates intake process
    Reviewers->>Reviewers: Reviews request
    alt Not a new solution
        Management->>Reviewers: Adds to existing workload
    end
    Reviewers->>Teams: Hands off request
    Reviewers->>Management: Hands off request
    Management->>Teams: Schedules and assigns request
    Teams->>Teams: Work is scheduled and delivered
    Teams->>Stakeholders: Outcome communicated
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
