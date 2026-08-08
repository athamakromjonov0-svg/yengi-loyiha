import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, Plus, Trash2, Edit3, Search, Package,
  Coins, Layers, Check, X, Percent, AlertTriangle, Sparkles,
  ShieldAlert, RefreshCw, FolderPlus, ShoppingCart, Users,
  Settings, FileText, BarChart3, TrendingUp, TrendingDown,
  Clock, DollarSign, Tag, Truck, CreditCard, Bell,
  Filter, Download, Upload, Eye, ChevronRight, Activity,
  Zap, Globe, Mail, Phone, MapPin, Calendar, ArrowUpRight,
  ArrowDownRight, MoreVertical, Save, RotateCcw, Moon,
  Sun, Monitor, Shield, Lock, Key, UserPlus, UserCheck,
  UserX, Ban, CheckCircle, XCircle, Clock3, ClipboardList,
  MessageSquare, Star, ThumbsUp, Share2, Copy, ExternalLink,
  HelpCircle, Info, AlertCircle, ChevronLeft, Menu, Maximize2, Minimize2, RefreshCcw as RefreshIcon,
  Archive, Inbox, Send, FileSpreadsheet, Printer, Camera,
  Image as ImageIcon, Link2, Unlink, Power, ToggleLeft,
  ToggleRight, Palette, Type, Ruler, Volume2, VolumeX,
  Wifi, WifiOff, Battery, Bluetooth, BluetoothOff, Signal,
  Smartphone, Tablet, Laptop, Watch, Tv, Radio, Speaker,
  Mic, MicOff, Video, VideoOff, PhoneCall, PhoneIncoming,
  PhoneOutgoing, Voicemail, Headphones, Music, Play,
  Pause, SkipForward, SkipBack, Shuffle, Repeat, Volume1
} from 'lucide-react';

const formatPrice = (price) => {
  return new Intl.NumberFormat('uz-UZ').format(Math.round(Number(price) || 0)) + " so'm";
};

