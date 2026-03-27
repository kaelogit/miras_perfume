import React, { createContext, useContext, useState, useEffect } from 'react';
import { getEffectivePrice } from '../supabase';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState(null); 

  useEffect(() => {
    const savedCart = localStorage.getItem('miras-cart');
    if (savedCart) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate cart from localStorage
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('miras-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    
    setNotification(`${quantity}x ${product.name} Added`);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('miras-cart'); 
  };

  const clearNotification = () => setNotification(null);

  const cartTotal = cartItems.reduce((total, item) => total + (getEffectivePrice(item) * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      cartTotal, 
      cartCount,
      isCartOpen, 
      setIsCartOpen,
      notification,       
      clearNotification
    }}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components -- useCart is a valid hook export
export const useCart = () => useContext(CartContext);