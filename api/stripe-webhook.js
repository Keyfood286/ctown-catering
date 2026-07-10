// Serverless function: listens for Stripe telling you a payment actually
// went through. This — not the browser's "success" screen — is the source
// of truth for marking an order as paid, since a customer's connection
// could drop right after paying.
//
// SETUP:
// 1. In the Stripe Dashboard -> Developers -> Webhooks, add an endpoint
//    pointing at wherever this function is deployed, e.g.
//    https://yoursite.com/api/stripe-webhook
// 2. Subscribe it to the "payment_intent.succeeded" event.
// 3. Copy the "Signing secret" Stripe gives you into an environment
//    variable called STRIPE_WEBHOOK_SECRET.
//
// Note: this endpoint needs the RAW request body (not JSON-parsed) to
// verify the signature — on Vercel, disable the default body parser for
// this route; on Netlify Functions this is handled automatically.

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // must be the raw, unparsed body
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const orderNo = paymentIntent.metadata?.orderNo;

    // This is where you'd mark the order as paid in your own database,
    // send a confirmation email, notify the kitchen, etc.
    console.log(`Order ${orderNo} paid — amount: ${paymentIntent.amount / 100}`);
  }

  res.status(200).json({ received: true });
}
