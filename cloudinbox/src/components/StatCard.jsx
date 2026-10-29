import { TrendingDown, TrendingUp } from 'lucide-react';
export default function StatCard({ label, value, icon: Icon, tone = 'neutral', trend, hint }) {
  const up = trend >= 0;
  return (
    <div className="card stat">
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        <span className={`stat-icon tone-${tone}`}><Icon size={16} /></span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-foot">
        <span className={`trend ${up ? 'up' : 'down'}`}>{up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}{Math.abs(trend)}%</span>
        <span className="muted">{hint}</span>
      </div>
    </div>
  );
}
