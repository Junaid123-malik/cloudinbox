import { TriangleAlert } from 'lucide-react';
import { useInbox } from '../hooks/InboxContext';
import useClickOutside from '../hooks/useClickOutside';

export default function ConfirmDialog() {
  const { pendingDelete, setPendingDelete, confirmDelete } = useInbox();
  const ref = useClickOutside(() => setPendingDelete([]));
  if (!pendingDelete.length) return null;
  const n = pendingDelete.length;
  return (
    <div className="overlay overlay-top">
      <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="dlg-title" aria-describedby="dlg-desc" ref={ref}>
        <span className="dialog-icon"><TriangleAlert size={20} /></span>
        <h2 id="dlg-title">Delete {n > 1 ? `${n} messages` : 'this message'}?</h2>
        <p id="dlg-desc" className="muted">This removes {n > 1 ? 'them' : 'it'} from the inbox and cannot be undone.</p>
        <div className="dialog-actions">
          <button className="btn" onClick={() => setPendingDelete([])} autoFocus>Cancel</button>
          <button className="btn btn-danger" onClick={confirmDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}
