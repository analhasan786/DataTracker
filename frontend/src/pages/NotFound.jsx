export default function NotFound() {
  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 560, margin: '60px auto', textAlign: 'center' }}>
        <h2>404 — Page Not Found</h2>
        <p className="badge">The page you are looking for doesn't exist.</p>
        <a className="link" href="/">Go to Dashboard</a>
      </div>
    </div>
  );
}
