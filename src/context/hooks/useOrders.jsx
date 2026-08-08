import { useState, useEffect, useCallback } from 'react';

const ORDERS_KEYS = {
  orders: 'vortex_orders',
  addresses: 'vortex_addresses',
  cards: 'vortex_cards',
  coupons: 'vortex_coupons',
  appliedCoupon: 'vortex_applied_coupon',
  bonusPoints: 'vortex_bonus_points',
  payment: 'vortex_payment',
  selectedZone: 'vortex_selected_zone',
  users: 'vortex_admin_users',
  activityLog: 'vortex_activity_log',
};

const DEFAULT_ADMIN_USERS = [
  { id: 'USR-001', name: 'Alisher Karimov', email: 'alisher@example.com', role: 'admin', status: 'active', joined: '2024-01-15', orders: 12, spent: 2450000 },
  { id: 'USR-002', name: 'Malika Tosheva', email: 'malika@example.com', role: 'user', status: 'active', joined: '2024-02-20', orders: 8, spent: 1890000 },
  { id: 'USR-003', name: 'Jasurbek Rahimov', email: 'jasur@example.com', role: 'user', status: 'blocked', joined: '2024-03-10', orders: 3, spent: 450000 },
  { id: 'USR-004', name: 'Dilnoza Aliyeva', email: 'dilnoza@example.com', role: 'user', status: 'active', joined: '2024-04-05', orders: 15, spent: 3200000 },
  { id: 'USR-005', name: 'Sarvar Usmonov', email: 'sarvar@example.com', role: 'moderator', status: 'active', joined: '2024-05-18', orders: 6, spent: 980000 },
];

const DEFAULT_ACTIVITIES = [
  { id: 'ACT-001', action: 'Mahsulot qo\'shildi', user: 'Alisher Karimov', time: '2 daqiqa oldin', type: 'product', icon: 'Plus' },
  { id: 'ACT-002', action: 'Buyurtma #ORD-1234 yangilandi', user: 'Malika Tosheva', time: '5 daqiqa oldin', type: 'order', icon: 'RefreshCcw' },
  { id: 'ACT-003', action: 'Yangi kategoriya yaratildi', user: 'Alisher Karimov', time: '10 daqiqa oldin', type: 'category', icon: 'FolderPlus' },
  { id: 'ACT-004', action: 'Kupon SUMMER20 faollashtirildi', user: 'Sarvar Usmonov', time: '15 daqiqa oldin', type: 'coupon', icon: 'Percent' },
  { id: 'ACT-005', action: 'Foydalanuvchi bloklandi', user: 'Alisher Karimov', time: '1 soat oldin', type: 'user', icon: 'Ban' },
  { id: 'ACT-006', action: 'Sevimlilar ro\'yxati tozalandi', user: 'Dilnoza Aliyeva', time: '2 soat oldin', type: 'wishlist', icon: 'Trash2' },
];

const DEFAULT_DELIVERY_ZONES = [
  { id: 'zone-1', name: "Toshkent shahri", price: 20000, days: '1-2 kun', freeFrom: 1000000 },
  { id: 'zone-2', name: "Toshkent viloyati", price: 25000, days: '2-3 kun', freeFrom: 1000000 },
  { id: 'zone-3', name: "Samarqand", price: 30000, days: '2-4 kun', freeFrom: 1500000 },
  { id: 'zone-4', name: "Buxoro", price: 35000, days: '3-5 kun', freeFrom: 1500000 },
  { id: 'zone-5', name: "Farg'ona vodiysi", price: 30000, days: '2-4 kun', freeFrom: 1500000 },
  { id: 'zone-6', name: "Qoraqalpog'iston", price: 40000, days: '4-6 kun', freeFrom: 2000000 },
  { id: 'zone-7', name: "Boshqa viloyatlar", price: 35000, days: '3-5 kun', freeFrom: 1500000 },
];

const DEFAULT_COUPONS = [
  { code: 'WELCOME10', discount: 10, minSpend: 500000, active: true },
  { code: 'SUMMER20', discount: 20, minSpend: 1000000, active: true },
  { code: 'NEWYEAR30', discount: 30, minSpend: 2000000, active: true },
];

