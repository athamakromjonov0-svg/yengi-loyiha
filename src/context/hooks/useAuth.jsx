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

  const [siteUsers, setSiteUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vortex_site_users')) || []; }
    catch { return []; }
  });

  useEffect(() => { localStorage.setItem('vortex_login_attempts', JSON.stringify(loginAttempts)); }, [loginAttempts]);
  useEffect(() => { localStorage.setItem('vortex_login_locked', String(loginLockedUntil)); }, [loginLockedUntil]);
  useEffect(() => { localStorage.setItem('vortex_site_users', JSON.stringify(siteUsers)); }, [siteUsers]);

  // REAL VAQT: boshqa oynalardagi login/logout o'zgarishlarini darhol qabul qilish
  useEffect(() => {
    const syncFromStorage = (e) => {
      const { key, newValue } = e;
      if (key === 'isAdminAuthenticated') {
        setIsAuthenticated(newValue === 'true');
        if (newValue !== 'true') setUser(null);
      } else if (key === 'vortex_user') {
        if (newValue === null) { setUser(null); return; }
        try { setUser(JSON.parse(newValue)); } catch { /* ignore */ }
      } else if (key === 'isSiteAuthenticated') {
        setIsSiteAuthenticated(newValue === 'true');
        if (newValue !== 'true') setSiteUser(null);
      } else if (key === 'site_user') {
        if (newValue === null) { setSiteUser(null); return; }
        try { setSiteUser(JSON.parse(newValue)); } catch { /* ignore */ }
      } else if (key === 'vortex_site_users') {
        if (newValue === null) { setSiteUsers([]); return; }
        try { const parsed = JSON.parse(newValue); if (Array.isArray(parsed)) setSiteUsers(parsed); } catch { /* ignore */ }
      }
    };
    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

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

      // LOKAL ZAXIRA: Firebase (Email/Password) o'chirilgan bo'lsa ham
      // .env ichidagi VITE_ADMIN_EMAIL / VITE_ADMIN_PASSWORD bilan kirish
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
      const isLocalAdmin =
        adminEmail &&
        adminPassword &&
        email.trim().toLowerCase() === adminEmail.trim().toLowerCase() &&
        password === adminPassword;

      if (isLocalAdmin) {
        const mockUser = {
          email: adminEmail,
          role: 'admin',
          name: 'Admin Terminal',
          uid: 'local-admin',
        };
        setIsAuthenticated(true);
        setUser(mockUser);
        setLoginAttempts(0);
        localStorage.setItem('isAdminAuthenticated', 'true');
        localStorage.setItem('vortex_user', JSON.stringify(mockUser));
        showToast("Kiber-shlyuz muvaffaqiyatli ochildi!", "success");
        return true;
      }

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
          'auth/operation-not-allowed': "Email/Parol orqali kirish Firebase konsolida yoqilmagan.",
          'auth/configuration-not-found': "Firebase konfiguratsiyasi topilmadi.",
          'auth/invalid-api-key': "Firebase API kaliti noto'g'ri.",
          'auth/network-request-failed': "Tarmoq uzildi. Internet aloqasini tekshiring.",
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

  // Sayt uchun lokal ro'yxatdan o'tish (email + parol)
  const siteRegister = useCallback((name, email, password) => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      showToast("Barcha maydonlarni to'ldiring", "error");
      return false;
    }
    const exists = siteUsers.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (exists) {
      showToast("Bu email allaqachon ro'yxatdan o'tgan!", "error");
      return false;
    }
    const newUser = {
      uid: `SU-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      password,
      photoURL: null,
      joined: new Date().toISOString(),
    };
    setSiteUsers(prev => [...prev, newUser]);
    const profile = { uid: newUser.uid, email: newUser.email, name: newUser.name, photoURL: null, role: 'user' };
    setSiteUser(profile);
    setIsSiteAuthenticated(true);
    localStorage.setItem('isSiteAuthenticated', 'true');
    localStorage.setItem('site_user', JSON.stringify(profile));
    showToast("Hisob muvaffaqiyatli yaratildi!", "success");
    return true;
  }, [siteUsers, showToast]);

  // Sayt uchun lokal kirish (email + parol)
  const siteEmailLogin = useCallback((email, password) => {
    const found = siteUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found || found.password !== password) {
      showToast("Email yoki parol noto'g'ri!", "error");
      return false;
    }
    const profile = { uid: found.uid, email: found.email, name: found.name, photoURL: found.photoURL || null, role: 'user' };
    setSiteUser(profile);
    setIsSiteAuthenticated(true);
    localStorage.setItem('isSiteAuthenticated', 'true');
    localStorage.setItem('site_user', JSON.stringify(profile));
    showToast("Tizimga muvaffaqiyatli kirdingiz!", "success");
    return true;
  }, [siteUsers, showToast]);

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
    siteUsers, siteRegister, siteEmailLogin,
    loginAttempts, loginLockedUntil,
    login, logout, loginWithGoogle, siteLogout,
  };
};

export default useAuth;
