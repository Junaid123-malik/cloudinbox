export const STATUS_LABEL = { new: 'New', in_progress: 'In progress', resolved: 'Resolved' };
export const PRIORITY_LABEL = { high: 'High', medium: 'Medium', low: 'Low' };
export const PRIORITY_RANK = { high: 3, medium: 2, low: 1 };

export const formatDate = (iso) =>
  new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });

export function timeAgo(iso) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export const initials = (name) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');
