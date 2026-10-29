export default function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="empty">
      <span className="empty-icon"><Icon size={22} /></span>
      <h3>{title}</h3>
      <p className="muted">{text}</p>
      {action}
    </div>
  );
}
