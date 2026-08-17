import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Lokal zaxira kalitlari — API mavjud bo'lmaganda ma'lumotlar yo'qolmaydi
const PRODUCTS_KEY = 'vortex_products_local';
const CATEGORIES_KEY = 'vortex_categories_local';

const loadLocal = (key) => {
  try { return JSON.parse(localStorage.getItem(key)); }
  catch { return null; }
};

const saveLocal = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch { /* localStorage to'la bo'lishi mumkin */ }
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80';

const normalizeImage = (image) => {
  if (!image) return FALLBACK_IMAGE;
  if (String(image).startsWith('http')) return image;
  return `${BASE}${image}`;
};

const useProducts = (showToast) => {
  const [products, setProducts] = useState(() => loadLocal(PRODUCTS_KEY) || []);
  const [categories, setCategories] = useState(() => loadLocal(CATEGORIES_KEY) || []);
  const [loading, setLoading] = useState(true);

  // Server mavjudligini kuzatish — real vaqtda yangilash uchun
  const serverAvailable = useRef(false);

  // Har qanday o'zgarishda localStorage'ga yozamiz (offline himoya)
  useEffect(() => { saveLocal(PRODUCTS_KEY, products); }, [products]);
  useEffect(() => { saveLocal(CATEGORIES_KEY, categories); }, [categories]);

  // REAL VAQT: boshqa oynalar (admin panel / do'kon) o'zgarishlarini darhol qabul qilish
  useEffect(() => {
    const syncFromStorage = (e) => {
      if (e.key === PRODUCTS_KEY) {
        if (e.newValue === null) { setProducts([]); return; }
        try { setProducts(JSON.parse(e.newValue)); } catch { /* ignore */ }
      } else if (e.key === CATEGORIES_KEY) {
        if (e.newValue === null) { setCategories([]); return; }
        try { setCategories(JSON.parse(e.newValue)); } catch { /* ignore */ }
      }
    };
    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/products`);
      const data = res.data;
      const all = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      const normalized = all.map(p => ({ ...p, image: normalizeImage(p.image) }));
      setProducts(normalized);
      serverAvailable.current = true;
    } catch (error) {
      console.error('fetchProducts xato:', error);
      serverAvailable.current = false;
      // Lokal zaxirada ma'lumot bor bo'lsa — u ishlatiladi (toast bermaymiz, yumshoq rejim)
      if (!loadLocal(PRODUCTS_KEY)) {
        showToast("Server bilan aloqa yo'q. Lokal rejimda ishlanmoqda.", "warning");
      }
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE}/categories`);
      const data = res.data;
      const all = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      if (all.length > 0) setCategories(all);
    } catch (error) {
      console.error('fetchCategories xato:', error);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchProducts();
      fetchCategories();
    }, 0);
    return () => clearTimeout(t);
  }, [fetchProducts, fetchCategories]);

  // REAL VAQT: server ulangan bo'lsa, katalog va kategoriyalarni davriy yangilab turamiz
  useEffect(() => {
    const interval = setInterval(() => {
      if (navigator.onLine && serverAvailable.current) {
        fetchProducts();
        fetchCategories();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchProducts, fetchCategories]);

  // ---- KATEGORIYA CRUD (optimistic) ----

  const addCategory = useCallback(async (categoryData) => {
    const tempId = `cat-local-${Date.now()}`;
    const newCategory = { id: tempId, _id: tempId, ...categoryData };
    setCategories(prev => [...prev, newCategory]);
    try {
      const res = await axios.post(`${BASE}/categories`, categoryData);
      const created = res.data;
      if (created) {
        setCategories(prev => prev.map(c => (c.id === tempId || c._id === tempId) ? created : c));
      }
      showToast("Yangi kategoriya muvaffaqiyatli qo'shildi", "success");
      return true;
    } catch (error) {
      console.error('addCategory ichidagi xato:', error);
      showToast("Serverga ulanishda xatolik — o'zgarish lokal saqlandi", "warning");
      return true; // Lokal o'zgarish saqlanib qoladi
    }
  }, [showToast]);

  const updateCategory = useCallback(async (id, categoryData) => {
    setCategories(prev => prev.map(c => (c.id === id || c._id === id) ? { ...c, ...categoryData } : c));
    try {
      const res = await axios.put(`${BASE}/categories/${id}`, categoryData);
      const updated = res.data;
      if (updated) {
        setCategories(prev => prev.map(c => (c.id === id || c._id === id) ? updated : c));
      }
      showToast("Kategoriya muvaffaqiyatli yangilandi", "success");
      return true;
    } catch (error) {
      console.error('updateCategory xato:', error);
      showToast("Serverga ulanishda xatolik — o'zgarish lokal saqlandi", "warning");
      return true;
    }
  }, [showToast]);

  const deleteCategory = useCallback(async (id) => {
    setCategories(prev => prev.filter(c => c.id !== id && c._id !== id));
    try {
      await axios.delete(`${BASE}/categories/${id}`);
      showToast("Kategoriya o'chirildi", "warning");
      return true;
    } catch (error) {
      console.error('deleteCategory xato:', error);
      showToast("Serverga ulanishda xatolik — o'zgarish lokal saqlandi", "warning");
      return true;
    }
  }, [showToast]);

  // ---- MAHSULOT CRUD (optimistic) ----

  const addProduct = useCallback(async (product) => {
    const tempId = `prod-local-${Date.now()}`;
    const normalized = {
      ...product,
      id: product._id || product.id || tempId,
      image: normalizeImage(product.image || product.img),
    };
    setProducts(prev => [...prev, normalized]);
    try {
      const res = await axios.post(`${BASE}/products`, product);
      const created = res.data;
      if (created) {
        const serverNorm = { ...created, image: normalizeImage(created.image) };
        setProducts(prev => prev.map(p => (p.id === tempId) ? serverNorm : p));
      }
      showToast("Yangi mahsulot tizimga qo'shildi", "success");
      return true;
    } catch (error) {
      console.error('addProduct xato:', error);
      showToast("Serverga ulanishda xatolik — o'zgarish lokal saqlandi", "warning");
      return true;
    }
  }, [showToast]);

  const updateProduct = useCallback(async (id, updatedProduct) => {
    setProducts(prev => prev.map(p => (p._id === id || p.id === id) ? { ...p, ...updatedProduct, image: normalizeImage(updatedProduct.image) } : p));
    try {
      const res = await axios.put(`${BASE}/products/${id}`, updatedProduct);
      const updated = res.data;
      if (updated) {
        const serverNorm = { ...updated, image: normalizeImage(updated.image) };
        setProducts(prev => prev.map(p => (p._id === id || p.id === id) ? serverNorm : p));
      }
      showToast("Mahsulot muvaffaqiyatli yangilandi", "success");
      return true;
    } catch (error) {
      console.error('updateProduct xato:', error);
      showToast("Serverga ulanishda xatolik — o'zgarish lokal saqlandi", "warning");
      return true;
    }
  }, [showToast]);

  const deleteProduct = useCallback(async (id) => {
    setProducts(prev => prev.filter(p => p._id !== id && p.id !== id));
    try {
      await axios.delete(`${BASE}/products/${id}`);
      showToast("Mahsulot o'chirildi", "warning");
      return true;
    } catch (error) {
      console.error('deleteProduct xato:', error);
      showToast("Serverga ulanishda xatolik — o'zgarish lokal saqlandi", "warning");
      return true;
    }
  }, [showToast]);

  const bulkDeleteProducts = useCallback(async (ids) => {
    const idSet = new Set(ids);
    setProducts(prev => prev.filter(p => !idSet.has(p._id || p.id)));
    try {
      for (const id of ids) {
        await axios.delete(`${BASE}/products/${id}`);
      }
      showToast(`${ids.length} ta mahsulot o'chirildi`, "success");
      return true;
    } catch (error) {
      console.error('bulkDeleteProducts xato:', error);
      showToast("Serverga ulanishda xatolik — o'zgarish lokal saqlandi", "warning");
      return true;
    }
  }, [showToast]);

  return {
    products, categories, loading,
    fetchProducts, fetchCategories,
    addProduct, updateProduct, deleteProduct, bulkDeleteProducts,
    addCategory, updateCategory, deleteCategory,
  };
};

export default useProducts;
