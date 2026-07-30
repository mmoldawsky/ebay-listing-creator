import { buildAuthorizeUrl, validateListingData } from '../src/ebay.js';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertDeepEqual(actual, expected, message) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);

  if (actualJson !== expectedJson) {
    throw new Error(`${message}: expected ${expectedJson} but received ${actualJson}`);
  }
}

const authorizeUrl = buildAuthorizeUrl({
  clientId: 'demo-client-id',
  redirectUri: 'http://localhost:4000/api/auth/ebay/callback',
  scopes: ['https://api.ebay.com/oauth/api_scope/sell.inventory.readwrite']
});

assert(authorizeUrl.includes('response_type=code'), 'OAuth URL should contain response_type=code');
assert(authorizeUrl.includes('client_id=demo-client-id'), 'OAuth URL should contain client_id');

const errors = validateListingData({ title: '', price: '', quantity: '' });
assertDeepEqual(errors, ['Title is required.', 'Price is required.', 'Quantity is required.'], 'Validation should flag missing fields');

console.log('Passed 2 checks.');
