import querystring from 'node:querystring';

export function buildAuthorizeUrl({ clientId, redirectUri, scopes }) {
  const params = {
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
    prompt: 'login'
  };

  return `https://auth.ebay.com/oauth2/authorize?${querystring.stringify(params)}`;
}

export function validateListingData(listing) {
  const errors = [];

  if (!listing.title || !listing.title.trim()) {
    errors.push('Title is required.');
  }

  if (!listing.price || Number.isNaN(Number(listing.price))) {
    errors.push('Price is required.');
  }

  if (!listing.quantity || Number.isNaN(Number(listing.quantity))) {
    errors.push('Quantity is required.');
  }

  return errors;
}
