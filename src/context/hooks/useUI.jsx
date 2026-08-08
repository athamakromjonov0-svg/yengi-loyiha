import { useState, useEffect, useCallback } from 'react';

const UI_KEYS = {
  notification: null,
  notifications: 'vortex_notifications',
  notificationSettings: 'vortex_notify_settings',
  settings: 'vortex_settings',
  currency: 'vortex_currency',
  language: 'vortex_lang',
};

const DEFAULT_SETTINGS = {
  darkMode: true,
  notifications: true,
  autoSave: true,
  language: 'uz',
  currency: 'UZS',
};

const DEFAULT_NOTIFICATION_SETTINGS = {
  orderUpdates: true,
  promotions: true,
  newArrivals: true,
  priceDrops: true,
};

const useUI = () => {
  const [notification, setNotification] = useState(null);
  const [notifications, setNotifications] = useState(() => {
    try { return JSON.parse(localStorage.getItem(UI_KEYS.notifications)) || []; }
    catch { return []; }
  });

  const [notificationSettings, setNotificationSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem(UI_KEYS.notificationSettings)) || DEFAULT_NOTIFICATION_SETTINGS; }
    catch { return DEFAULT_NOTIFICATION_SETTINGS; }
  });

  const [settings, setSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem(UI_KEYS.settings)) || DEFAULT_SETTINGS; }
    catch { return DEFAULT_SETTINGS; }
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem(UI_KEYS.currency) || 'UZS';
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem(UI_KEYS.language) || 'uz';
  });

  const [networkStatus, setNetworkStatus] = useState('online');

  const showToast = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    
    const notif = {
      id: `NOTIF-${Date.now()}`,
      message,
      type,
      time: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [notif, ...prev].slice(0, 20));
  }, []);

  const clearNotification = useCallback(() => setNotification(null), []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    showToast('Barcha bildirishnomalar tozalandi', 'info');
  }, [showToast]);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    if (newSettings.language) setLanguage(newSettings.language);
    if (newSettings.currency) setCurrency(newSettings.currency);
    showToast("Sozlamalar saqlandi", "success");
    return true;
  }, [showToast]);

  const updateNotificationSettings = useCallback((newSettings) => {
    setNotificationSettings(prev => ({ ...prev, ...newSettings }));
    showToast("Bildirishnoma sozlamalari yangilandi", "success");
    return true;
  }, [showToast]);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  useEffect(() => { localStorage.setItem(UI_KEYS.notifications, JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem(UI_KEYS.notificationSettings, JSON.stringify(notificationSettings)); }, [notificationSettings]);
  useEffect(() => { localStorage.setItem(UI_KEYS.settings, JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem(UI_KEYS.currency, currency); }, [currency]);
  useEffect(() => { localStorage.setItem(UI_KEYS.language, language); }, [language]);

  useEffect(() => {
    const handleOnline = () => { setNetworkStatus('online'); showToast('Internet aloqasi tiklandi', 'success'); };
    const handleOffline = () => { setNetworkStatus('offline'); showToast('Internet aloqasi uzildi', 'error'); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showToast]);

  return {
    notification, notifications, notificationSettings, settings,
    currency, language, networkStatus,
    showToast, clearNotification,
    markAllNotificationsRead, markNotificationRead, clearAllNotifications,
    updateSettings, updateNotificationSettings,
    setPaymentMethod: () => {},
    setSelectedDeliveryZone: () => {},
  };
};

export default useUI;
