require("dotenv").config();
const { S3Client, ListObjectsCommand } = require("@aws-sdk/client-s3");

async function testCloudflareCreds() {
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

  try {
    const command = new ListObjectsCommand({
      Bucket: BUCKET_NAME,
    });

    const response = await s3Client.send(command);
    console.log(
      "Successfully connected to Cloudflare R2. Bucket contents:",
      response.Contents,
    );
  } catch (error) {
    console.error("Error connecting to Cloudflare R2:", error);
  }
}

testCloudflareCreds();
