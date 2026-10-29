import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Clock, Inbox, RefreshCw, SearchX, Trash2, TriangleAlert } from 'lucide-react';
import { useInbox } from '../hooks/InboxContext';
import MessageTable from '../components/MessageTable';
import EmptyState from '../components/EmptyState';
import { PRIORITY_RANK, STATUS_LABEL, PRIORITY_LABEL } from '../utils/format';

const PAGE_SIZE = 8;
const STATUS_RANK = { new: 3, in_progress: 2, resolved: 1 };

export default function Messages() {
  const { messages, loading, error, load, query, setQuery, setStatus, setPendingDelete } = useInbox();
  const [status, setStatusF] = useState('all');
  const [priority, setPriorityF] = useState('all');
  const [sort, setSort] = useState({ key: 'receivedAt', dir: 'desc' });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);

  useEffect(() => setPage(1), [query, status, priority, sort]);
  useEffect(() => setSelected((s) => s.filter((id) => messages.some((m) => m.id === id))), [messages]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const val = (m) => sort.key === 'priority' ? PRIORITY_RANK[m.priority] : sort.key === 'status' ? STATUS_RANK[m.status] : sort.key === 'name' ? m.name.toLowerCase() : new Date(m.receivedAt).getTime();
    return messages
      .filter((m) => (status === 'all' || m.status === status) && (priority === 'all' || m.priority === priority)
        && (!q || [m.name, m.email, m.subject].some((f) => f.toLowerCase().includes(q))))
      .sort((a, b) => (val(a) > val(b) ? 1 : val(a) < val(b) ? -1 : 0) * (sort.dir === 'asc' ? 1 : -1));
  }, [messages, query, status, priority, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const filtering = query || status !== 'all' || priority !== 'all';
  const clear = () => { setQuery(''); setStatusF('all'); setPriorityF('all'); };
  const onSort = (key) => setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'name' ? 'asc' : 'desc' }));
  const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const toggleAll = (ids) => setSelected((s) => (ids.every((i) => s.includes(i)) ? s.filter((i) => !ids.includes(i)) : [...new Set([...s, ...ids])]));

  return (
    <section className="card">
      <div className="toolbar">
        <div className="filters">
          <label className="field-inline"><span>Status</span>
            <select value={status} onChange={(e) => setStatusF(e.target.value)}><option value="all">All statuses</option>{Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          </label>
          <label className="field-inline"><span>Priority</span>
            <select value={priority} onChange={(e) => setPriorityF(e.target.value)}><option value="all">All priorities</option>{Object.entries(PRIORITY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          </label>
          {filtering && <button className="btn btn-ghost" onClick={clear}>Clear filters</button>}
        </div>
        <div className="muted small" aria-live="polite">{loading ? 'Loading messages' : `${filtered.length} of ${messages.length} messages`}</div>
      </div>

      {selected.length > 0 && (
        <div className="bulk" role="region" aria-label="Bulk actions">
          <strong>{selected.length} selected</strong>
          <button className="btn" onClick={() => { setStatus(selected, 'in_progress'); setSelected([]); }}><Clock size={15} />Mark in progress</button>
          <button className="btn" onClick={() => { setStatus(selected, 'resolved'); setSelected([]); }}><CheckCircle2 size={15} />Mark resolved</button>
          <button className="btn btn-danger-ghost" onClick={() => setPendingDelete(selected)}><Trash2 size={15} />Delete</button>
        </div>
      )}

      {loading ? (
        <div className="skeleton-list" aria-busy="true">{Array.from({ length: 6 }, (_, i) => <div key={i} className="skeleton" />)}</div>
      ) : error ? (
        <EmptyState icon={TriangleAlert} title="Messages could not be loaded" text={error} action={<button className="btn" onClick={load}><RefreshCw size={15} />Try again</button>} />
      ) : !messages.length ? (
        <EmptyState icon={Inbox} title="No messages yet" text="Messages submitted through your contact form will appear here." action={<a className="btn btn-primary" href="#/contact">Open contact form</a>} />
      ) : !filtered.length ? (
        <EmptyState icon={SearchX} title="No messages match your filters" text="Try a different search term or remove a filter." action={<button className="btn" onClick={clear}>Clear filters</button>} />
      ) : (
        <>
          <MessageTable rows={rows} selectable selected={selected} onToggle={toggle} onToggleAll={toggleAll} sort={sort} onSort={onSort} />
          <div className="pager">
            <span className="muted small">Page {current} of {pages}</span>
            <div className="row-gap">
              <button className="btn" disabled={current === 1} onClick={() => setPage(current - 1)}><ChevronLeft size={15} />Previous</button>
              <button className="btn" disabled={current === pages} onClick={() => setPage(current + 1)}>Next<ChevronRight size={15} /></button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
