const STEPS = [
  ['React + Vite', 'Static frontend hosted on Amazon S3 and delivered through CloudFront.'],
  ['Amazon API Gateway', 'REST routes with a Cognito authorizer on admin endpoints.'],
  ['AWS Lambda', 'One function per route: validate input, read and write data.'],
  ['Amazon DynamoDB', 'Messages table keyed by message id, with a status index.'],
];
export default function Help() {
  return (
    <div className="settings">
      <section className="card pad">
        <h2>Planned serverless architecture</h2>
        <p className="muted small">This frontend currently runs on local sample data. The services layer in <code>src/services</code> is where the AWS API will be connected.</p>
        <ol className="flow">{STEPS.map(([t, d]) => <li key={t}><div className="strong">{t}</div><div className="muted small">{d}</div></li>)}</ol>
        <p className="muted small">Supporting services: IAM least-privilege roles for each Lambda, CloudWatch for logs and alarms.</p>
      </section>
      <section className="card pad">
        <h2>Frequently asked questions</h2>
        <details><summary>Where is my data stored?</summary><p className="muted">In memory in your browser. Refreshing the page resets it.</p></details>
        <details><summary>How do I test the contact form?</summary><p className="muted">Choose New message in the top bar. Submitted messages appear in your inbox during the same session.</p></details>
        <details><summary>How do I connect a real API?</summary><p className="muted">Set <code>VITE_API_BASE_URL</code>, set <code>VITE_USE_MOCK=false</code> and follow the README endpoint contract.</p></details>
      </section>
    </div>
  );
}
