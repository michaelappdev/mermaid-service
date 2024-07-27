# Mermaid to Cloudflare R2 Renderer

A Node.js Express application that renders Mermaid.js diagrams to images, uploads them to Cloudflare R2, and returns the URL of the uploaded image.

## Features

- Accepts Mermaid.js payloads via a REST API.
- Renders the Mermaid.js diagram to a PNG image using Puppeteer.
- Uploads the rendered image to a Cloudflare R2 bucket.
- Returns a signed URL for accessing the uploaded image.

## Prerequisites

- Node.js (v14 or higher)
- npm
- Cloudflare R2 account with access keys

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/michaelappdev/mermaid-service-v2.git
cd <repository>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory of the project and add your Cloudflare R2 credentials and other configurations:

```plaintext
CLOUDFLARE_ACCOUNT_ID=<Your Cloudflare Account ID>
R2_ACCESS_KEY_ID=<Your R2 Access Key ID>
R2_SECRET_ACCESS_KEY=<Your R2 Secret Access Key>
R2_BUCKET_NAME=<Your R2 Bucket Name>
PORT=3000
```

### 4. Run the application

```bash
node app.js
```

The server will start running on the port specified in the `.env` file (default is 3000).

## Usage

### Render a Mermaid.js Diagram

To render a Mermaid.js diagram and upload it to Cloudflare R2, send a POST request to `/render` with the Mermaid.js payload in the request body.

#### Example Request

```bash
curl -X POST http://localhost:3000/render -H "Content-Type: application/json" -d '{"mermaid": "graph TD; A-->B;A-->C; B-->D; C-->D;"}'
```

#### Example Response

```json
{
  "url": "https://<your-cloudflare-account-id>.r2.cloudflarestorage.com/<your-bucket-name>/mermaid_2023-07-26T12:34:56.789Z.png"
}
```

The response contains a signed URL for accessing the uploaded image.

## Project Structure

```
.
├── app.js
├── package.json
├── package-lock.json
├── .env
└── .gitignore
```

- `app.js`: Main application file.
- `package.json`: Project metadata and dependencies.
- `package-lock.json`: Lockfile for npm dependencies.
- `.env`: Environment variables (not included in version control).
- `.gitignore`: Specifies files and directories to be ignored by git.

## Dependencies

- [express](https://www.npmjs.com/package/express): Fast, unopinionated, minimalist web framework for Node.js.
- [@aws-sdk/client-s3](https://www.npmjs.com/package/@aws-sdk/client-s3): AWS SDK for JavaScript S3 Client.
- [@aws-sdk/s3-request-presigner](https://www.npmjs.com/package/@aws-sdk/s3-request-presigner): AWS SDK for JavaScript S3 Request Presigner.
- [puppeteer](https://www.npmjs.com/package/puppeteer): Headless Chrome Node.js API.
- [dotenv](https://www.npmjs.com/package/dotenv): Loads environment variables from a `.env` file.
- [body-parser](https://www.npmjs.com/package/body-parser): Node.js body parsing middleware.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```