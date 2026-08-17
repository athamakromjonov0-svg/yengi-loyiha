import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SCROLL TO TOP — sahifa (route) almashganda sahifani tepaga qaytaradi.
 * Aks holda foydalanuvchi avvalgi sahifadagi scroll holatida qolib ketadi.
 */
export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);

  return null;
}
