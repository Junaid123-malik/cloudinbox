import { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useInbox } from '../hooks/InboxContext';
import { getAnalytics } from '../services';
import { PRIORITY_LABEL, STATUS_LABEL } from '../utils/format';

const STATUS_COLOR = { new: '#3B5BDB', in_progress: '#D9822B', resolved: '#1F9D6B' };
const PRIO_COLOR = { high: '#D64545', medium: '#8A94A6', low: '#C5CCD8' };

export default function Analytics() {
  const { messages } = useInbox();
  const [data, setData] = useState(null);
  useEffect(() => { getAnalytics().then(setData).catch(() => setData({ error: true })); }, []);

  const status = useMemo(() => Object.keys(STATUS_LABEL).map((k) => ({ key: k, name: STATUS_LABEL[k], value: messages.filter((m) => m.status === k).length })), [messages]);
  const prio = useMemo(() => Object.keys(PRIORITY_LABEL).map((k) => ({ key: k, name: PRIORITY_LABEL[k], value: messages.filter((m) => m.priority === k).length })), [messages]);

  return (
    <>
      <p className="lede">Distribution charts reflect the messages currently loaded. Volume and response times are <strong>sample data</strong> for layout purposes, not measured from a live system.</p>
      <div className="grid-2">
        <section className="card pad wide">
          <h2>Messages received, last 14 days <span className="tag">Sample data</span></h2>
          <div className="chart">
            {data?.volume ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.volume} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs><linearGradient id="vol" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3B5BDB" stopOpacity={0.18} /><stop offset="100%" stopColor="#3B5BDB" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--muted)' }} interval="preserveStartEnd" />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--muted)' }} allowDecimals={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" name="Messages" stroke="#3B5BDB" strokeWidth={2} fill="url(#vol)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : <div className="skeleton fill" />}
          </div>
        </section>
        <section className="card pad">
          <h2>Status distribution</h2>
          <div className="chart chart-sm">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={status} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={2} stroke="none">{status.map((s) => <Cell key={s.key} fill={STATUS_COLOR[s.key]} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="legend">{status.map((s) => <li key={s.key}><i style={{ background: STATUS_COLOR[s.key] }} />{s.name}<b>{s.value}</b></li>)}</ul>
        </section>
        <section className="card pad">
          <h2>Priority distribution</h2>
          <div className="chart chart-sm">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prio} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: 'var(--muted)' }} />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--muted)' }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" name="Messages" radius={[4, 4, 0, 0]} maxBarSize={44}>{prio.map((p) => <Cell key={p.key} fill={PRIO_COLOR[p.key]} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="card pad wide">
          <h2>Response time summary <span className="tag">Sample data</span></h2>
          <dl className="metrics">
            {data?.responseTimes && [['Average first response', data.responseTimes.firstResponse], ['Median response', data.responseTimes.median], ['90th percentile', data.responseTimes.p90], ['Resolution rate', data.responseTimes.resolutionRate]].map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </section>
      </div>
    </>
  );
}
