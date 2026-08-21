// Serverless function: creates a Stripe Checkout Session and returns the
// URL for Stripe's own hosted, secure payment page.
//
// This is the endpoint the website calls when a customer clicks
// "Pay $X securely" — it hands off to Stripe entirely, so card and bank
// account numbers are never seen by this website's own code.
//
// SETUP (already done if you followed along):
// 1. STRIPE_SECRET_KEY is set as an environment variable in Vercel.
// 2. In the Stripe Dashboard, under Settings -> Payment methods, make sure
//    both "Card" and "US bank account" (ACH) are turned on so customers
//    see both options on Stripe's payment page.

import Stripe from "stripe";
console.log("DEBUG: STRIPE_SECRET_KEY prefix seen at runtime:", (process.env.STRIPE_SECRET_KEY || "MISSING").slice(0, 12));
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      amount, orderNo, customerEmail, customerName, customerPhone,
      fulfillment, date, time, address, itemsSummary,
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const origin = req.headers.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "us_bank_account"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `CTown Catering order${orderNo ? " #" + orderNo : ""}`,
            },
            unit_amount: Math.round(amount * 100), // dollars -> cents
          },
          quantity: 1,
        },
      ],
      customer_email: customerEmail || undefined,
      metadata: {
        orderNo: orderNo || "",
        customerName: customerName || "",
        customerPhone: customerPhone || "",
        fulfillment: fulfillment || "",
        date: date || "",
        time: time || "",
        address: address || "",
        itemsSummary: (itemsSummary || "").slice(0, 490), // Stripe metadata value limit
      },
      success_url: `${origin}/?paid=1`,
      cancel_url: `${origin}/?canceled=1`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({ error: "Could not create payment" });
  }
}

