import { useEffect, useState } from 'react';
const KEY = 'cloudinbox-theme';
const get = () => { try { return localStorage.getItem(KEY) || 'light'; } catch { return 'light'; } };
export default function useTheme() {
  const [theme, setTheme] = useState(get);
  useEffect(() => {
    const dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    try { localStorage.setItem(KEY, theme); } catch { /* storage unavailable */ }
  }, [theme]);
  return [theme, setTheme];
}
