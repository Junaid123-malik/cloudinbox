
import { useEffect, useState } from 'react';

const read = () => {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return hash || 'contact';
};

export default function useHashPage() {
  const [page, setPage] = useState(read);

  useEffect(() => {
    const on = () => {
      setPage(read());
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', on);

    return () => {
      window.removeEventListener('hashchange', on);
    };
  }, []);

  return page;
}
