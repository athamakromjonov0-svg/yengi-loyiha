import { useState, useEffect, useCallback } from 'react';
import { signInWithGoogle, signOutUser, onAuthStateChange, signInWithEmail } from '../../firebase';

const useAuth = (showToast) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vortex_user')) || null; }
    catch { return null; }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('isAdminAuthenticated') === 'true'
  );

  const [loginAttempts, setLoginAttempts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vortex_login_attempts')) || 0; }
    catch { return 0; }
  });

  const [loginLockedUntil, setLoginLockedUntil] = useState(() => {
    return Number(localStorage.getItem('vortex_login_locked')) || 0;
  });

  const [siteUser, setSiteUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('site_user')) || null; }
    catch { return null; }
  });

  const [isSiteAuthenticated, setIsSiteAuthenticated] = useState(
    () => localStorage.getItem('isSiteAuthenticated') === 'true'
  );

  useEffect(() => { localStorage.setItem('vortex_login_attempts', JSON.stringify(loginAttempts)); }, [loginAttempts]);
  useEffect(() => { localStorage.setItem('vortex_login_locked', String(loginLockedUntil)); }, [loginLockedUntil]);

  const login = useCallback(async (email, password) => {
    const now = Date.now();
    
    if (loginLockedUntil > now) {
      const minutesLeft = Math.ceil((loginLockedUntil - now) / 60000);
      showToast(`Tizim ${minutesLeft} daqiqa qulflangan. Keyinroq urinib ko'ring.`, "error");
      return false;
    }

    try {
      const userData = await signInWithEmail(email, password);
      
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const isAdmin = userData.email === adminEmail;
      
      const mockUser = {
        email: userData.email,
        role: isAdmin ? 'admin' : 'user',
        name: isAdmin ? 'Admin Terminal' : (userData.name || 'Foydalanuvchi'),
        uid: userData.uid,
        photoURL: userData.photoURL,
      };
      
      setIsAuthenticated(true);
      setUser(mockUser);
      setLoginAttempts(0);
      localStorage.setItem('isAdminAuthenticated', 'true');
      localStorage.setItem('vortex_user', JSON.stringify(mockUser));
      showToast("Kiber-shlyuz muvaffaqiyatli ochildi!", "success");
      return true;
    } catch (error) {
      console.error('Admin login xatosi:', error);
      
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        const lockUntil = now + 5 * 60 * 1000;
        setLoginLockedUntil(lockUntil);
        setLoginAttempts(0);
        showToast(`5 ta muvaffaqiyatsiz urinish! Tizim 5 daqiqaga qulflandi.`, "error");
      } else {
        const errorMessages = {
          'auth/user-not-found': "Bunday email bilan hisob topilmadi.",
          'auth/wrong-password': "Parol noto'g'ri.",
          'auth/invalid-email': "Email formati noto'g'ri.",
          'auth/user-disabled': "Hisob bloklangan.",
          'auth/too-many-requests': "Juda ko'p urinishlar. Biroz kuting.",
        };
        const message = errorMessages[error.code] || "Identifikatsiya ma'lumotlari xato!";
        showToast(`${message} (${newAttempts}/5 urinish)`, "error");
      }
      return false;
    }
  }, [loginAttempts, loginLockedUntil, showToast]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('vortex_user');
    showToast("Xavfsiz seans yakunlandi", "info");
  }, [showToast]);

  const loginWithGoogle = useCallback(async () => {
    try {
      const userData = await signInWithGoogle();
      const userObj = {
        uid: userData.uid,
        email: userData.email,
        name: userData.name || 'Foydalanuvchi',
        photoURL: userData.photoURL || null,
        role: 'user',
      };
      setIsSiteAuthenticated(true);
      setSiteUser(userObj);
      localStorage.setItem('isSiteAuthenticated', 'true');
      localStorage.setItem('site_user', JSON.stringify(userObj));
      showToast("Google akkaunt muvaffaqiyatli ulandi!", "success");
      return true;
    } catch (error) {
      console.error('Google login xatosi:', error);
      const errorMessages = {
        'auth/popup-closed-by-user': "Google oynasi yopildi. Qayta urinib ko'ring.",
        'auth/popup-blocked': "Popup bloklandi. Brauzer sozlamalarini tekshiring.",
        'auth/unauthorized-domain': "Bu domen Firebase Authentication'da ruxsat etilmagan!",
        'auth/operation-not-allowed': "Google Authentication yoqilmagan. Firebase konsolida yoqing!",
        'auth/account-exists-with-different-credential': "Bu email boshqa usul bilan ro'yxatdan o'tgan.",
        'auth/invalid-credential': "Noto'g'ri ma'lumot berildi.",
      };
      const message = errorMessages[error.code] || "Google orqali kirishda xatolik yuz berdi.";
      showToast(message, "error");
      return false;
    }
  }, [showToast]);

  const siteLogout = useCallback(async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Site logout xatosi:', error);
    }
    setIsSiteAuthenticated(false);
    setSiteUser(null);
    localStorage.removeItem('isSiteAuthenticated');
    localStorage.removeItem('site_user');
    showToast("Saytdan xavfsiz chiqildi", "info");
  }, [showToast]);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        const userObj = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'Foydalanuvchi',
          photoURL: firebaseUser.photoURL || null,
          role: 'user',
        };
        setIsSiteAuthenticated(true);
        setSiteUser(userObj);
        localStorage.setItem('isSiteAuthenticated', 'true');
        localStorage.setItem('site_user', JSON.stringify(userObj));
      } else {
        setIsSiteAuthenticated(false);
        setSiteUser(null);
        localStorage.removeItem('isSiteAuthenticated');
        localStorage.removeItem('site_user');
      }
    });
    return () => unsubscribe();
  }, []);

  return {
    user, isAuthenticated, siteUser, isSiteAuthenticated,
    loginAttempts, loginLockedUntil,
    login, logout, loginWithGoogle, siteLogout,
  };
};

export default useAuth;
