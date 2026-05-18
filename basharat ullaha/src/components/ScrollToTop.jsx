import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Reset scroll position to top when the route or query parameters change
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [pathname, search]);

  return null;
}