const useOrders = (showToast) => {
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEYS.orders)) || []; }
    catch { return []; }
  });

  const [deliveryZones, setDeliveryZones] = useState(DEFAULT_DELIVERY_ZONES);

  const [selectedDeliveryZone, setSelectedDeliveryZone] = useState(() => {
    return localStorage.getItem(ORDERS_KEYS.selectedZone) || 'zone-1';
  });

  const [addresses, setAddresses] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEYS.addresses)) || []; }
    catch { return []; }
  });

  const [paymentMethod, setPaymentMethod] = useState(() => {
    return localStorage.getItem(ORDERS_KEYS.payment) || 'cash';
  });

  const [savedCards, setSavedCards] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEYS.cards)) || []; }
    catch { return []; }
  });

  const [coupons, setCoupons] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEYS.coupons)) || DEFAULT_COUPONS; }
    catch { return DEFAULT_COUPONS; }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEYS.appliedCoupon)) || null; }
    catch { return null; }
  });

  const [bonusPoints, setBonusPoints] = useState(() => {
    return Number(localStorage.getItem(ORDERS_KEYS.bonusPoints)) || 0;
  });

  const [users, setUsers] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEYS.users)) || DEFAULT_ADMIN_USERS; }
    catch { return DEFAULT_ADMIN_USERS; }
  });

  const [activityLog, setActivityLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEYS.activityLog)) || DEFAULT_ACTIVITIES; }
    catch { return DEFAULT_ACTIVITIES; }
  });

  useEffect(() => { localStorage.setItem(ORDERS_KEYS.orders, JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem(ORDERS_KEYS.addresses, JSON.stringify(addresses)); }, [addresses]);
  useEffect(() => { localStorage.setItem(ORDERS_KEYS.cards, JSON.stringify(savedCards)); }, [savedCards]);
  useEffect(() => { localStorage.setItem(ORDERS_KEYS.coupons, JSON.stringify(coupons)); }, [coupons]);
  useEffect(() => { localStorage.setItem(ORDERS_KEYS.appliedCoupon, JSON.stringify(appliedCoupon)); }, [appliedCoupon]);
  useEffect(() => { localStorage.setItem(ORDERS_KEYS.bonusPoints, String(bonusPoints)); }, [bonusPoints]);
  useEffect(() => { localStorage.setItem(ORDERS_KEYS.payment, paymentMethod); }, [paymentMethod]);
  useEffect(() => { localStorage.setItem(ORDERS_KEYS.selectedZone, selectedDeliveryZone); }, [selectedDeliveryZone]);
  useEffect(() => { localStorage.setItem(ORDERS_KEYS.users, JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem(ORDERS_KEYS.activityLog, JSON.stringify(activityLog)); }, [activityLog]);

  const createOrder = useCallback((cartItems, orderInfo = {}) => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return null;
    
    const subtotal = cartItems.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const hasDiscount = item.discount && Number(item.discount) > 0;
      const itemPrice = hasDiscount ? price * (1 - Number(item.discount) / 100) : price;
      return sum + itemPrice * (item.quantity || 1);
    }, 0);

    const couponDiscount = appliedCoupon && subtotal >= (appliedCoupon.minSpend || 0)
      ? subtotal * (Number(appliedCoupon.discount) / 100)
      : 0;

    const deliveryFee = orderInfo.deliveryFee ?? (subtotal >= 1000000 ? 0 : 20000);
    
    const newOrder = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1000)}`,
      items: cartItems.map((item) => ({
        id: item._id || item.id,
        name: item.name || item.title || '',
        image: item.image,
        quantity: item.quantity || 1,
        price: Number(item.price) || 0,
        discount: Number(item.discount) || 0,
      })),
      subtotal,
      couponDiscount,
      deliveryFee,
      total: subtotal - couponDiscount + deliveryFee,
      createdAt: new Date().toISOString(),
      status: 'Qabul qilindi',
      paymentMethod: orderInfo.paymentMethod || paymentMethod,
      address: orderInfo.address || null,
      deliveryZone: orderInfo.deliveryZone || null,
      notes: orderInfo.notes || '',
    };

    setOrders(prev => [newOrder, ...prev]);
    const pointsEarned = Math.floor(subtotal / 10000);
    if (pointsEarned > 0) {
      setBonusPoints(prev => prev + pointsEarned);
    }
    showToast("Buyurtma saqlandi va tarixi yangilandi!", "success");
    return newOrder;
  }, [appliedCoupon, paymentMethod, showToast]);

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    showToast(`Buyurtma statusi o'zgartirildi: ${newStatus}`, "success");
  }, [showToast]);

  const cancelOrder = useCallback((orderId) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'Bekor qilindi' } : order
    ));
    showToast("Buyurtma bekor qilindi", "warning");
  }, [showToast]);

  const addAddress = useCallback((addressData) => {
    const newAddress = {
      id: `ADDR-${Date.now()}`,
      ...addressData,
      isDefault: addresses.length === 0 ? true : (addressData.isDefault || false),
    };
    if (newAddress.isDefault) {
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })));
    }
    setAddresses(prev => [...prev, newAddress]);
    showToast("Yangi manzil muvaffaqiyatli qo'shildi", "success");
    return newAddress;
  }, [addresses.length, showToast]);

  const updateAddress = useCallback((id, addressData) => {
    setAddresses(prev => prev.map(a => a.id === id ? { ...a, ...addressData } : a));
    showToast("Manzil yangilandi", "success");
    return true;
  }, [showToast]);

  const deleteAddress = useCallback((id) => {
    setAddresses(prev => {
      const addressToDelete = prev.find(a => a.id === id);
      const filtered = prev.filter(a => a.id !== id);
      
      if (addressToDelete?.isDefault && filtered.length > 0) {
        return filtered.map((a, idx) => idx === 0 ? { ...a, isDefault: true } : a);
      }
      return filtered;
    });
    showToast("Manzil o'chirildi", "warning");
  }, [showToast]);

  const setDefaultAddress = useCallback((id) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    showToast("Asosiy manzil yangilandi", "success");
  }, [showToast]);

  const addCard = useCallback((cardData) => {
    const newCard = {
      id: `CARD-${Date.now()}`,
      ...cardData,
      isDefault: savedCards.length === 0 ? true : (cardData.isDefault || false),
    };
    setSavedCards(prev => [...prev, newCard]);
    showToast("Yangi karta saqlandi", "success");
    return newCard;
  }, [savedCards.length, showToast]);

  const deleteCard = useCallback((id) => {
    setSavedCards(prev => prev.filter(c => c.id !== id));
    showToast("Karta o'chirildi", "warning");
  }, [showToast]);

  const setDefaultCard = useCallback((id) => {
    setSavedCards(prev => prev.map(c => ({ ...c, isDefault: c.id === id })));
    showToast("Asosiy karta yangilandi", "success");
  }, [showToast]);

  const applyCoupon = useCallback((code) => {
    const coupon = coupons.find(c => c.code === code.toUpperCase() && c.active);
    if (!coupon) {
      showToast("Bunday kupon mavjud emas yoki aktiv emas!", "error");
      return false;
    }
    showToast(`${coupon.discount}% chegirma kuponi qo'llandi!`, "success");
    setAppliedCoupon(coupon);
    return true;
  }, [coupons, showToast]);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    showToast("Kupon olib tashlandi", "info");
  }, [showToast]);

  const addCoupon = useCallback((couponData) => {
    const newCoupon = {
      ...couponData,
      code: couponData.code.toUpperCase(),
      active: true,
    };
    setCoupons(prev => [...prev, newCoupon]);
    showToast("Yangi kupon yaratildi", "success");
    return true;
  }, [showToast]);

  const updateCoupon = useCallback((code, couponData) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, ...couponData } : c));
    showToast("Kupon muvaffaqiyatli yangilandi", "success");
    return true;
  }, [showToast]);

  const deleteCoupon = useCallback((code) => {
    setCoupons(prev => prev.filter(c => c.code !== code));
    showToast("Kupon o'chirildi", "warning");
    return true;
  }, [showToast]);

  const addBonusPoints = useCallback((amount) => {
    const pointsEarned = Math.floor(amount / 10000);
    if (pointsEarned > 0) {
      setBonusPoints(prev => prev + pointsEarned);
    }
  }, []);

  const useBonusPoints = useCallback((points) => {
    if (points > bonusPoints) return false;
    setBonusPoints(prev => prev - points);
    showToast(`${points} bonus bal ishlatildi`, "success");
    return true;
  }, [bonusPoints, showToast]);

  const addUser = useCallback((userData) => {
    const newUser = {
      id: `USR-${Date.now()}`,
      ...userData,
      status: 'active',
      joined: new Date().toISOString().slice(0, 10),
      orders: 0,
      spent: 0,
    };
    setUsers(prev => [...prev, newUser]);
    showToast("Yangi foydalanuvchi qo'shildi", "success");
    return true;
  }, [showToast]);

  const updateUser = useCallback((id, userData) => {
    setUsers(prev => prev.map(u => (u.id === id || u._id === id) ? { ...u, ...userData } : u));
    showToast("Foydalanuvchi yangilandi", "success");
    return true;
  }, [showToast]);

  const deleteUser = useCallback((id) => {
    setUsers(prev => prev.filter(u => u.id !== id && u._id !== id));
    showToast("Foydalanuvchi o'chirildi", "warning");
    return true;
  }, [showToast]);

  const addActivityLog = useCallback((activity) => {
    const newActivity = {
      id: `ACT-${Date.now()}`,
      time: 'hozir',
      ...activity,
    };
    setActivityLog(prev => [newActivity, ...prev].slice(0, 50));
    return newActivity;
  }, []);

  return {
    orders, addresses, savedCards, coupons, appliedCoupon, bonusPoints,
    paymentMethod, deliveryZones, selectedDeliveryZone,
    setPaymentMethod, setSelectedDeliveryZone,
    users, activityLog,
    createOrder, updateOrderStatus, cancelOrder,
    addAddress, updateAddress, deleteAddress, setDefaultAddress,
    addCard, deleteCard, setDefaultCard,
    applyCoupon, removeCoupon, addCoupon, updateCoupon, deleteCoupon,
    addBonusPoints, useBonusPoints,
    addUser, updateUser, deleteUser, addActivityLog,
  };
};

export default useOrders;