const STATUS_COLORS = {
  'Qabul qilindi': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Jarayonda': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Yetkazilmoqda': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'Yetkazildi': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Bekor qilindi': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'Qaytarildi': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const DEFAULT_USERS = [
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

export default function AdminDashboard() {
  const {
    products, addProduct, updateProduct, deleteProduct,
    categories, addCategory, showToast,
    orders, updateOrderStatus, cancelOrder,
    coupons, addCoupon, updateCoupon, deleteCoupon,
    users: contextUsers, addUser, updateUser, deleteUser,
    activityLog, addActivityLog,
    settings, updateSettings,
    notification, setNotification, clearNotification
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCatSubmitting, setIsCatSubmitting] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [dateRange, setDateRange] = useState('7days');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('all');
  const [selectedUserRole, setSelectedUserRole] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', minSpend: '', active: true });
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user', password: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [activityFilter, setActivityFilter] = useState('all');
  const [settingsTab, setSettingsTab] = useState('general');
  const [tempSettings, setTempSettings] = useState(settings || {});
  const [couponSearch, setCouponSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAllOrders, setSelectAllOrders] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [lowStockFilter, setLowStockFilter] = useState('all');
  const [exportFormat, setExportFormat] = useState('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [specsInput, setSpecsInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [stockInput, setStockInput] = useState('');
  const [discountInput, setDiscountInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [titleInput, setTitleInput] = useState('');
  const [isNewInput, setIsNewInput] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Sektor tanlang',
    image: '',
    discount: '0',
    stock: '10',
    isNew: false,
    specs: ''
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(Math.round(Number(price) || 0)) + " so'm";
  };

  // --- DINAMIK KATEGORIYALAR MATRIXI ---
  // Agar context'dan maxsus 'categories' kelsa o'shani oladi, bo'lmasa mahsulotlar ichidagilarini yig'adi
  const dbCategories = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.map(c => ({ id: c._id || c.id, name: c.name }));
    }
    if (!products) return [];
    const uniqueMap = new Map();
    
    products.forEach(p => {
      if (p.category && typeof p.category === 'object' && p.category._id) {
        uniqueMap.set(p.category._id, p.category.name);
      } else if (p.category && typeof p.category === 'string') {
        uniqueMap.set(p.category, p.category);
      }
    });

    return Array.from(uniqueMap.entries()).map(([id, name]) => ({ id, name }));
  }, [products, categories]);

  // --- ANALYTICAL METRIKALAR ---
  const analytics = useMemo(() => {
    const total = products ? products.length : 0;
    
    const grossValuation = products ? products.reduce((acc, curr) => {
      return acc + (Number(curr.price) || 0) * (Number(curr.stock) || 1);
    }, 0) : 0;

    const discountedCount = products ? products.filter(p => Number(p.discount) > 0).length : 0;
    const lowStockCount = products ? products.filter(p => p.stock && Number(p.stock) < 5).length : 0;

    return {
      total,
      grossValuation,
      categoriesCount: dbCategories.length,
      discountedCount,
      lowStockCount
    };
  }, [products, dbCategories]);

  // Real vaqtda qidirish va filtrlar
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const catName = typeof p.category === 'object' ? p.category?.name : p.category;
      const catId = typeof p.category === 'object' ? p.category?._id : p.category;
      
      const pTitle = String(p.name || p.title || '').toLowerCase();
      const pCategoryName = String(catName || '').toLowerCase();
      const pId = String(p._id || p.id || '');

      const matchesSearch = 
        pTitle.includes(search.toLowerCase()) || 
        pCategoryName.includes(search.toLowerCase()) ||
        pId.includes(search);
        
      const matchesCategory = 
        selectedCategory === 'ALL' || 
        catId === selectedCategory || 
        String(catName).toUpperCase() === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  // --- ALOHIDA KATEGORIYA QO'SHISH FUNKSIYASI ---
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      showToast("Kategoriya nomini kiriting!", "error");
      return;
    }

    setIsCatSubmitting(true);
    try {
      if (addCategory) {
        await addCategory({ name: newCategoryName.trim() });
        showToast("Yangi kategoriya tizimga muvaffaqiyatli kiritildi!", "success");
        setNewCategoryName('');
      } else {
        showToast("Context ichida addCategory funksiyasi topilmadi.", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Kategoriya qo'shishda xatolik yuz berdi.", "error");
    } finally {
      setIsCatSubmitting(false);
    }
  };

  // --- MAHSULOT QO'SHISH VA YANGILASH ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price || form.category === 'Sektor tanlang' || !form.image) {
      showToast("Kritik maydonlar (nom, narx, sektor, rasm) to'ldirilishi shart!", "error");
      return;
    }

    setIsSubmitting(true);

    const specsArray = form.specs
      ? form.specs.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    const productPayload = {
      title: form.title,
      name: form.title, 
      description: form.description || "Premium mahsulot.",
      price: Number(form.price),
      category: form.category, 
      image: form.image,
      img: form.image, 
      discount: Number(form.discount) || 0,
      stock: Number(form.stock) || 0,
      isNew: Boolean(form.isNew),
      specs: specsArray
    };

    try {
      if (editingId) {
        await updateProduct(editingId, productPayload);
        setEditingId(null);
        resetForm();
        showToast("Resurs muvaffaqiyatli yangilandi!", "success");
      } else {
        await addProduct({
          ...productPayload,
          rating: 5.0,
          reviewsCount: 0
        });
        resetForm();
        showToast("Yangi resurs konveyerga qo'shildi!", "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Mahsulot qo'shish operatsiyasida xatolik.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredActivities = useMemo(() => {
    if (!activityLog) return [];
    if (activityFilter === 'all') return activityLog;
    return activityLog.filter(a => a.type === activityFilter);
  }, [activityLog, activityFilter]);

  const exportData = (data, filename, label) => {
    if (!data || data.length === 0) {
      showToast('Eksport qilish uchun ma\'lumot topilmadi', 'error');
      return;
    }
    if (exportFormat === 'csv') {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(item => Object.values(item).map(v => `"${v}"`).join(','));
      const csv = [headers, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showToast(`${label} CSV formatda eksport qilindi`, 'success');
    } else if (exportFormat === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showToast(`${label} JSON formatda eksport qilindi`, 'success');
    } else {
      showToast('XLSX formati tez orada qo\'shiladi', 'info');
    }
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        let imported = [];
        if (file.name.endsWith('.json')) {
          imported = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n').filter(line => line.trim());
          if (lines.length > 1) {
            const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
            imported = lines.slice(1).map(line => {
              const values = line.split(',').map(v => v.replace(/"/g, '').trim());
              const obj = {};
              headers.forEach((h, i) => { obj[h] = values[i]; });
              return obj;
            });
          }
        }
        if (imported.length > 0) {
          showToast(`${imported.length} ta element import qilindi`, 'success');
          setShowImportModal(false);
        } else {
          showToast('Import qilinadigan ma\'lumot topilmadi', 'error');
        }
      } catch (err) {
        showToast('Faylni o\'qishda xatolik yuz berdi', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) {
      showToast('Barcha maydonlarni to\'ldiring', 'error');
      return;
    }
    try {
      if (editingUser) {
        await updateUser(editingUser._id || editingUser.id, {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        });
        showToast('Foydalanuvchi yangilandi', 'success');
      } else {
        await addUser({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          password: newUser.password,
        });
        showToast('Yangi foydalanuvchi qo\'shildi', 'success');
      }
      setShowUserModal(false);
      setEditingUser(null);
      setNewUser({ name: '', email: '', role: 'user', password: '' });
    } catch (error) {
      showToast('Foydalanuvchi saqlashda xatolik', 'error');
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedOrders.length === 0) return;
    try {
      for (const orderId of selectedOrders) {
        if (bulkAction === 'delete') {
          await cancelOrder(orderId);
        } else {
          await updateOrderStatus(orderId, bulkAction);
        }
      }
      showToast(`${selectedOrders.length} ta buyurtma uchun amal bajarildi`, 'success');
      setSelectedOrders([]);
      setSelectAllOrders(false);
      setBulkAction('');
      setShowBulkConfirm(false);
    } catch (error) {
      showToast('Ommaviy amalni bajarishda xatolik', 'error');
    }
  };

  const handleEditInit = (p) => {
    const currentId = p._id || p.id;
    const catValue = typeof p.category === 'object' ? p.category?._id : p.category;
    
    setEditingId(currentId);
    setForm({
      title: p.name || p.title || '',
      description: p.description || '',
      price: String(p.price || ''),
      category: catValue || 'Sektor tanlang',
      image: p.image || p.img || '',
      discount: String(p.discount || '0'),
      stock: String(p.stock || '10'),
      isNew: Boolean(p.isNew),
      specs: Array.isArray(p.specs) ? p.specs.join(', ') : ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmWipe = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteProduct(deleteConfirmId);
      if (editingId === deleteConfirmId) resetForm();
      setDeleteConfirmId(null);
      showToast("Resurs tizimdan o'chirildi.", "success");
    } catch (error) {
      showToast("O'chirishda xatolik yuz berdi.", "error");
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      price: '',
      category: 'Sektor tanlang',
      image: '',
      discount: '0',
      stock: '10',
      isNew: false,
      specs: ''
    });
    setEditingId(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 font-sans text-white relative min-h-screen">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40 -z-10" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-900 pb-8 mb-10 gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-emerald-400 border border-slate-800 shadow-xl shadow-emerald-500/5">
            <LayoutDashboard className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-wider uppercase font-mono">
              Control <span className="text-emerald-400">Terminal</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 tracking-wide font-light">
              Tizim mutatsiyalari, ma'lumotlar ombori tahlili va resurslarni manipulyatsiya qilish segmenti.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            CLUSTER STATUS: CORE_READY
          </span>
        </div>
      </div>

      {/* ANALYTICAL CRYPTO-WIDGETS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 mb-10">
        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-5 flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20"><Package className="h-5 w-5" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Indekslangan</p>
            <p className="text-xl font-black text-white mt-0.5 font-mono">{analytics.total} <span className="text-xs text-slate-600 font-normal">ta</span></p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-5 flex items-center gap-4 shadow-xl col-span-1">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20"><Coins className="h-5 w-5" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Yalpi Qiymat</p>
            <p className="text-sm font-black text-white mt-1 font-mono tracking-tight">{formatPrice(analytics.grossValuation)}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-5 flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-violet-500/10 text-violet-400 rounded-xl border border-violet-500/20"><Layers className="h-5 w-5" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Kategoriyalar</p>
            <p className="text-xl font-black text-white mt-0.5 font-mono">{analytics.categoriesCount} <span className="text-xs text-slate-600 font-normal">ta</span></p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-900 bg-slate-950/60 backdrop-blur-md p-5 flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20"><Percent className="h-5 w-5" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Chegirmalar</p>
            <p className="text-xl font-black text-white mt-0.5 font-mono">{analytics.discountedCount} <span className="text-xs text-slate-600 font-normal">tovar</span></p>
          </div>
        </div>

        <div className={`rounded-2xl border p-5 flex items-center gap-4 shadow-xl transition duration-300 col-span-2 lg:col-span-1 ${
          analytics.lowStockCount > 0 ? 'border-amber-500/30 bg-amber-950/10 text-amber-400 animate-pulse' : 'border-slate-900 bg-slate-950/60'
        }`}>
          <div className={`p-3 rounded-xl border ${analytics.lowStockCount > 0 ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-slate-900 text-slate-500 border-slate-800'}`}><AlertTriangle className="h-5 w-5" /></div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Kritik Zaxira</p>
            <p className="text-xl font-black mt-0.5 font-mono">{analytics.lowStockCount} <span className="text-xs text-slate-600 font-normal">ta qoldi</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* CHAP TOMON: FORMALAR MATRIXI */}
        <div className="lg:col-span-1 flex flex-col gap-6 sticky top-24">
          
          {/* ALOHIDA KATEGORIYA QO'SHISH FORMASI */}
          <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-6 shadow-xl border-t-violet-500/20">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
              <h2 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <FolderPlus className="h-4 w-4 text-violet-400" />
                YANGI KATEGORIYA QO'SHISH
              </h2>
            </div>
            <form onSubmit={handleCategorySubmit} className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-violet-500/50 focus:outline-none transition font-medium"
                  placeholder="Masalan: iPhone, Aksessuarlar..."
                />
              </div>
              <button 
                type="submit"
                disabled={isCatSubmitting}
                className="bg-violet-500 text-slate-950 px-4 rounded-xl flex items-center justify-center transition active:scale-95 disabled:opacity-50"
              >
                {isCatSubmitting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 font-black" />}
              </button>
            </form>
          </div>

          {/* MAHSULOT KIRITISH FORMASI */}
          <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl p-6 shadow-xl border-t-emerald-500/20">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4 mb-5">
              <h2 className="text-xs font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                {editingId ? "SXEMANI O'ZGARTIRISH" : "YANGI RESURS KIRITISH"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">MAHSULOT TIZIMLI NOMI</label>
                <input
                  type="text" required value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none transition font-medium"
                  placeholder='Masalan: MacBook Pro 16"' 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">BAZA NARXI (UZS)</label>
                  <input
                    type="number" required value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none transition font-mono"
                    placeholder="3499"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">SEKTOR (KATEGORIYA)</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none transition font-medium"
                  >
                    <option disabled value="Sektor tanlang">Sektor tanlang</option>
                    {dbCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">CHEGIRMA FOIZI (%)</label>
                  <input
                    type="number" value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })}
                    className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none transition font-mono"
                    min="0" max="99"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">OMBOR KVANT ZAXIRASI</label>
                  <input
                    type="number" value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none transition font-mono"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">IMAGE URL</label>
                <input
                  type="url" required value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none transition"
                  placeholder="Rasm havolasini kiriting..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">TEXNIK XUSUSIYATLAR</label>
                <input
                  type="text" value={form.specs}
                  onChange={(e) => setForm({ ...form, specs: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none transition"
                  placeholder="M3 Max, 48GB RAM, 1TB SSD"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">TAVSIF</label>
                <textarea
                  rows="2" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-900 bg-slate-950/90 px-3 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none transition font-light"
                  placeholder="Mahsulot haqida tavsif..."
                />
              </div>

              <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-900">
                <input
                  type="checkbox" id="isNew" checked={form.isNew}
                  onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                  className="h-4 w-4 rounded bg-slate-950 text-emerald-500 accent-emerald-400 cursor-pointer"
                />
                <label htmlFor="isNew" className="text-[10px] font-bold text-slate-300 uppercase tracking-wider cursor-pointer font-mono select-none">
                  "YANGI" STATUSINI YOQISH
                </label>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-black uppercase tracking-wider transition active:scale-[0.98] disabled:opacity-50 ${
                    editingId ? 'bg-amber-400 text-slate-950' : 'bg-emerald-400 text-slate-950'
                  }`}
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : editingId ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {editingId ? "SXEMANI YANGILASH" : "KONVEYERGA QO'SHISH"}
                </button>
                
                {editingId && (
                  <button 
                    type="button" onClick={resetForm} 
                    className="p-3 rounded-xl border border-slate-900 bg-slate-950 text-slate-500 hover:text-white transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* O'NG TOMON: OMBOR JADVALI */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-900 bg-slate-950/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
              <input
                type="text" placeholder="Tizimdan qidirish..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-900 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white focus:outline-none transition"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                  selectedCategory === 'ALL' ? 'bg-emerald-400 text-slate-950' : 'bg-slate-900 text-slate-400'
                }`}
              >
                Barchasi
              </button>
              {dbCategories.map((cat) => (
                <button
                  key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition border ${
                    selectedCategory === cat.id ? 'bg-emerald-400 border-emerald-400 text-slate-950' : 'bg-slate-900 border-slate-900 text-slate-400'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/40 text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">
                  <th className="p-4">Resurs (Node)</th>
                  <th className="p-4">Sektor Class</th>
                  <th className="p-4">Kvant Zaxira</th>
                  <th className="p-4">Birlik Qiymati</th>
                  <th className="p-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-xs">
                {filteredProducts.map((p) => {
                  const currentId = p._id || p.id;
                  const isLowStock = p.stock && Number(p.stock) < 5;
                  const displayDiscount = Number(p.discount) || 0;
                  const catName = typeof p.category === 'object' ? p.category?.name : p.category;

                  return (
                    <tr key={currentId} className="hover:bg-slate-900/40 transition-colors group">
                      <td className="p-4 flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                          <img src={p.image || p.img} alt="" className="h-full w-full object-cover group-hover:scale-110 transition" />
                          {displayDiscount > 0 && (
                            <div className="absolute top-0 left-0 bg-rose-500 text-[8px] font-black text-white px-1 py-0.5 rounded-br">
                              -{displayDiscount}%
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-white uppercase group-hover:text-emerald-400 transition">
                            {p.name || p.title}
                          </p>
                          <p className="text-[9px] text-slate-600 font-mono">ID: #{currentId}</p>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="inline-flex items-center rounded-md bg-slate-900 border border-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400 font-mono">
                          {catName}
                        </span>
                      </td>

                      <td className="p-4 font-mono font-bold">
                        <span className={isLowStock ? 'text-rose-400' : 'text-slate-300'}>
                          {p.stock || 0} ta
                        </span>
                      </td>

                      <td className="p-4 font-mono font-black text-slate-200">
                        {formatPrice(p.price)}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => handleEditInit(p)} className="p-2 text-slate-500 hover:text-amber-400 transition">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button onClick={() => setDeleteConfirmId(currentId)} className="p-2 text-slate-600 hover:text-rose-400 transition">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-14 text-xs text-slate-600 font-mono uppercase">
                      <ShieldAlert className="h-6 w-6 text-slate-700 mx-auto mb-2" />
                      Hech qanday resurs topilmadi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

        {/* ACTIVITY TAB */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black uppercase tracking-wider font-mono">Faoliyat <span className="text-emerald-400">Logi</span></h1>
                <p className="text-xs text-slate-500 mt-1 font-mono">Tizim o'zgarishlari va hodisalar tarixi</p>
              </div>
              <div className="flex items-center gap-3">
                <select value={activityFilter} onChange={(e) => setActivityFilter(e.target.value)} className="bg-slate-900 border border-slate-800 text-white text-xs rounded-xl px-4 py-2.5 focus:border-emerald-500/50 focus:outline-none font-mono">
                  <option value="all">Barchasi</option>
                  <option value="product">Mahsulotlar</option>
                  <option value="order">Buyurtmalar</option>
                  <option value="user">Foydalanuvchilar</option>
                  <option value="coupon">Kuponlar</option>
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl overflow-hidden shadow-xl">
              <div className="divide-y divide-slate-900">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-4 hover:bg-slate-900/30 transition">
                    <div className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                      <Activity className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white">{activity.action}</p>
                      <p className="text-[10px] text-slate-500">{activity.user} | {activity.time}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      activity.type === 'product' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      activity.type === 'order' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      activity.type === 'user' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' :
                      activity.type === 'coupon' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                      {activity.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COUPON MODAL */}
        {showExportModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="max-w-md w-full bg-slate-950 rounded-2xl border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-white font-mono uppercase">Eksport Formatini Tanlang</h3>
                <button onClick={() => setShowExportModal(false)} className="p-2 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                {['csv', 'json', 'xlsx'].map((format) => (
                  <button
                    key={format}
                    onClick={() => {
                      if (format === 'csv') exportData(products, 'products', 'Mahsulotlar');
                      else if (format === 'json') exportData(orders, 'orders', 'Buyurtmalar');
                      else showToast('Xlsx formati tez orada qo\'shiladi', 'info');
                      setShowExportModal(false);
                    }}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border transition ${
                      exportFormat === format ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
                    }`}
                  >
                    <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-white uppercase">{format.toUpperCase()}</p>
                      <p className="text-[10px] text-slate-500">
                        {format === 'csv' ? 'Kompyuter jadvali formati' : format === 'json' ? 'Ma\'lumotlar formati' : 'Excel formati'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* IMPORT MODAL */}
        {showImportModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="max-w-md w-full bg-slate-950 rounded-2xl border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-white font-mono uppercase">Ma'lumotlarni Import</h3>
                <button onClick={() => setShowImportModal(false)} className="p-2 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="border-2 border-dashed border-slate-800 rounded-xl p-8 text-center hover:border-emerald-500/30 transition">
                <Upload className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                <p className="text-xs text-slate-400 mb-3">CSV yoki JSON fayl yuklang</p>
                <label className="inline-flex items-center gap-2 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer hover:bg-emerald-400 transition">
                  <Upload className="h-4 w-4" /> Fayl Tanlash
                  <input type="file" accept=".csv,.json" onChange={importData} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* PREVIEW MODAL */}
        {showPreviewModal && previewProduct && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="max-w-2xl w-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="relative h-64 bg-slate-900">
                <img src={previewProduct.image || previewProduct.img} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                <button onClick={() => setShowPreviewModal(false)} className="absolute top-4 right-4 p-2 rounded-lg bg-slate-950/80 text-white hover:bg-slate-900 transition">
                  <X className="h-4 w-4" />
                </button>
                {Number(previewProduct.discount) > 0 && (
                  <div className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-black px-3 py-1 rounded-full">
                    -{previewProduct.discount}%
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-black text-white mb-2">{previewProduct.name || previewProduct.title}</h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">{previewProduct.description}</p>
                <div className="flex items-center gap-4 mb-4">
                  <p className="text-xl font-black text-emerald-400 font-mono">{formatPrice(previewProduct.price)}</p>
                  {Number(previewProduct.discount) > 0 && (
                    <p className="text-sm text-slate-500 line-through font-mono">{formatPrice(previewProduct.price * (1 + Number(previewProduct.discount) / 100))}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border ${
                    previewProduct.isNew ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}>
                    {previewProduct.isNew ? 'YANGI' : 'ODDIY'}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Zaxira: {previewProduct.stock || 0} ta</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BULK ACTION CONFIRM MODAL */}
        {showBulkConfirm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="max-w-sm w-full bg-slate-950 rounded-2xl border border-amber-500/30 p-6 text-center">
              <h3 className="text-base font-black text-white font-mono uppercase">Ommaviy Amalni Tasdiqlang</h3>
              <p className="text-xs text-slate-400 mt-2 mb-6 font-light">
                {bulkAction === 'delete' ? `${selectedOrders.length} ta buyurtma o'chirilsinmi? Bu amalni ortga qaytarib bo'lmaydi!` :
                 `${selectedOrders.length} ta buyurtma uchun "${bulkAction}" statusi o'rnatilsinmi?`}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowBulkConfirm(false)} className="flex-1 rounded-xl bg-slate-900 border border-slate-800 py-2.5 text-xs text-slate-400 uppercase">Bekor qilish</button>
                <button onClick={handleBulkAction} className="flex-1 rounded-xl bg-amber-500 text-slate-950 font-black py-2.5 text-xs uppercase">Tasdiqlash</button>
              </div>
            </div>
          </div>
        )}

        {/* USER FORM MODAL */}
        {showUserModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="max-w-md w-full bg-slate-950 rounded-2xl border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-black text-white font-mono uppercase">
                  {editingUser ? 'Foydalanuvchini Tahrirlash' : 'Yangi Foydalanuvchi'}
                </h3>
                <button onClick={() => { setShowUserModal(false); setEditingUser(null); setNewUser({ name: '', email: '', role: 'user', password: '' }); }} className="p-2 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Ism</label>
                  <input
                    type="text" required value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none transition"
                    placeholder="Alisher Karimov"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Email</label>
                  <input
                    type="email" required value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none transition"
                    placeholder="alisher@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Parol</label>
                  <input
                    type="password" required value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">Rol</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full rounded-xl border border-slate-900 bg-slate-950 px-3 py-2.5 text-xs text-white focus:border-emerald-500/50 focus:outline-none transition"
                  >
                    <option value="user">Foydalanuvchi</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-emerald-500 text-slate-950 rounded-xl py-2.5 text-xs font-black uppercase tracking-wider hover:bg-emerald-400 transition">
                  {editingUser ? 'Yangilash' : 'Qo\'shish'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* IMAGE PREVIEW MODAL */}
        {imagePreview && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md" onClick={() => setImagePreview(null)}>
            <div className="max-w-4xl w-full rounded-2xl overflow-hidden border border-slate-800">
              <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-[80vh] object-contain" />
            </div>
          </div>
        )}

      {/* DELETE DIALOG MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-sm w-full bg-slate-950 rounded-2xl border border-rose-500/30 p-6 text-center">
            <h3 className="text-base font-black text-white font-mono uppercase">O'chirishni tasdiqlang</h3>
            <p className="text-xs text-slate-400 mt-2 mb-6 font-light">Bu amalni ortga qaytarib bo'lmaydi!</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 rounded-xl bg-slate-900 border border-slate-800 py-2.5 text-xs text-slate-400 uppercase">Bekor qilish</button>
              <button onClick={handleConfirmWipe} className="flex-1 rounded-xl bg-rose-600 text-slate-950 font-black py-2.5 text-xs uppercase">O'chirish</button>
            </div>
          </div>
        </div>
      )}

    {/* NOTIFICATION TOAST */}
    {notification && (
      <div className="fixed bottom-6 right-6 z-[130] flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-2xl max-w-sm">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
          notification.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
          notification.type === 'error' ? 'bg-rose-500/10 text-rose-400' :
          notification.type === 'warning' ? 'bg-amber-500/10 text-amber-400' :
          'bg-blue-500/10 text-blue-400'
        }`}>
          {notification.type === 'success' && <CheckCircle className="h-4 w-4" />}
          {notification.type === 'error' && <XCircle className="h-4 w-4" />}
          {notification.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
          {notification.type === 'info' && <Info className="h-4 w-4" />}
        </div>
        <p className="text-xs text-white font-medium flex-1">{notification.message}</p>
        <button onClick={() => setNotification(null)} className="p-1 rounded hover:bg-slate-800 transition text-slate-400 hover:text-white shrink-0">
          <X className="h-3 w-3" />
        </button>
       </div>
     )}
      </div>
  );
}


