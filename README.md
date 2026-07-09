# CTown Catering — deploy guide

This is a real, buildable React project (Vite + Tailwind) containing the
catering ordering site. Follow these steps to get it live on the internet
with your own domain.

## 1. Run it locally (optional, to check everything works)

```bash
npm install
npm run dev
```

Open the URL it prints (usually http://localhost:5173).

## 2. Put it on GitHub

Create a new repository on GitHub, then from this folder:

```bash
git init
git add .
git commit -m "Initial catering site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## 3. Deploy on Vercel (recommended — free tier, easiest)

1. Go to vercel.com and sign up (you can use your GitHub account).
2. Click "Add New Project" and select the GitHub repo you just pushed.
3. Vercel auto-detects Vite — leave the default settings and click Deploy.
4. In a minute or two you'll get a live URL like `ctown-catering.vercel.app`.

The `api/` folder in this project (the Stripe payment endpoints) will
automatically work as serverless functions on Vercel with no extra setup —
just add your `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` under
Project Settings -> Environment Variables once you're ready to accept real
payments.

## 4. Buy and connect your domain

1. Buy a domain from any registrar (Namecheap, Cloudflare, etc.).
2. In your Vercel project, go to Settings -> Domains and add your domain.
3. Vercel shows you 1-2 DNS records to add at your registrar (usually an
   A record or CNAME).
4. Once DNS updates (minutes to a few hours), your domain points straight
   at the live site.

## Notes

- The `api/` payment functions are starter code — see the comments inside
  each file for what still needs to be filled in (Stripe keys, webhook
  secret) before real payments can be accepted.
- This site is entirely frontend + two small serverless functions — no
  database is set up yet, so orders aren't currently saved anywhere. That
  would be a good next addition once the site is live.
