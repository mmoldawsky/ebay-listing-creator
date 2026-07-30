# eBay Listing Builder

A local-first MVP for creating eBay listings through the eBay Sell APIs.

## Features
- Connect your eBay seller account using OAuth 2.0
- Create listings from a simple form
- Preview listing data before submission
- Store OAuth tokens locally for repeat use

## Setup
1. Copy the server environment template:
   - `cp server/.env.example server/.env`
2. Fill in your eBay developer credentials:
   - `EBAY_CLIENT_ID`
   - `EBAY_CLIENT_SECRET`
   - `EBAY_REDIRECT_URI`
   - `EBAY_ENV=sandbox`
3. Install dependencies:
   - `npm install`
   - `npm --prefix server install`
   - `npm --prefix client install`
4. Start the app:
   - `npm run dev`

## Notes
- Use eBay Sandbox first to avoid creating live listings during development.
- The app stores tokens locally in `.data/tokens.json`.
- Keep `.env` and token files out of source control.
