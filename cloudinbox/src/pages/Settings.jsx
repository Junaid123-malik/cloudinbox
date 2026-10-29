
import { useState } from 'react';
import { Lock, Monitor, Moon, Sun } from 'lucide-react';
import { useInbox } from '../hooks/InboxContext';
import useTheme from '../hooks/useTheme';

const DEFAULT_PROFILE = {
  name: 'Alex Morgan',
  email: 'alex@example.com',
  role: 'Administrator',
};

function getSavedProfile() {
  try {
    const saved = localStorage.getItem('cloudinbox-profile');

    return saved
      ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) }
      : { ...DEFAULT_PROFILE };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

function Toggle({ id, label, desc, checked, onChange }) {
  return (
    <div className="toggle-row">
      <div>
        <label htmlFor={id} className="strong">{label}</label>
        <div className="muted small">{desc}</div>
      </div>

      <input
        id={id}
        type="checkbox"
        role="switch"
        className="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  );
}

export default function Settings() {
  const { toast } = useInbox();
  const [theme, setTheme] = useTheme();
  const [profile, setProfile] = useState(getSavedProfile);

  const [notif, setNotif] = useState({
    newMsg: true,
    highPrio: true,
    digest: false,
  });

  const set = (key) => (e) => {
    setProfile((previous) => ({
      ...previous,
      [key]: e.target.value,
    }));
  };

  const saveProfile = (e) => {
    e.preventDefault();

    try {
      const updatedProfile = {
        name: profile.name.trim(),
        email: profile.email.trim(),
        role: profile.role,
      };

      if (!updatedProfile.name || !updatedProfile.email) {
        toast('Please enter your name and email.', 'error');
        return;
      }

      localStorage.setItem(
        'cloudinbox-profile',
        JSON.stringify(updatedProfile)
      );

      window.dispatchEvent(new Event('cloudinbox-profile-updated'));

      setProfile(updatedProfile);
      toast('Profile updated successfully');
    } catch (error) {
      console.error('Could not save profile:', error);
      toast('Could not save profile.', 'error');
    }
  };

  return (
    <div className="settings">
      <section className="card pad">
        <h2>Profile</h2>
        <p className="muted small">
          Your profile changes are saved in this browser.
        </p>

        <form className="form-grid" onSubmit={saveProfile}>
          <div className="field">
            <label htmlFor="p-name">Full name</label>
            <input
              id="p-name"
              value={profile.name}
              onChange={set('name')}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="p-email">Email</label>
            <input
              id="p-email"
              type="email"
              value={profile.email}
              onChange={set('email')}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="p-role">Role</label>
            <input
              id="p-role"
              value={profile.role}
              readOnly
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Save changes
            </button>
          </div>
        </form>
      </section>

      <section className="card pad">
        <h2>Notification preferences</h2>
        <p className="muted small">
          Preferences are stored locally. Email delivery would require
          a service such as Amazon SES, which is not connected.
        </p>

        <Toggle
          id="n1"
          label="New message alerts"
          desc="Show a badge when a new message arrives."
          checked={notif.newMsg}
          onChange={(value) =>
            setNotif((previous) => ({ ...previous, newMsg: value }))
          }
        />

        <Toggle
          id="n2"
          label="High priority only"
          desc="Highlight high priority messages first."
          checked={notif.highPrio}
          onChange={(value) =>
            setNotif((previous) => ({ ...previous, highPrio: value }))
          }
        />

        <Toggle
          id="n3"
          label="Daily digest"
          desc="Summarize the previous day each morning."
          checked={notif.digest}
          onChange={(value) =>
            setNotif((previous) => ({ ...previous, digest: value }))
          }
        />
      </section>

      <section className="card pad">
        <h2>Appearance</h2>

        <div
          className="seg seg-lg"
          role="radiogroup"
          aria-label="Theme"
        >
          {[
            ['light', 'Light', Sun],
            ['dark', 'Dark', Moon],
            ['system', 'System', Monitor],
          ].map(([value, label, IconComponent]) => (
            <button
              type="button"
              key={value}
              role="radio"
              aria-checked={theme === value}
              className={theme === value ? 'on' : ''}
              onClick={() => setTheme(value)}
            >
              <IconComponent size={15} />
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="card pad">
        <h2>
          Security <span className="tag">Placeholder</span>
        </h2>

        <p className="muted small">
          Authentication controls are not connected to the backend yet.
          Password and MFA management require identity-provider integration.
        </p>

        <div className="toggle-row">
          <div>
            <div className="strong">Password</div>
            <div className="muted small">
              Managed by the identity provider.
            </div>
          </div>

          <button type="button" className="btn" disabled>
            <Lock size={14} />
            Change password
          </button>
        </div>

        <div className="toggle-row">
          <div>
            <div className="strong">Multi-factor authentication</div>
            <div className="muted small">
              Requires Cognito user pool configuration.
            </div>
          </div>

          <button type="button" className="btn" disabled>
            Set up MFA
          </button>
        </div>
      </section>
    </div>
  );
}
