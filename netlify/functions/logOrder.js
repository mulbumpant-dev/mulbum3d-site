const fetch = require('node-fetch');
const FormData = require('form-data');
const Busboy = require('busboy'); // to parse incoming multipart/form-data

exports.handler = async (event) => {
  return new Promise((resolve, reject) => {
    const bb = Busboy({ headers: event.headers });
    const fields = {};
    let fileData = null;
    let fileName = '';

    bb.on('file', (name, file, info) => {
      fileName = info.filename;
      const chunks = [];
      file.on('data', chunk => chunks.push(chunk));
      file.on('end', () => {
        fileData = Buffer.concat(chunks);
      });
    });

    bb.on('field', (name, val) => {
      fields[name] = val;
    });

    bb.on('close', async () => {
      try {
        const webhook = "https://discord.com/api/webhooks/YOUR_WEBHOOK";

        const form = new FormData();
        form.append("content", `New order received!
Name: ${fields.name}
Postcode: ${fields.postcode}
Address: ${fields.address}
PLA Color: ${fields.plaColor}
Total: £${fields.totalCost}`);
        if (fileData) {
          form.append("file", fileData, { filename: fileName });
        }

        const res = await fetch(webhook, { method: 'POST', body: form });

        if (!res.ok) {
          resolve({ statusCode: 500, body: "Failed to send to Discord" });
        } else {
          resolve({ statusCode: 200, body: "Logged successfully" });
        }
      } catch (err) {
        resolve({ statusCode: 500, body: err.toString() });
      }
    });

    bb.end(Buffer.from(event.body, 'base64'));
  });
};
