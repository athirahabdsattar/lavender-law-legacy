# DEGUP Social Studio relay

LinkedIn and TikTok don't accept posts sent directly from a web page. This tiny Cloudflare
Worker passes the studio's requests on to them. It stores nothing and only talks to LinkedIn,
TikTok, and (for downloads only) your public media URLs. Every request must carry your secret.

## Deploy from the dashboard (no coding)

1. Sign up free at https://dash.cloudflare.com
2. **Workers & Pages → Create → Create Worker**, name it `degup-relay`, click **Deploy**
3. **Edit code**, replace everything with `worker.js` from this folder, click **Deploy**
4. **Settings → Variables and Secrets → Add**: type _Secret_, name `RELAY_SECRET`, value = a long random password
5. In the studio, go to **Accounts → Relay for LinkedIn & TikTok** and paste the worker URL
   (e.g. `https://degup-relay.<you>.workers.dev`) and the same password

## Or deploy from the command line

```bash
cd relay
npx wrangler deploy
npx wrangler secret put RELAY_SECRET
```

The free Workers plan (100,000 requests/day) is far more than you need.
