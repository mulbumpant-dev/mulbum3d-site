const fetch = require('node-fetch');
const FormData = require('form-data');

exports.handler = async function(event, context) {
  try {
    const data = JSON.parse(event.body);

    const webhook = "https://discord.com/api/webhooks/https://discordapp.com/api/webhooks/1456986141193670677/HCyuy4Ft76RfwEjbyVCyjxgVMUfHAYzO7laQHEFrU1S3rRqUO3LcpCTf6_whmtkPbZm0";

    const form = new FormData();
    form.append("content", `New order received!
Name: ${data.name}
Postcode: ${data.postcode}
Address: ${data.address}
PLA Color: ${data.plaColor}
Total: £${data.totalCost}`);

    const res = await fetch(webhook, { method: 'POST', body: form });

    if (!res.ok) {
      return { statusCode: 500, body: "Failed to send to Discord" };
    }

    return { statusCode: 200, body: "Logged successfully" };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
