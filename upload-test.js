require("dotenv").config();
const {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const fs = require("fs");

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

const testUploadAndSignUrl = async () => {
  try {
    // Read a local image file (for testing purposes)
    const buffer = fs.readFileSync("sample.png"); // Ensure there's a sample.png in your working directory

    // Generate a unique file name with current date/time
    const fileName = `test_${new Date().toISOString()}.png`;

    // Upload the image to R2
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: "image/png",
    });

    await s3Client.send(uploadCommand);

    // Generate a signed URL for the uploaded image
    const getObjectCommand = new ListObjectsCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
    });

    const signedUrl = await getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: 3600,
    });

    console.log("Signed URL:", signedUrl); // Log the signed URL for debugging
  } catch (error) {
    console.error("Error during upload or URL generation:", error);
  }
};

testUploadAndSignUrl();
