import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import * as api from '../services';
import { STATUS_LABEL } from '../utils/format';

const Ctx = createContext(null);
export const useInbox = () => useContext(Ctx);

export function InboxProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState([]);
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((text, tone = 'ok') => {
    const id = Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try { setMessages(await api.getMessages()); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const replace = (m) => setMessages((list) => list.map((x) => (x.id === m.id ? m : x)));

  const setStatus = async (ids, status) => {
    try {
      const out = await Promise.all(ids.map((id) => api.updateMessageStatus(id, status)));
      out.forEach(replace);
      toast(ids.length > 1 ? `${ids.length} messages marked ${STATUS_LABEL[status].toLowerCase()}` : `Marked ${STATUS_LABEL[status].toLowerCase()}`);
    } catch (e) { toast(e.message, 'error'); }
  };
  const addNote = async (id, text) => {
    try { replace(await api.addNote(id, text)); toast('Note added'); } catch (e) { toast(e.message, 'error'); }
  };
  const confirmDelete = async () => {
    const ids = pendingDelete;
    try {
      await Promise.all(ids.map((id) => api.deleteMessage(id)));
      setMessages((l) => l.filter((m) => !ids.includes(m.id)));
      if (ids.includes(openId)) setOpenId(null);
      toast(ids.length > 1 ? `${ids.length} messages deleted` : 'Message deleted');
    } catch (e) { toast(e.message, 'error'); }
    setPendingDelete([]);
  };
  const create = async (payload) => {
    const m = await api.createMessage(payload);
    setMessages((l) => [m, ...l]);
    return m;
  };

  const value = { messages, loading, error, load, query, setQuery, openId, setOpenId, pendingDelete, setPendingDelete, setStatus, addNote, confirmDelete, create, toast };
  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.tone}`}>
            {t.text}
            <button aria-label="Dismiss" onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}><X size={14} /></button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
