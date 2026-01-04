const fetch = require('node-fetch');
const FormData = require('form-data');
const Busboy = require('busboy');

exports.handler = async (event) => {
  return new Promise((resolve) => {
    const bb = Busboy({ headers: event.headers });
    const fields = {};
    let fileBuffer = null;
    let fileName = '';

    bb.on('file', (name, file, info) => {
      fileName = info.filename;
      const chunks = [];
      file.on('data', (chunk) => chunks.push(chunk));
      file.on('end', () => { fileBuffer = Buffer.concat(chunks); });
    });

    bb.on('field', (name, val) => { fields[name] = val; });

    bb.on('close', async () => {
      try {
        const webhook = "https://discordapp.com/api/webhooks/1456986141193670677/HCyuy4Ft76RfwEjbyVCyjxgVMUfHAYzO7laQHEFrU1S3rRqUO3LcpCTf6_whmtkPbZm0";
        const form = new FormData();

        form.append("content", `New order received!
Name: ${fields.name}
Postcode: ${fields.postcode}
Address: ${fields.address}
PLA Color: ${fields.plaColor}
Total: £${fields.totalCost}`);

        if (fileBuffer) {
          form.append("file", fileBuffer, { filename: fileName });
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
