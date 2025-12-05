import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Checkout = () => {
  const { cartItems, cartTotal } = useCart();
  
  // FORM STATE
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: 'Ogun', // Default to Owner's Location
  });

  // FULL NIGERIAN STATES LIST (Ogun First)
  const states = [
    "Ogun", "Lagos", "Abuja (FCT)", "Rivers", "Abia", "Adamawa", "Akwa Ibom", "Anambra", 
    "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", 
    "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", 
    "Kebbi", "Kogi", "Kwara", "Nasarawa", "Niger", "Ondo", "Osun", "Oyo", 
    "Plateau", "Sokoto", "Taraba", "Yobe", "Zamfara"
  ];

  // SHIPPING IS NOT CALCULATED HERE ANYMORE
  const finalTotal = cartTotal; 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Processing Payment of ₦${finalTotal.toLocaleString()} via Paystack...`);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
        <h2 className="font-serif text-2xl text-slate-900 mb-4">Your bag is empty</h2>
        <Link to="/shop" className="text-brand-DEFAULT underline uppercase tracking-widest text-sm font-bold">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* LEFT COLUMN: FORM */}
          <div className="order-2 lg:order-1">
            
            {/* Breadcrumbs */}
            <div className="flex items-center text-xs text-slate-500 mb-6 overflow-x-auto whitespace-nowrap">
              <Link to="/shop" className="hover:text-brand-DEFAULT">Shop</Link>
              <span className="mx-2">/</span>
              <span className="text-slate-900 font-medium">Information</span>
              <span className="mx-2">/</span>
              <span>Shipping</span>
              <span className="mx-2">/</span>
              <span>Payment</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* 1. CONTACT INFO (Phone moved here) */}
              <div>
                <h3 className="text-lg font-serif mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Email address" 
                    className="w-full border border-slate-300 rounded-sm px-4 py-3 focus:outline-none focus:border-brand-DEFAULT transition-colors"
                    required
                  />
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="Phone number" 
                    className="w-full border border-slate-300 rounded-sm px-4 py-3 focus:outline-none focus:border-brand-DEFAULT transition-colors"
                    required
                  />
                </div>
              </div>

              {/* 2. SHIPPING ADDRESS */}
              <div>
                <h3 className="text-lg font-serif mb-4">Shipping Address</h3>
                
                {/* Delivery Notice Box */}
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-sm mb-6 flex gap-3">
                  <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-bold mb-1">Important Delivery Info:</p>
                    <p className="leading-relaxed text-blue-700/80">
                      Standard delivery takes <strong>1 to 3 business days</strong>. 
                      Shipping fees are not included now; they will be discussed and paid directly to the dispatcher upon delivery.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input type="text" name="firstName" placeholder="First name" className="w-full border border-slate-300 rounded-sm px-4 py-3 focus:outline-none focus:border-brand-DEFAULT" required />
                  <input type="text" name="lastName" placeholder="Last name" className="w-full border border-slate-300 rounded-sm px-4 py-3 focus:outline-none focus:border-brand-DEFAULT" required />
                </div>
                
                <input type="text" name="address" placeholder="Address" className="w-full border border-slate-300 rounded-sm px-4 py-3 mb-4 focus:outline-none focus:border-brand-DEFAULT" required />
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <input type="text" name="city" placeholder="City" className="w-full border border-slate-300 rounded-sm px-4 py-3 focus:outline-none focus:border-brand-DEFAULT" required />
                  
                  {/* State Dropdown (All States + Ogun Top) */}
                  <select 
                    name="state" 
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full border border-slate-300 rounded-sm px-4 py-3 focus:outline-none focus:border-brand-DEFAULT bg-white"
                  >
                    {states.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. PAYMENT (Removed Bank Transfer) */}
              <div>
                <h3 className="text-lg font-serif mb-4">Payment Method</h3>
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-sm">
                  <p className="text-sm text-slate-500 mb-4">All transactions are secure and encrypted.</p>
                  
                  {/* Single Option: Paystack */}
                  <div className="border border-brand-DEFAULT bg-brand-light/20 text-brand-DEFAULT px-4 py-3 text-sm font-bold rounded-sm text-center flex items-center justify-center gap-2 cursor-pointer">
                     <span>Pay Securely with Paystack</span>
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                </div>
              </div>

              <button className="w-full bg-slate-900 text-white py-5 text-sm font-bold uppercase tracking-[0.2em] hover:bg-brand-DEFAULT transition-colors duration-300 rounded-sm shadow-lg">
                Pay ₦{finalTotal.toLocaleString()} Now
              </button>
              <p className="text-xs text-center text-slate-400">Shipping fee payable on delivery.</p>

            </form>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY */}
          <div className="order-1 lg:order-2 bg-slate-50 p-6 md:p-8 lg:p-12 rounded-sm h-fit mb-8 lg:mb-0">
            <h3 className="font-serif text-xl mb-6">Order Summary</h3>
            
            <div className="space-y-6 mb-8 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-20 bg-white border border-slate-200 rounded-sm overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-2 -right-2 bg-slate-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif text-sm text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">{item.brand}</p>
                  </div>
                  <p className="text-sm font-medium text-slate-900">₦{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-6 space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>₦{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Shipping</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pay on Delivery</span>
              </div>
            </div>

            <div className="border-t border-slate-200 mt-6 pt-6">
              <div className="flex justify-between items-center">
                <span className="font-serif text-lg text-slate-900">Total</span>
                <div className="text-right">
                  <span className="font-serif text-2xl text-slate-900 block">₦{finalTotal.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide">+ Delivery Fee</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;