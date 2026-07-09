// Serverless function: creates a Stripe PaymentIntent for a catering order.
// Works as-is on Vercel or Netlify Functions with minor adjustments to the export.
//
// SETUP:
// 1. npm install stripe
// 2. Set STRIPE_SECRET_KEY as an environment variable (never hardcode it, never
//    put it in frontend code — this file only ever runs on the server).
// 3. In your Stripe Dashboard, enable "US bank account" under Settings ->
//    Payment methods so ACH debit (checking/savings) becomes available
//    alongside cards.
//
// The frontend calls this endpoint with the order total, then uses the
// returned client_secret with Stripe's Payment Element to collect card or
// bank details safely (see notes at the bottom of this file).

const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, orderNo, customerEmail } = req.body;

    // amount must be in cents, and should be recalculated server-side from
    // the actual cart contents in a real implementation — never trust a
    // total sent directly from the browser.
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // dollars -> cents
      currency: "usd",
      // Lets Stripe show whichever methods you've enabled in the Dashboard
      // (card, us_bank_account, etc.) without listing them manually here.
      automatic_payment_methods: { enabled: true },
      receipt_email: customerEmail,
      metadata: { orderNo: orderNo || "" },
    });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);
    return res.status(500).json({ error: "Could not create payment" });
  }
};
