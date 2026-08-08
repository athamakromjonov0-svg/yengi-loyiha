import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const useProducts = (showToast) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE}/products`);
      const data = res.data;
      const all = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);

      const normalized = all.map(p => {
        let imgUrl = p.image;
        if (!imgUrl) {
          imgUrl = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80';
        } else if (!imgUrl.startsWith('http')) {
          imgUrl = `${BASE}${imgUrl}`;
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
  }, [showToast]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE}/categories`);
      const data = res.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('fetchCategories xato:', error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const addCategory = useCallback(async (categoryData) => {
    try {
      const res = await axios.post(`${BASE}/categories`, categoryData);
      const createdCategory = res.data;
      if (createdCategory) {
        setCategories(prev => [...prev, createdCategory]);
        showToast("Yangi kategoriya muvaffaqiyatli qo'shildi", "success");
        return true;
      }
      await fetchCategories();
      return true;
    } catch (error) {
      console.error('addCategory ichidagi xato:', error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || "Kategoriya qo'shishda xatolik";
      showToast(errorMsg, "error");
      return false;
    }
  }, [showToast, fetchCategories]);

  const updateCategory = useCallback(async (id, categoryData) => {
    try {
      const res = await axios.put(`${BASE}/categories/${id}`, categoryData);
      const updated = res.data;
      setCategories(prev => prev.map(c => c.id === id ? updated : c));
      showToast("Kategoriya muvaffaqiyatli yangilandi", "success");
      return true;
    } catch (error) {
      console.error('updateCategory xato:', error);
      showToast("Kategoriyani yangilashda xatolik", "error");
      return false;
    }
  }, [showToast]);

  const deleteCategory = useCallback(async (id) => {
    try {
      await axios.delete(`${BASE}/categories/${id}`);
      setCategories(prev => prev.filter(c => c.id !== id));
      showToast("Kategoriya o'chirildi", "warning");
      return true;
    } catch (error) {
      console.error('deleteCategory xato:', error);
      showToast("Kategoriyani o'chirishda xatolik", "error");
      return false;
    }
  }, [showToast]);

  const addProduct = useCallback(async (product) => {
    try {
      const res = await axios.post(`${BASE}/products`, product);
      const created = res.data;
      const normalized = {
        ...created,
        image: created.image?.startsWith('http')
          ? created.image
          : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
      };
      setProducts(prev => [...prev, normalized]);
      showToast(`Yangi kiber-mahsulot ma'lumotlar bazasiga qo'shildi`, "success");
      return true;
    } catch (error) {
      console.error('addProduct xato:', error);
      showToast("Katalogga qo'shishda xatolik", "error");
      return false;
    }
  }, [showToast]);

  const updateProduct = useCallback(async (id, updatedProduct) => {
    try {
      const res = await axios.put(`${BASE}/products/${id}`, updatedProduct);
      const updated = res.data;
      const normalized = {
        ...updated,
        image: updated.image?.startsWith('http')
          ? updated.image
          : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
      };
      setProducts(prev => prev.map(p => (p._id === id || p.id === id) ? normalized : p));
      showToast("Tizim o'zgarishlari muvaffaqiyatli sinxronizatsiya qilindi", "success");
      return true;
    } catch (error) {
      console.error('updateProduct xato:', error);
      showToast("Modifikatsiya saqlashda xatolik", "error");
      return false;
    }
  }, [showToast]);

  const deleteProduct = useCallback(async (id) => {
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
  }, [showToast]);

  const bulkDeleteProducts = useCallback(async (ids) => {
    try {
      for (const id of ids) {
        await axios.delete(`${BASE}/products/${id}`);
      }
      setProducts(prev => prev.filter(p => !ids.includes(p._id || p.id)));
      showToast(`${ids.length} ta mahsulot o'chirildi`, "success");
      return true;
    } catch (error) {
      console.error('bulkDeleteProducts xato:', error);
      showToast("Ommaviy o'chirishda xatolik", "error");
      return false;
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
