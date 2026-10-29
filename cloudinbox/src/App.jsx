
import { useEffect, useState } from 'react';
import {
  fetchAuthSession,
  signInWithRedirect,
  signOut,
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

import { InboxProvider } from './hooks/InboxContext';
import useHashPage from './hooks/useHashPage';
import useTheme from './hooks/useTheme';

import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/Overview';
import Messages from './pages/Messages';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Help from './pages/Help';
import ContactForm from './pages/ContactForm';

const PAGES = {
  overview: Overview,
  messages: Messages,
  analytics: Analytics,
  settings: Settings,
  help: Help,
};

function AdminLogin() {
  const [loading, setLoading] = useState(false);

  async function login() {
    try {
      setLoading(true);

      // Remember that the user is starting an admin login.
      sessionStorage.setItem('cloudinbox_admin_login', 'true');

      await signInWithRedirect();
    } catch (error) {
      sessionStorage.removeItem('cloudinbox_admin_login');
      console.error('Cognito login failed:', error);
      setLoading(false);
      alert('Login start nahi ho saka. Browser Console check karein.');
    }
  }

  return (
    <main
      style={{
        maxWidth: 420,
        margin: '100px auto',
        padding: 24,
        textAlign: 'center',
      }}
    >
      <h1>CloudInbox Admin</h1>
      <p>Dashboard access karne ke liye admin login karein.</p>

      <button onClick={login} disabled={loading}>
        {loading ? 'Redirecting...' : 'Login with Cognito'}
      </button>

      <p style={{ marginTop: 24 }}>
        <a href="#/contact">Open public contact form</a>
      </p>
    </main>
  );
}

function Routes() {
  const page = useHashPage();
  useTheme();

  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkUser() {
      try {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken;

        if (!active) return;

        // No ID token means there is no authenticated session.
        if (!idToken) {
          setUser(null);
          return;
        }

        setUser({
          username: idToken.payload['cognito:username'] || '',
          userId: idToken.payload.sub || '',
          email: idToken.payload.email || '',
        });

        // Redirect only after Cognito confirms a valid session.
        if (
          sessionStorage.getItem('cloudinbox_admin_login') === 'true'
        ) {
          sessionStorage.removeItem('cloudinbox_admin_login');

          if (window.location.hash !== '#/admin') {
            window.location.hash = '/admin';
          }
        }
      } catch (error) {
        if (active) {
          setUser(null);
        }

        // A missing session is an expected logged-out state.
        if (error?.name !== 'UserUnAuthenticatedException') {
          console.error('Unable to verify Cognito session:', error);
        }
      } finally {
        if (active) {
          setChecking(false);
        }
      }
    }

    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      if (
        payload.event === 'signedIn' ||
        payload.event === 'signInWithRedirect'
      ) {
        setChecking(true);
        checkUser();
      }

      if (payload.event === 'signedOut' && active) {
        sessionStorage.removeItem('cloudinbox_admin_login');
        setUser(null);
        setChecking(false);
        window.location.hash = '/admin';
      }
    });

    checkUser();

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const isOAuthCallback = new URLSearchParams(
    window.location.search
  ).has('code');

  const adminLoginPending =
    sessionStorage.getItem('cloudinbox_admin_login') === 'true';

  // The public contact form remains accessible without admin login.
  if (
    page === 'contact' &&
    !isOAuthCallback &&
    !adminLoginPending
  ) {
    return <ContactForm />;
  }

  if (checking) {
    return <main style={{ padding: 32 }}>Checking admin login...</main>;
  }

  if (!user) {
    return <AdminLogin />;
  }

  const adminPage = page === 'admin' ? 'overview' : page;
  const Page = PAGES[adminPage] || Overview;

  return (
    <DashboardLayout
      page={PAGES[adminPage] ? adminPage : 'overview'}
    >
      <button
        onClick={async () => {
          try {
            await signOut();
          } catch (error) {
            console.error('Sign out failed:', error);
          }
        }}
        style={{ margin: 12 }}
      >
        Sign out
      </button>

      <Page />
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <InboxProvider>
      <Routes />
    </InboxProvider>
  );
}
