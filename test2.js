require("dotenv").config();
const axios = require("axios");

const testMermaidDiagram = `
sequenceDiagram
    actor DataSafe
    actor InternalCreateMemberIDFunction as "Internal Create MemberID Function"
    
    DataSafe->>DataSafe: Start
    DataSafe->>DataSafe: Get list of Members without MemberID
    DataSafe->>DataSafe: Create List of Members without MemberID
    DataSafe->>InternalCreateMemberIDFunction: Call Create MemberID
    InternalCreateMemberIDFunction-->>DataSafe: Internal Create MemberID Function
    alt Error?
        InternalCreateMemberIDFunction-->>DataSafe: Yes
        DataSafe->>InternalCreateMemberIDFunction: Call Create MemberID
    else
        InternalCreateMemberIDFunction-->>DataSafe: No
        alt Anymore in the list?
            InternalCreateMemberIDFunction-->>DataSafe: Yes
            DataSafe->>InternalCreateMemberIDFunction: Call Create MemberID
        else
            InternalCreateMemberIDFunction-->>DataSafe: No
            DataSafe->>DataSafe: Sleep 60 Sec
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
