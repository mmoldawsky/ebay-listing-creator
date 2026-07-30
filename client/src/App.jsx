import { useEffect, useState } from 'react';

function App() {
  const [health, setHealth] = useState('Checking API...');
  const [connected, setConnected] = useState(false);
  const [listing, setListing] = useState({ title: '', price: '', quantity: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealth(data.message))
      .catch(() => setHealth('API unavailable.'));

    fetch('/api/auth/ebay/status')
      .then((res) => res.json())
      .then((data) => setConnected(Boolean(data.connected)))
      .catch(() => setConnected(false));
  }, []);

  async function handlePreview(e) {
    e.preventDefault();
    setError('');
    setResult(null);

    const response = await fetch('/api/listings/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listing)
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.errors?.join(' '));
      return;
    }

    setResult(data.preview);
  }

  async function handleConnect() {
    const response = await fetch('/api/auth/ebay/authorize');
    const data = await response.json();

    if (data.authorizeUrl) {
      window.open(data.authorizeUrl, '_blank', 'noopener,noreferrer');
      setConnected(true);
    }
  }

  async function handleSubmit() {
    setError('');

    const response = await fetch('/api/listings/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listing)
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || data.errors?.join(' '));
      return;
    }

    setResult(data.listing);
  }

  return (
    <div className="app-shell">
      <header>
        <h1>eBay Listing Builder</h1>
        <p>{health}</p>
        <p>Status: {connected ? 'Connected to eBay' : 'Not connected'}</p>
      </header>

      <main className="grid">
        <section>
          <h2>Create a draft listing</h2>
          <form onSubmit={handlePreview}>
            <label>
              Title
              <input value={listing.title} onChange={(e) => setListing({ ...listing, title: e.target.value })} />
            </label>
            <label>
              Price
              <input value={listing.price} onChange={(e) => setListing({ ...listing, price: e.target.value })} />
            </label>
            <label>
              Quantity
              <input value={listing.quantity} onChange={(e) => setListing({ ...listing, quantity: e.target.value })} />
            </label>
            <button type="submit">Preview listing</button>
            <button type="button" onClick={handleConnect}>Connect eBay account</button>
            <button type="button" onClick={handleSubmit}>Submit draft</button>
          </form>
        </section>

        <aside>
          <h2>Preview</h2>
          {error && <p className="error">{error}</p>}
          {result ? (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          ) : (
            <p>Submit a draft to preview it.</p>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;
