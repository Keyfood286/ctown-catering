// Serverless function: fires automatically the moment Stripe confirms a
// payment actually succeeded. This is what sends you (the store) an email
// and logs the order to Airtable — it's the real source of truth, not the
// customer's browser, since their connection could drop right after paying.
//
// SETUP:
// 1. Stripe Dashboard -> Developers -> Webhooks -> Add an endpoint:
//    https://YOURDOMAIN/api/stripe-webhook
//    Subscribe it to the "checkout.session.completed" event.
//    Copy the "Signing secret" into an env var called STRIPE_WEBHOOK_SECRET.
//
// 2. Resend (resend.com) -> get an API key -> env var RESEND_API_KEY.
//    Set STORE_NOTIFY_EMAIL to the email address that should receive new
//    order alerts (e.g. the store's own email).
//
// 3. Airtable (airtable.com) -> create a base with a table for orders ->
//    get a Personal Access Token -> env vars AIRTABLE_API_KEY,
//    AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME.
//
// If any of these env vars are missing, this function just skips that
// step quietly rather than failing the whole webhook.

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Vercel serverless functions need the RAW request body (not JSON-parsed)
// to verify a Stripe webhook signature.
export const config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function notifyByEmail(order) {
  if (!process.env.RESEND_API_KEY || !process.env.STORE_NOTIFY_EMAIL) return;

  const html = `
    <h2>New catering order #${order.orderNo}</h2>
    <p><b>${order.fulfillment === "delivery" ? "Delivery" : "Pickup"}</b> — ${order.date} at ${order.time}</p>
    <p>${order.address}</p>
    <p>${order.customerName} · ${order.customerEmail} · ${order.customerPhone}</p>
    <hr />
    <p>${order.itemsSummary.replace(/; /g, "<br/>")}</p>
    <hr />
    <p><b>Total paid: $${order.total}</b></p>
  `;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "CTown Catering Orders <onboarding@resend.dev>",
      to: [process.env.STORE_NOTIFY_EMAIL],
      subject: `New order #${order.orderNo} — $${order.total}`,
      html,
    }),
  });
}

async function logToAirtable(order) {
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID || !process.env.AIRTABLE_TABLE_NAME) return;

  const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(process.env.AIRTABLE_TABLE_NAME)}`;

  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: {
        "Order No": order.orderNo,
        "Fulfillment": order.fulfillment,
        "Date": order.date,
        "Time": order.time,
        "Address": order.address,
        "Customer Name": order.customerName,
        "Email": order.customerEmail,
        "Phone": order.customerPhone,
        "Items": order.itemsSummary,
        "Total": Number(order.total),
      },
    }),
  });
}

export default async function handler(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const m = session.metadata || {};

    const order = {
      orderNo: m.orderNo || "",
      fulfillment: m.fulfillment || "",
      date: m.date || "",
      time: m.time || "",
      address: m.address || "",
      customerName: m.customerName || "",
      customerEmail: session.customer_details?.email || "",
      customerPhone: m.customerPhone || "",
      itemsSummary: m.itemsSummary || "",
      total: ((session.amount_total || 0) / 100).toFixed(2),
    };

    try {
      await Promise.all([notifyByEmail(order), logToAirtable(order)]);
    } catch (err) {
      // Don't fail the webhook over a notification hiccup — Stripe already
      // has the payment recorded either way.
      console.error("Notification error:", err);
    }
  }

  res.status(200).json({ received: true });
}
