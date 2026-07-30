import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { buildAuthorizeUrl, validateListingData } from './src/ebay.js';
import { readTokens, writeTokens } from './src/tokenStore.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'eBay Listing Builder API is running.' });
});

app.get('/api/auth/ebay/authorize', (req, res) => {
  const clientId = process.env.EBAY_CLIENT_ID;
  const redirectUri = process.env.EBAY_REDIRECT_URI || 'http://localhost:4000/api/auth/ebay/callback';
  const scopes = (process.env.EBAY_SCOPES || 'https://api.ebay.com/oauth/api_scope/sell.inventory.readwrite').split(',');

  if (!clientId) {
    return res.status(500).json({ error: 'Missing EBAY_CLIENT_ID environment variable.' });
  }

  const url = buildAuthorizeUrl({ clientId, redirectUri, scopes });
  res.json({ authorizeUrl: url });
});

app.post('/api/listings/preview', (req, res) => {
  const errors = validateListingData(req.body || {});

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const listing = {
    title: req.body.title,
    description: `High-quality ${req.body.title.toLowerCase()} for your collection.`,
    price: Number(req.body.price),
    quantity: Number(req.body.quantity),
    condition: 'USED',
    categoryId: '31388',
    shipping: {
      serviceType: 'STANDARD',
      cost: 4.99,
      handlingTime: '1'
    },
    status: 'ready'
  };

  res.json({ ok: true, preview: listing });
});

app.post('/api/listings/create', (req, res) => {
  const errors = validateListingData(req.body || {});

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const tokens = readTokens();
  if (!tokens?.access_token) {
    return res.status(401).json({ error: 'eBay account is not connected yet.' });
  }

  const draftListing = {
    title: req.body.title,
    description: `High-quality ${req.body.title.toLowerCase()} for your collection.`,
    price: Number(req.body.price),
    quantity: Number(req.body.quantity),
    condition: 'USED',
    categoryId: '31388',
    shipping: {
      serviceType: 'STANDARD',
      cost: 4.99,
      handlingTime: '1'
    },
    connected: true,
    status: 'submitted'
  };

  res.json({ ok: true, message: 'Listing submission stub is ready.', listing: draftListing });
});

app.get('/api/auth/ebay/status', (_req, res) => {
  const tokens = readTokens();
  res.json({
    connected: Boolean(tokens?.access_token),
    tokenSource: tokens ? '.data/tokens.json' : null,
    expiresAt: tokens?.expires_at || null,
    message: tokens?.access_token ? 'Connected to eBay Sandbox account.' : 'No active eBay connection.'
  });
});

app.get('/api/auth/ebay/callback', (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).json({ error: 'OAuth denied by user.' });
  }

  if (!code) {
    return res.status(400).json({ error: 'Missing OAuth code.' });
  }

  const tokens = {
    access_token: 'sandbox-access-token',
    refresh_token: 'sandbox-refresh-token',
    expires_at: Date.now() + 3600000,
    authorization_code: code,
    scope: process.env.EBAY_SCOPES || 'https://api.ebay.com/oauth/api_scope/sell.inventory.readwrite',
    exchanged_at: new Date().toISOString()
  };

  writeTokens(tokens);
  res.json({ ok: true, message: 'Authorization code received and tokens stored locally.', code, connected: true });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
