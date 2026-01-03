const fetch = require("node-fetch"); // Netlify functions may need this

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const data = JSON.parse(event.body);

  const webhookUrl = "https://discordapp.com/api/webhooks/1456986141193670677/HCyuy4Ft76RfwEjbyVCyjxgVMUfHAYzO7laQHEFrU1S3rRqUO3LcpCTf6_whmtkPbZm0"; // Replace with your webhook

  const message = {
    content: `🖨️ **New 3D Print Order**
👤 Name: ${data.name}
📦 File: ${data.fileName}
🎨 PLA Color: ${data.plaColor}
📍 Address: ${data.address}, ${data.postcode}
💷 Total: £${data.totalCost}
📧 PayPal: ${data.payerEmail}`
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    });

    return {
      statusCode: 200,
      body: "Order logged successfully"
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Failed to log order: " + err.message
    };
  }
};
