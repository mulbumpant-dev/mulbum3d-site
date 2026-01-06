const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    // Temporary file download URL (served from Netlify)
    const downloadUrl = `https://YOUR-SITE-NAME.netlify.app/.netlify/functions/downloadTemp?file=${encodeURIComponent(body.fileName)}`;

    // Discord webhook payload
    const payload = {
      content: `🟧 New 3D Print Order
👤 Name: ${body.name}
📍 Postcode: ${body.postcode}
🏠 Address: ${body.address}
🎨 PLA: ${body.plaColor}
💷 Total: £${body.totalCost}

📦 File uploaded
🔗 Download here: ${downloadUrl}`
    };

    await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    return { statusCode: 200, body: "Order logged" };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
