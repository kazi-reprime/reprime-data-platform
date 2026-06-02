# 🚀 Backend Deployment — 24/7 Live Property Search

The frontend is static (Vercel). The 24/7 Python backend deploys to **Render** for free.

## One-Click Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/kazi-reprime/reprime-data-platform)

**Or manual steps:**

1. Go to https://dashboard.render.com → **New +** → **Web Service**
2. Connect GitHub → select `kazi-reprime/reprime-data-platform`
3. Settings (Render auto-detects from `render.yaml`):
   - Name: `reprime-backend`
   - Region: Oregon
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python -m uvicorn api.server.app:app --host 0.0.0.0 --port $PORT`
   - Plan: **Free**
4. Add Environment Variables (Settings → Environment):

   | Key | Value (from `api/.env`) |
   |-----|------------------------|
   | `FRED_API_KEY` | 905dc5e3d4f30f6085d40df21894451b |
   | `CENSUS_API_KEY` | 8a459209ffb4b550899560d7e823f318aed5b4fd |
   | `BLS_API_KEY` | 2a585f7700a744b0b1f92f9527dddc44 |
   | `WALK_SCORE_API_KEY` | 65faea6cd5d2de5d076c9548cbcfe98a |
   | `OPENWEATHER_API_KEY` | 49e93931acc0add6a5cecedc228092f3 |
   | `EIA_API_KEY` | OYyCdfKkjDY6bTBEuqaKO2qjvm0jEh4J4mDBw1GU |
   | `FINNHUB_API_KEY` | d8euekhr01qub7keueq0d8euekhr01qub7keueqg |
   | `COINGECKO_API_KEY` | CG-VsYF5ZwShAVjk2cvpigDD6vZ |
   | `ALPHA_VANTAGE_API_KEY` | PH3Q40XIW31RFEBF |
   | `TWELVE_DATA_API_KEY` | c6cea356440b43f681774a1afeb88fed |
   | `DATA_GOV_API_KEY` | dFxxbbTLxZZcmUJ9AsP9eImATKxafBA4qWOpI6Ly |
   | **NEW** keys to add: |  |
   | `MAPBOX_API_KEY` | (get free at mapbox.com) |
   | `MAPILLARY_API_KEY` | (get free at mapillary.com) |
   | `YELP_API_KEY` | (get free at yelp.com/developers) |
   | `SERPER_API_KEY` | (get free at serper.dev) |
   | `RENTCAST_API_KEY` | (get free at rentcast.io) |

5. Click **Deploy**. Takes ~3 minutes.
6. Your backend URL: `https://reprime-backend.onrender.com`

## Connect Frontend to Backend

Once Render shows green status:

1. Visit https://reprime-data-platform.vercel.app/explore
2. Click the **"change"** button next to "Backend:"
3. Enter: `https://reprime-backend.onrender.com`
4. Page reloads — now ANY address you type fetches live data from your Render backend.

## What's Running 24/7

When the backend is up:

- **`/api/property/search?q=<address>`** — Live property search (14 parallel sources)
- **APScheduler runs hourly**: Refreshes 13-API live market data
- **APScheduler runs daily at 3 AM UTC**: Re-scrapes all 611 sources
- **Heartbeat every 5 min**: Logs scheduler health

⚠️ **Render Free Tier Caveat**: Sleeps after 15 min of inactivity. First request after sleep takes ~30 sec to wake up. For true 24/7 with no cold starts, upgrade to Starter ($7/mo).

## Alternative: Run Locally + ngrok (instant)

```bash
# Terminal 1
cd /Users/mkazi/Downloads/API
python3 -m uvicorn api.server.app:app --host 0.0.0.0 --port 8001

# Terminal 2 — expose to internet (install ngrok first: brew install ngrok)
ngrok http 8001
# Copy the https://xxx.ngrok.io URL
```

Then in `/explore`, click "change" and paste the ngrok URL.

## Free API Keys to Get (Unlocks More Data)

You said yes to all 6. Here are the signup links:

| API | Free Tier | Signup |
|-----|-----------|--------|
| **Mapbox** | 50,000 requests/mo | https://mapbox.com/signup |
| **Mapillary** | Unlimited | https://mapillary.com/dashboard/developers |
| **Yelp Fusion** | 5,000/day | https://yelp.com/developers/v3/manage_app |
| **Serper.dev** | 2,500 searches | https://serper.dev/ |
| **RentCast** | 50/month | https://app.rentcast.io/app/api |
| **RapidAPI** | Varies per API | https://rapidapi.com/hub (search "Zillow") |

Once you have any key, add to `api/.env` locally and to Render env vars in production.

## What This Unlocks

**With Mapbox**: 3 satellite/street imagery layers for any property
**With Mapillary**: 12+ community street-view photos per address
**With Yelp**: 15 businesses near property with ratings, reviews, prices
**With Serper**: 10 Google search results about the property, news, listings
**With RentCast**: Property records, rent estimate, valuation, comps
**With RapidAPI Zillow scraper**: Real Zillow listing data for any address
