import { useEffect, useRef } from 'react';
export default function useClickOutside(handler) {
  const ref = useRef(null);
  useEffect(() => {
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) handler(); };
    const onKey = (e) => { if (e.key === 'Escape') handler(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [handler]);
  return ref;
}
