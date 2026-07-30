import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAuthorizeUrl, validateListingData } from './ebay.js';

test('buildAuthorizeUrl includes required OAuth parameters', () => {
  const url = buildAuthorizeUrl({
    clientId: 'demo-client-id',
    redirectUri: 'http://localhost:4000/api/auth/ebay/callback',
    scopes: ['https://api.ebay.com/oauth/api_scope/sell.inventory.readwrite']
  });

  assert.match(url, /response_type=code/);
  assert.match(url, /client_id=demo-client-id/);
  assert.match(url, /redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fapi%2Fauth%2Febay%2Fcallback/);
  assert.match(url, /scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope%2Fsell.inventory.readwrite/);
});

test('validateListingData flags missing required fields', () => {
  const errors = validateListingData({ title: '', price: '', quantity: '' });
  assert.deepEqual(errors, ['Title is required.', 'Price is required.', 'Quantity is required.']);
});
