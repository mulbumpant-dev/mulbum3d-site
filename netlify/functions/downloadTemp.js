const fs = require("fs");
const path = require("path");

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
const MAX_AGE_MS = 72 * 60 * 60 * 1000; // 72 hours

// Function to clean old files
function cleanOldFiles() {
  if (!fs.existsSync(UPLOAD_DIR)) return;

  const files = fs.readdirSync(UPLOAD_DIR);
  const now = Date.now();

  files.forEach(file => {
    const filePath = path.join(UPLOAD_DIR, file);
    const stats = fs.statSync(filePath);
    if (now - stats.mtimeMs > MAX_AGE_MS) {
      fs.unlinkSync(filePath);
      console.log(`Deleted old file: ${file}`);
    }
  });
}

exports.handler = async (event) => {
  try {
    cleanOldFiles(); // delete old files each time someone downloads

    const { file } = event.queryStringParameters;
    if (!file) return { statusCode: 400, body: "File required" };

    const filePath = path.join(UPLOAD_DIR, file);
    if (!fs.existsSync(filePath)) return { statusCode: 404, body: "File not found" };

    const data = fs.readFileSync(filePath);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${file}"`
      },
      body: data.toString("base64"),
      isBase64Encoded: true
    };

  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
