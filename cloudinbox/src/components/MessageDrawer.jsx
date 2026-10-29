
import { useState } from 'react';
import { Calendar, Mail, Send, Trash2, X } from 'lucide-react';
import { useInbox } from '../hooks/InboxContext';
import useClickOutside from '../hooks/useClickOutside';
import Avatar from './Avatar';
import { PriorityBadge, StatusBadge } from './Badges';
import { STATUS_LABEL, formatDate } from '../utils/format';

export default function MessageDrawer() {
  const {
    messages,
    openId,
    setOpenId,
    setStatus,
    addNote,
    setPendingDelete,
    pendingDelete,
  } = useInbox();

  const [note, setNote] = useState('');

  const ref = useClickOutside(() => {
    if (!pendingDelete?.length) {
      setOpenId(null);
    }
  });

  const m = messages.find((x) => x.id === openId);

  if (!m) return null;

  // Some DynamoDB messages may not have a notes field.
  const notes = Array.isArray(m.notes) ? m.notes : [];

  const submit = (e) => {
    e.preventDefault();

    if (!note.trim()) return;

    addNote(m.id, note.trim());
    setNote('');
  };

  return (
    <div className="overlay">
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        ref={ref}
      >
        <header className="drawer-head">
          <div>
            <h2 id="drawer-title">{m.subject || 'No subject'}</h2>

            <div className="row-gap">
              <StatusBadge status={m.status} />
              <PriorityBadge priority={m.priority} />
            </div>
          </div>

          <button
            className="icon-btn"
            aria-label="Close details"
            onClick={() => setOpenId(null)}
            autoFocus
          >
            <X size={18} />
          </button>
        </header>

        <div className="drawer-body">
          <section className="sender-box">
            <Avatar name={m.name || 'Unknown'} size={44} />

            <div>
              <div className="strong">{m.name || 'Unknown sender'}</div>

              {m.email ? (
                <a
                  className="muted small"
                  href={`mailto:${m.email}`}
                >
                  <Mail size={13} /> {m.email}
                </a>
              ) : (
                <div className="muted small">No email provided</div>
              )}
            </div>

            <div className="muted small push-right">
              <Calendar size={13} />{' '}
              {m.receivedAt ? formatDate(m.receivedAt) : 'Date unavailable'}
            </div>
          </section>

          <section>
            <h3>Message</h3>
            <p className="body-text">
              {m.body || 'No message content available.'}
            </p>
          </section>

          <section>
            <h3>Status</h3>

            <div className="seg" role="group" aria-label="Change status">
              {Object.keys(STATUS_LABEL).map((s) => (
                <button
                  key={s}
                  aria-pressed={m.status === s}
                  className={m.status === s ? 'on' : ''}
                  onClick={() => {
                    if (m.status !== s) {
                      setStatus([m.id], s);
                    }
                  }}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3>
              Internal notes <span className="muted">({notes.length})</span>
            </h3>

            <p className="muted small">
              Visible to admins only. Notes are stored in local sample data
              for now.
            </p>

            <ul className="notes">
              {notes.map((n, index) => (
                <li key={n.id || `${m.id}-note-${index}`}>
                  <div className="small">
                    <span className="strong">
                      {n.author || 'Admin'}
                    </span>{' '}
                    <span className="muted">
                      {n.createdAt ? formatDate(n.createdAt) : ''}
                    </span>
                  </div>

                  <div>{n.text || ''}</div>
                </li>
              ))}

              {notes.length === 0 && (
                <li className="muted small">No notes yet.</li>
              )}
            </ul>

            <form onSubmit={submit} className="note-form">
              <label htmlFor="note" className="sr-only">
                Add an internal note
              </label>

              <textarea
                id="note"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add an internal note"
              />

              <button
                className="btn btn-primary"
                disabled={!note.trim()}
              >
                <Send size={14} />
                Add note
              </button>
            </form>
          </section>
        </div>

        <footer className="drawer-foot">
          <button
            className="btn btn-danger-ghost"
            onClick={() => setPendingDelete([m.id])}
          >
            <Trash2 size={15} />
            Delete message
          </button>
        </footer>
      </aside>
    </div>
  );
}

