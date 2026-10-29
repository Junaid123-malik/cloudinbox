import { STATUS_LABEL, PRIORITY_LABEL } from '../utils/format';
export const StatusBadge = ({ status }) => <span className={`badge badge-${status}`}>{STATUS_LABEL[status]}</span>;
export const PriorityBadge = ({ priority }) => (
  <span className="prio"><i className={`dot dot-${priority}`} />{PRIORITY_LABEL[priority]}</span>
);
