# Ashley & Paul — Wedding Website

A minimal static site: `index.html`, `styles.css`, `script.js`. No build step, no framework — Vercel will deploy it as-is.

## Deploy to Vercel

1. Create a new GitHub repo and push these three files (plus this README) to it.
2. Go to vercel.com → **Add New Project** → import the repo.
3. Leave the framework preset as **Other**. Vercel will serve `index.html` at the root automatically. Click **Deploy**.
4. Once live, add your custom domain under the project's **Settings → Domains**.

## Before you launch, do these three things

1. **Connect the RSVP form.** It's built and styled but not wired to anywhere yet.
   - Go to [formspree.io](https://formspree.io), create a free form, and copy the endpoint URL.
   - Open `script.js`, find `const RSVP_ENDPOINT = '';` near the top, and paste your endpoint URL between the quotes.
   - Formspree's free tier emails you each submission and gives you a dashboard of responses.
2. **Add real photos.** In `index.html`, find the `Moments` section (search for `gallery-item placeholder`) and swap those divs for `<img>` tags pointing at your photos. Drop the image files in a new `/images` folder next to `index.html`.
3. **Add a registry link.** In `index.html`, find the `Registry` section and set the `href` on the "View registry" button to your registry URL.

## Notes

- The countdown and schedule times are set for 3:00 PM–11:00 PM Pacific on Dec 18, 2026. If the venue times change, update `WEDDING_DATE` in `script.js` and the two ICS timestamps just below it (they're in UTC).
- The schedule map uses a keyless Google Maps embed pointed at Rancho Las Lomas — no API key needed.
- "Where to stay" is currently a disabled placeholder link — hook it up once you have hotel recommendations.
