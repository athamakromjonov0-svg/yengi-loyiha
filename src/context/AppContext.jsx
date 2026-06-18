import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AppContext = createContext();
const BASE = 'https://zzonaback-production.up.railway.app/api';

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vortex_user')) || null; }
    catch { return null; }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('isAdminAuthenticated') === 'true'
  );

  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vortex_cart')) || []; }
    catch { return []; }
  });

  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vortex_wishlist')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('vortex_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('vortex_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = useCallback((message, type = 'success') => {
    setNotification({ message, type });
  }, []);

  const clearNotification = useCallback(() => setNotification(null), []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let all = [];
      let page = 1;
      let total = Infinity;

      while (all.length < total) {
        const res = await axios.get(`${BASE}/products?page=${page}&limit=20`);
        const data = res.data;
        const items = Array.isArray(data.data) ? data.data : [];
        total = data.total || items.length;
        all = [...all, ...items];
        if (items.length === 0) break;
        page++;
      }

      const normalized = all.map(p => {
        let imgUrl = p.image;
        if (!imgUrl) {
          imgUrl = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80';
        } else if (!imgUrl.startsWith('http')) {
          imgUrl = `https://zzonaback-production.up.railway.app${imgUrl}`;
        }
        return { ...p, image: imgUrl };
      });

      setProducts(normalized);
    } catch (error) {
      console.error('fetchProducts xato:', error);
      showToast("Global tarmoqdan ma'lumot yuklashda uzilish", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE}/categories`);
      const data = res.data;
      setCategories(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error('fetchCategories xato:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // --- KATEGORIYA QO'SHISH FUNKSIYASI ---
  const addCategory = async (categoryData) => {
    try {
      // categoryData obyekti { name: "kategoriya" } ko'rinishida kelishi kerak
      const res = await axios.post(`${BASE}/categories`, categoryData);
      
      // Backend formatiga mos ravishda ma'lumotni saralash
      const createdCategory = res.data?.data || res.data;

      if (createdCategory) {
        setCategories(prev => [...prev, createdCategory]);
        showToast("Yangi kategoriya muvaffaqiyatli qo'shildi", "success");
        return true;
      }
      
      // Kutilmagan backend strukturasi bo'lsa ro'yxatni bazadan qayta o'qiydi
      await fetchCategories();
      return true;
    } catch (error) {
      console.error('addCategory ichidagi xato:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || "Kategoriya qo'shishda xatolik";
      showToast(errorMsg, "error");
      return false;
    }
  };

  const addProduct = async (product) => {
    try {
      const res = await axios.post(`${BASE}/products`, product);
      const created = res.data.data || res.data;
      const normalized = {
        ...created,
        image: created.image?.startsWith('http')
          ? created.image
          : `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80`,
      };
      setProducts(prev => [...prev, normalized]);
      showToast(`Yangi kiber-mahsulot ma'lumotlar bazasiga qo'shildi`, "success");
      return true;
    } catch (error) {
      console.error('addProduct xato:', error);
      showToast("Katalogga qo'shishda xatolik", "error");
      return false;
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const res = await axios.put(`${BASE}/products/${id}`, updatedProduct);
      const updated = res.data.data || res.data;
      const normalized = {
        ...updated,
        image: updated.image?.startsWith('http')
          ? updated.image
          : `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80`,
      };
      setProducts(prev => prev.map(p => (p._id === id || p.id === id) ? normalized : p));
      showToast("Tizim o'zgarishlari muvaffaqiyatli sinxronizatsiya qilindi", "success");
      return true;
    } catch (error) {
      console.error('updateProduct xato:', error);
      showToast("Modifikatsiya saqlashda xatolik", "error");
      return false;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${BASE}/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id && p.id !== id));
      showToast("Mahsulot kiber-katalogdan o'chirildi", "warning");
      return true;
    } catch (error) {
      console.error('deleteProduct xato:', error);
      showToast("O'chirish protokolida xatolik", "error");
      return false;
    }
  };

  const login = (email, password) => {
    if (email === 'admin@premium.com' && password === 'admin123') {
      const mockUser = { email, role: 'admin', name: 'Admin Terminal' };
      setIsAuthenticated(true);
      setUser(mockUser);
      localStorage.setItem('isAdminAuthenticated', 'true');
      localStorage.setItem('vortex_user', JSON.stringify(mockUser));
      showToast("Kiber-shlyuz muvaffaqiyatli ochildi!", "success");
      return true;
    }
    showToast("Identifikatsiya ma'lumotlari xato!", "error");
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('vortex_user');
    showToast("Xavfsiz seans yakunlandi", "info");
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const id = product._id || product.id;
      const exists = prev.find(i => (i._id || i.id) === id);
      if (exists) {
        return prev.map(i => (i._id || i.id) === id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const decreaseCartQuantity = (id) => {
    setCart(prev => {
      const item = prev.find(i => (i._id || i.id) === id);
      if (item?.quantity <= 1) {
        showToast("Obyekt savat modovidan olib tashlandi", "warning");
        return prev.filter(i => (i._id || i.id) !== id);
      }
      return prev.map(i => (i._id || i.id) === id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => (i._id || i.id) !== id));
    showToast("Obyekt butunlay o'chirildi", "warning");
  };

  const clearCart = () => {
    setCart([]);
    showToast("Savat moduli tozalandi", "info");
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const id = product._id || product.id;
      const exists = prev.some(i => (i._id || i.id) === id);
      return exists
        ? prev.filter(i => (i._id || i.id) !== id)
        : [...prev, product];
    });
  };

  return (
    <AppContext.Provider value={{
      products, categories, loading, user, isAuthenticated,
      notification, cart, wishlist,
      login, logout,
      addProduct, updateProduct, deleteProduct, fetchProducts, fetchCategories,
      addCategory, // <- Provayderga xavfsiz ulandi
      showToast, clearNotification,
      addToCart, decreaseCartQuantity, removeFromCart, clearCart, toggleWishlist,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp albatta AppProvider ichida ishlatilishi shart!");
  return context;
};