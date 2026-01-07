const { google } = require('googleapis');
const fetch = require('node-fetch');

const WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1456986141193670677/HCyuy4Ft76RfwEjbyVCyjxgVMUfHAYzO7laQHEFrU1S3rRqUO3LcpCTf6_whmtkPbZm0';
const FOLDER_ID = 'https://drive.google.com/drive/folders/1MzmD9oyAKThEt2vIpTq50noABlPxr9JF?usp=sharing';

const auth = new google.auth.GoogleAuth({
  credentials: require('./service-account.json'), // your downloaded JSON
  scopes: ['https://www.googleapis.com/auth/drive.file']
});

exports.handler = async function(event) {
  try {
    const data = JSON.parse(event.body);

    // Upload file to Google Drive
    const drive = google.drive({ version: 'v3', auth });
    const fileMetadata = { name: data.fileName, parents: [FOLDER_ID] };
    const media = {
      mimeType: 'application/octet-stream',
      body: Buffer.from(data.fileBase64, 'base64')
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id, webViewLink'
    });

    const link = file.data.webViewLink; // This is the link you can send

    // Send to Discord
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `New Order!
Name: ${data.name}
Postcode: ${data.postcode}
Address: ${data.address}
PLA Colour: ${data.color}
Quantity: ${data.qty}
Total: £${data.total}
File: ${data.fileName}
Download Link: ${link}`
      })
    });

    return { statusCode: 200, body: 'Order uploaded and sent!' };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Error uploading order' };
  }
};
