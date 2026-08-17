import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';

// Firebase konfiguratsiyasi
// ⚠️ Ushbu ma'lumotlarni Firebase konsolidan olasiz:
// console.firebase.google.com > Loyiha > Project settings > Your apps > SDK setup and configuration
// Firebase konfiguratsiyasi
// Env o'zgaruvchilari (VITE_FIREBASE_*) bo'lmasa — Netlify build'ida ham ishlashi
// uchun quyidagi zaxira (fallback) qiymatlar ishlatiladi.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyB6zuYfDrU0uUVNhUMB6HdLPOpVOQ__P3Q',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'atham-f7bdb.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'atham-f7bdb',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'atham-f7bdb.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '627797278068',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:627797278068:web:b95406f424295ef1068021',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-MBKDEQ8R02',
};

// Firebase ilovasini ishga tushirish
const app = initializeApp(firebaseConfig);

// Authentication modulini olish
export const auth = getAuth(app);

// Google Auth provider
export const googleProvider = new GoogleAuthProvider();

// Google orqali kirish
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
    };
  } catch (error) {
    console.error('Google login xatosi:', error);
    throw error;
  }
};

// Email/parol orqali kirish
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    return {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
    };
  } catch (error) {
    console.error('Email login xatosi:', error);
    throw error;
  }
};

// Yangi admin foydalanuvchi yaratish (birinchi marta kirishda)
export const createAdminUser = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    return {
      uid: user.uid,
      email: user.email,
      name: user.displayName || 'Admin',
      photoURL: user.photoURL || null,
    };
  } catch (error) {
    console.error('Admin user yaratish xatosi:', error);
    throw error;
  }
};

// Tizimdan chiqish
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout xatosi:', error);
    throw error;
  }
};

// Auth holatini kuzatish
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};