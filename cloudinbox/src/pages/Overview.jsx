import { CheckCircle2, Clock, Inbox, Mail } from 'lucide-react';
import { useInbox } from '../hooks/InboxContext';
import StatCard from '../components/StatCard';
import MessageTable from '../components/MessageTable';

export default function Overview() {
  const { messages, loading } = useInbox();
  const count = (s) => messages.filter((m) => m.status === s).length;
  const recent = [...messages].sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)).slice(0, 5);
  return (
    <>
      <p className="lede">Review incoming contact messages, assign a status and keep notes for your team. Figures below are calculated from local sample data; trend percentages are illustrative.</p>
      <div className="stats">
        <StatCard label="Total messages" value={loading ? '–' : messages.length} icon={Inbox} trend={12} hint="vs. previous 7 days" />
        <StatCard label="New" value={loading ? '–' : count('new')} icon={Mail} tone="blue" trend={8} hint="vs. previous 7 days" />
        <StatCard label="In progress" value={loading ? '–' : count('in_progress')} icon={Clock} tone="amber" trend={-3} hint="vs. previous 7 days" />
        <StatCard label="Resolved" value={loading ? '–' : count('resolved')} icon={CheckCircle2} tone="green" trend={15} hint="vs. previous 7 days" />
      </div>
      <section className="card">
        <div className="card-head"><h2>Latest messages</h2><a className="btn" href="#/messages">View all messages</a></div>
        {loading ? <div className="skeleton-list">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton" />)}</div> : <MessageTable rows={recent} />}
      </section>
    </>
  );
}