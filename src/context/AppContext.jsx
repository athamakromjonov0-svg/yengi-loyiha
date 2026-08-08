import React, { createContext, useContext, useMemo, useCallback } from 'react';
import useAuth from './hooks/useAuth';
import useProducts from './hooks/useProducts';
import useCart from './hooks/useCart';
import useOrders from './hooks/useOrders';
import useUI from './hooks/useUI';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const ui = useUI();
  const auth = useAuth(ui.showToast);
  const products = useProducts(ui.showToast);
  const cart = useCart(ui.showToast);
  const orders = useOrders(ui.showToast);

  const stats = useMemo(() => {
    const totalProducts = products.products.length;
    const totalCategories = products.categories.length;
    const totalOrders = orders.orders.length;
    const totalRevenue = orders.orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const lowStockProducts = products.products.filter(p => Number(p.stock) < 5).length;
    const discountedProducts = products.products.filter(p => Number(p.discount) > 0).length;
    const newProducts = products.products.filter(p => p.isNew).length;
    const cartCount = cart.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const totalReviews = Object.values(cart.reviews).flat().length;
    return {
      totalProducts,
      totalCategories,
      totalOrders,
      totalRevenue,
      lowStockProducts,
      discountedProducts,
      newProducts,
      cartCount,
      totalReviews,
    };
  }, [products.products, products.categories, orders.orders, cart.cart, cart.reviews]);

  const calculateItemPrice = useCallback((item) => {
    const originalPrice = Number(item.price) || 0;
    const hasDiscount = item.discount && Number(item.discount) > 0;
    return hasDiscount ? originalPrice * (1 - Number(item.discount) / 100) : originalPrice;
  }, []);

  const calculateCartSubtotal = useCallback(() => {
    return cart.cart.reduce((total, item) => total + calculateItemPrice(item) * item.quantity, 0);
  }, [cart.cart, calculateItemPrice]);

  const calculateDeliveryFee = useCallback(() => {
    const subtotal = calculateCartSubtotal();
    const zone = orders.deliveryZones.find(z => z.id === orders.selectedDeliveryZone);
    if (!zone) return 0;
    if (subtotal === 0) return 0;
    if (subtotal >= zone.freeFrom) return 0;
    return zone.price;
  }, [calculateCartSubtotal, orders.deliveryZones, orders.selectedDeliveryZone]);

  const calculateCouponDiscount = useCallback(() => {
    const subtotal = calculateCartSubtotal();
    if (!orders.appliedCoupon) return 0;
    if (subtotal < (orders.appliedCoupon.minSpend || 0)) return 0;
    return subtotal * (Number(orders.appliedCoupon.discount) / 100);
  }, [orders.appliedCoupon, calculateCartSubtotal]);

  const calculateCartTotal = useCallback(() => {
    const subtotal = calculateCartSubtotal();
    const delivery = calculateDeliveryFee();
    const couponDiscount = calculateCouponDiscount();
    return subtotal - couponDiscount + delivery;
  }, [calculateCartSubtotal, calculateDeliveryFee, calculateCouponDiscount]);

  const contextValue = useMemo(() => ({
    ...ui,
    ...auth,
    ...products,
    ...cart,
    ...orders,
    stats,
    calculateItemPrice,
    calculateCartSubtotal,
    calculateDeliveryFee,
    calculateCouponDiscount,
    calculateCartTotal,
  }), [
    ui, auth, products, cart, orders, stats,
    calculateItemPrice, calculateCartSubtotal, calculateDeliveryFee,
    calculateCouponDiscount, calculateCartTotal,
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp albatta AppProvider ichida ishlatilishi shart!");
  return context;
};
