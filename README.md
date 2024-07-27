# Mermaid.js Renderer and Uploader

This application allows you to render Mermaid.js diagrams, convert them to PNG format, and upload them to Cloudflare R2 storage. The service is built using Node.js, Express, Puppeteer, and Sharp.

## Prerequisites

Ensure you have the following installed:

- Node.js (>= 14.x)
- npm (Node Package Manager)
- AWS SDK for JavaScript v3

## Environment Variables

Create a `.env` file in the root directory of your project and add the following variables:

```
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_r2_bucket_name
PORT=3001
```

Replace the placeholder values with your actual Cloudflare R2 credentials and bucket name.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/michaelappdev/mermaid-service.git
    cd mermaid-r2-renderer
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

## Running the Server

To start the server, run:

```bash
node index.js
```

The server will run on the port specified in your `.env` file or default to port 3001.

## API Endpoint

### POST /render

This endpoint accepts a Mermaid.js diagram, renders it, converts it to a PNG, and uploads it to Cloudflare R2.

#### Request

- **URL**: `/render`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**: 

    ```json
    {
        "mermaid": "graph TD; A-->B; A-->C; B-->D; C-->D;"
    }
    ```

#### Response

- **Success**: `200 OK`
    ```json
    {
        "url": "https://your_r2_dev_subdomain/mermaid_YYYY-MM-DD_HH-MM-SS.png"
    }
    ```

- **Error**: `400 Bad Request`
    ```json
    {
        "error": "No Mermaid.js payload provided"
    }
    ```

- **Error**: `500 Internal Server Error`
    ```json
    {
        "error": "Error rendering Mermaid.js"
    }
    ```

## How It Works

1. **Setup**: The application configures an S3 client to connect to Cloudflare R2 using the provided credentials.
2. **Helper Function**: A helper function generates a unique, safe filename based on the current date and time.
3. **Endpoint**: The `/render` endpoint:
    - Accepts a Mermaid.js diagram in the request body.
    - Uses Puppeteer to render the diagram in a headless browser.
    - Captures a screenshot of the rendered diagram.
    - Converts the screenshot to PNG format using Sharp.
    - Uploads the PNG to Cloudflare R2.
    - Returns the public URL of the uploaded PNG.

## Logging

The application logs the public URL of the uploaded PNG for debugging purposes.

## Dependencies

- `dotenv`: Loads environment variables from a `.env` file.
- `express`: Web framework for Node.js.
- `@aws-sdk/client-s3`: AWS SDK for interacting with S3 and R2.
- `body-parser`: Middleware for parsing JSON request bodies.
- `puppeteer`: Headless Chrome Node.js API.
- `sharp`: High-performance image processing library.

## License

This project is licensed under the MIT License.