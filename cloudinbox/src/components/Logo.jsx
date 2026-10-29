import { MailOpen } from 'lucide-react';
export default function Logo({ light = false }) {
  return (
    <a className={`logo ${light ? 'logo-light' : ''}`} href="#/overview" aria-label="CloudInbox home">
      <span className="logo-mark"><MailOpen size={17} strokeWidth={2.2} /></span>
      <span className="logo-text">CloudInbox</span>
    </a>
  );
}
