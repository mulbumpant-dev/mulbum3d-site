const fetch = require(node-fetch);
const FormData = require(form-data);

 Discord webhook
const webhookUrl = https://discordapp.com/api/webhooks/1456986141193670677/HCyuy4Ft76RfwEjbyVCyjxgVMUfHAYzO7laQHEFrU1S3rRqUO3LcpCTf6_whmtkPbZm0;

exports.handler = async function(event) {
  if (event.httpMethod !== POST) {
    return { statusCode 405, body Method Not Allowed };
  }

  try {
    const data = JSON.parse(event.body);

    if (!data.fileContent  !data.fileName) {
      return { statusCode 400, body No file uploaded };
    }

     Limit file size to 8MB
    const fileBuffer = Buffer.from(data.fileContent, base64);
    if (fileBuffer.length  8  1024  1024) {
      return { statusCode 400, body File too large for Discord (max 8MB) };
    }

     Prepare Discord payload
    const form = new FormData();
    form.append(file, fileBuffer, { filename data.fileName });
    form.append(payload_json, JSON.stringify({
      content `🖨️ New 3D Print Order
👤 Name ${data.name}
📍 Address ${data.address}, ${data.postcode}
🎨 PLA Color ${data.plaColor}
💷 Total £${data.totalCost}
📧 PayPal ${data.payerEmail}`
    }));

    await fetch(webhookUrl, { method POST, body form });

    return { statusCode 200, body Order logged successfully };
  } catch (err) {
    return { statusCode 500, body Failed to log order  + err.message };
  }
};
