import { useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, Clock, Eye, MoreHorizontal, Trash2 } from 'lucide-react';
import { useInbox } from '../hooks/InboxContext';
import useClickOutside from '../hooks/useClickOutside';
import Avatar from './Avatar';
import { PriorityBadge, StatusBadge } from './Badges';
import { formatDate } from '../utils/format';

function SortHead({ label, k, sort, onSort }) {
  if (!onSort) return <th>{label}</th>;
  const active = sort.key === k;
  const Icon = !active ? ArrowUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown;
  return (
    <th aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button className="sort-btn" onClick={() => onSort(k)}>{label}<Icon size={13} /></button>
    </th>
  );
}

export default function MessageTable({ rows, selectable = false, selected = [], onToggle, onToggleAll, sort, onSort }) {
  const { setOpenId, setStatus, setPendingDelete } = useInbox();
  const [menu, setMenu] = useState(null);
  const wrapRef = useClickOutside(() => setMenu(null));
  const allOn = rows.length > 0 && rows.every((r) => selected.includes(r.id));

  return (
    <div className="table-wrap" ref={wrapRef}>
      <table className="table">
        <thead>
          <tr>
            {selectable && <th className="col-check"><input type="checkbox" aria-label="Select all on this page" checked={allOn} onChange={() => onToggleAll(rows.map((r) => r.id))} /></th>}
            <SortHead label="Sender" k="name" sort={sort} onSort={onSort} />
            <th className="hide-md">Subject and preview</th>
            <SortHead label="Received" k="receivedAt" sort={sort} onSort={onSort} />
            <SortHead label="Priority" k="priority" sort={sort} onSort={onSort} />
            <SortHead label="Status" k="status" sort={sort} onSort={onSort} />
            <th className="col-act"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => (
            <tr key={m.id} className={`row ${m.status === 'new' ? 'is-new' : ''} ${selected.includes(m.id) ? 'is-sel' : ''}`} onClick={() => setOpenId(m.id)}>
              {selectable && <td className="col-check" onClick={(e) => e.stopPropagation()}><input type="checkbox" aria-label={`Select message from ${m.name}`} checked={selected.includes(m.id)} onChange={() => onToggle(m.id)} /></td>}
              <td>
                <div className="sender"><Avatar name={m.name} /><div><div className="strong">{m.name}</div><div className="muted small">{m.email}</div></div></div>
              </td>
              <td className="hide-md cell-subject">
                <button className="link-btn" onClick={(e) => { e.stopPropagation(); setOpenId(m.id); }}>{m.subject}</button>
                <div className="muted small clamp">{m.body}</div>
              </td>
              <td className="nowrap muted">{formatDate(m.receivedAt)}</td>
              <td><PriorityBadge priority={m.priority} /></td>
              <td><StatusBadge status={m.status} /></td>
              <td className="col-act" onClick={(e) => e.stopPropagation()}>
                <div className="menu-anchor">
                  <button className="icon-btn" aria-label={`Actions for ${m.subject}`} aria-haspopup="menu" aria-expanded={menu === m.id} onClick={() => setMenu(menu === m.id ? null : m.id)}><MoreHorizontal size={18} /></button>
                  {menu === m.id && (
                    <div className="popover menu" role="menu">
                      <button role="menuitem" onClick={() => { setMenu(null); setOpenId(m.id); }}><Eye size={15} />View details</button>
                      {m.status !== 'in_progress' && <button role="menuitem" onClick={() => { setMenu(null); setStatus([m.id], 'in_progress'); }}><Clock size={15} />Mark in progress</button>}
                      {m.status !== 'resolved' && <button role="menuitem" onClick={() => { setMenu(null); setStatus([m.id], 'resolved'); }}><CheckCircle2 size={15} />Mark resolved</button>}
                      <button role="menuitem" className="danger" onClick={() => { setMenu(null); setPendingDelete([m.id]); }}><Trash2 size={15} />Delete</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
