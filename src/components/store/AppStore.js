import { configureStore, createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'unvanish_cart';

const loadCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCart(),
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.find((i) => i.cartId === product.cartId);
      if (existing) {
        existing.qty += product.qty || 1;
      } else {
        state.push({ ...product, qty: product.qty || 1 });
      }
      saveCart(state);
    },
    updateQty: (state, action) => {
      const { cartId, delta } = action.payload;
      const item = state.find((i) => i.cartId === cartId);
      if (item) {
        item.qty = Math.max(1, Math.min(item.stock || 99, item.qty + delta));
      }
      saveCart(state);
    },
    removeItem: (state, action) => {
      const next = state.filter((i) => i.cartId !== action.payload);
      saveCart(next);
      return next;
    },
    removeSelected: (state, action) => {
      const ids = action.payload; // array of cartId
      const next = state.filter((i) => !ids.includes(i.cartId));
      saveCart(next);
      return next;
    },
  },
});

export const { addToCart, updateQty, removeItem, removeSelected } = cartSlice.actions;

const appstore = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});

export default appstore;