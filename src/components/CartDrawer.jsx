import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, cartTotal } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsCartOpen(false)}
      ></div>

      <div className="relative w-[85vw] max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="font-serif text-xl text-slate-900">Your Bag ({cartItems.length})</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-900 p-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 mb-4">Your bag is empty.</p>
              <Link 
                to="/shop" 
                onClick={() => setIsCartOpen(false)} 
                className="text-brand-DEFAULT underline text-sm font-bold uppercase tracking-widest hover:text-brand-dark transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-20 h-24 bg-slate-50 rounded-sm overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.brand}</h3>
                    <h4 className="font-serif text-slate-900 line-clamp-1">{item.name}</h4>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-slate-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 self-start p-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Subtotal</span>
              <span className="font-serif text-xl text-slate-900">₦{cartTotal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-slate-400 mb-6 text-center">Shipping calculated at checkout.</p>
            <Link 
              to="/checkout" 
              onClick={() => setIsCartOpen(false)} 
              className="block w-full bg-slate-900 text-white py-4 text-center text-sm font-bold uppercase tracking-[0.2em] hover:bg-brand-DEFAULT transition-colors rounded-sm shadow-lg"
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;