exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body || "{}");

    if (!process.env.DISCORD_WEBHOOK_URL) {
      throw new Error("DISCORD_WEBHOOK_URL not set");
    }

    const payload = {
      username: "Mulbum3D Orders",
      embeds: [{
        title: "🖨️ New 3D Print Order",
        color: 0xff7a1a,
        fields: [
          { name: "Customer", value: data.name || "N/A", inline: true },
          { name: "Email", value: data.payerEmail || "N/A", inline: true },
          { name: "Order ID", value: data.orderId || "N/A" },
          { name: "File", value: data.fileName || "N/A" },
          { name: "PLA Colour", value: data.plaColor || "N/A", inline: true },
          { name: "Total", value: `£${data.totalCost || "0.00"}`, inline: true },
          { name: "Address", value: data.address || "N/A" }
        ],
        timestamp: new Date().toISOString()
      }]
    };

    const res = await fetch(process.env.https://discordapp.com/api/webhooks/1456986141193670677/HCyuy4Ft76RfwEjbyVCyjxgVMUfHAYzO7laQHEFrU1S3rRqUO3LcpCTf6_whmtkPbZm0, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error("Discord webhook failed");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: err.message
    };
  }
};
