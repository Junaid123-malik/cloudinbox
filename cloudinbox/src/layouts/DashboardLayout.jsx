
import { useEffect, useState } from 'react';
import {
  BarChart3,
  Bell,
  ChevronDown,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  Plus,
  Search,
  Settings,
  X,
} from 'lucide-react';

import { useInbox } from '../hooks/InboxContext';
import useClickOutside from '../hooks/useClickOutside';
import Avatar from '../components/Avatar';
import Logo from '../components/Logo';
import MessageDrawer from '../components/MessageDrawer';
import ConfirmDialog from '../components/ConfirmDialog';
import { timeAgo } from '../utils/format';

const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'messages', label: 'Messages', icon: Inbox },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help & Support', icon: LifeBuoy },
];

const TITLES = {
  overview: 'Overview',
  messages: 'Messages',
  analytics: 'Analytics',
  settings: 'Settings',
  help: 'Help & Support',
};

const DEFAULT_PROFILE = {
  name: 'Alex Morgan',
  email: 'alex@example.com',
  role: 'Administrator',
};

function getProfile() {
  try {
    const saved = localStorage.getItem('cloudinbox-profile');

    return saved
      ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) }
      : { ...DEFAULT_PROFILE };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export default function DashboardLayout({ page, children }) {
  const { messages, query, setQuery, setOpenId } = useInbox();

  const [navOpen, setNavOpen] = useState(false);
  const [pop, setPop] = useState(null);
  const [profile, setProfile] = useState(getProfile);

  const popRef = useClickOutside(() => setPop(null));
  const fresh = messages.filter((m) => m.status === 'new');

  useEffect(() => {
    const updateProfile = () => {
      setProfile(getProfile());
    };

    window.addEventListener(
      'cloudinbox-profile-updated',
      updateProfile
    );

    // Also refresh the displayed profile if another browser tab changes it.
    const handleStorage = (event) => {
      if (event.key === 'cloudinbox-profile') {
        updateProfile();
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener(
        'cloudinbox-profile-updated',
        updateProfile
      );
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const onSearch = (value) => {
    setQuery(value);

    if (page !== 'messages') {
      window.location.hash = '#/messages';
    }
  };

  return (
    <div className="shell">
      {navOpen && (
        <div
          className="scrim"
          onClick={() => setNavOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${navOpen ? 'open' : ''}`}
        aria-label="Primary"
      >
        <div className="side-top">
          <Logo light />
          <button
            type="button"
            className="icon-btn only-mobile light"
            aria-label="Close menu"
            onClick={() => setNavOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav>
          {NAV.map(({ id, label, icon: Icon }) => (
            <a
              key={id}
              href={`#/${id}`}
              className={`nav-link ${page === id ? 'active' : ''}`}
              aria-current={page === id ? 'page' : undefined}
              onClick={() => setNavOpen(false)}
            >
              <Icon size={18} />
              {label}

              {id === 'messages' && fresh.length > 0 && (
                <span className="nav-count">{fresh.length}</span>
              )}
            </a>
          ))}
        </nav>

        <div className="side-profile">
          <Avatar name={profile.name} size={34} />

          <div>
            <div className="strong light">{profile.name}</div>
            <div className="small side-muted">{profile.role}</div>
          </div>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button
            type="button"
            className="icon-btn only-mobile"
            aria-label="Open menu"
            onClick={() => setNavOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="crumbs">
            <div className="small muted">
              CloudInbox / {TITLES[page]}
            </div>
            <h1>{TITLES[page]}</h1>
          </div>

          <div className="search">
            <Search size={16} />
            <input
              type="search"
              aria-label="Search messages"
              placeholder="Search sender, email or subject"
              value={query}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>

          <a className="btn btn-primary hide-sm" href="#/contact">
            <Plus size={16} />
            New message
          </a>

          <div className="tools" ref={popRef}>
            <div className="menu-anchor">
              <button
                type="button"
                className="icon-btn"
                aria-label={`Notifications, ${fresh.length} new`}
                aria-expanded={pop === 'bell'}
                onClick={() =>
                  setPop(pop === 'bell' ? null : 'bell')
                }
              >
                <Bell size={19} />
                {fresh.length > 0 && <span className="bell-dot" />}
              </button>

              {pop === 'bell' && (
                <div className="popover notif">
                  <div className="pop-title">New messages</div>

                  {fresh.slice(0, 4).map((message) => (
                    <button
                      type="button"
                      key={message.id}
                      className="notif-item"
                      onClick={() => {
                        setPop(null);
                        setOpenId(message.id);
                      }}
                    >
                      <span className="strong">{message.name}</span>
                      <span className="small muted clamp">
                        {message.subject}
                      </span>
                      <span className="small muted">
                        {timeAgo(message.receivedAt)}
                      </span>
                    </button>
                  ))}

                  {!fresh.length && (
                    <div className="pop-empty muted small">
                      You are all caught up.
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="menu-anchor">
              <button
                type="button"
                className="user-btn"
                aria-haspopup="menu"
                aria-expanded={pop === 'user'}
                onClick={() =>
                  setPop(pop === 'user' ? null : 'user')
                }
              >
                <Avatar name={profile.name} size={30} />
                <ChevronDown size={15} />
                <span className="sr-only">Account menu</span>
              </button>

              {pop === 'user' && (
                <div
                  className="popover menu menu-right"
                  role="menu"
                >
                  <div className="pop-title">
                    {profile.name}
                    <div className="small muted">
                      {profile.email}
                    </div>
                  </div>

                  <a
                    role="menuitem"
                    href="#/settings"
                    onClick={() => setPop(null)}
                  >
                    <Settings size={15} />
                    Settings
                  </a>

                  <a
                    role="menuitem"
                    href="#/help"
                    onClick={() => setPop(null)}
                  >
                    <LifeBuoy size={15} />
                    Help &amp; Support
                  </a>

                  <a
                    role="menuitem"
                    href="#/contact"
                    onClick={() => setPop(null)}
                  >
                    <Plus size={15} />
                    Open contact form
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="content">{children}</main>
      </div>

      <MessageDrawer />
      <ConfirmDialog />
    </div>
  );
}
