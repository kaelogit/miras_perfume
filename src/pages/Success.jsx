import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-sm shadow-sm text-center border border-slate-100">
        
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-serif text-3xl text-slate-900 mb-2">Order Confirmed!</h1>
        <p className="text-slate-500 mb-8 font-light">
          Thank you for shopping with Mira's. Your order has been received and is being processed. We will reach out to you shortly.
        </p>

        <div className="space-y-3">
          <Link 
            to="/shop" 
            className="block w-full bg-slate-900 text-white py-4 text-sm font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-brand-DEFAULT transition-colors"
          >
            Continue Shopping
          </Link>
          <Link 
            to="/" 
            className="block w-full text-slate-500 py-4 text-xs font-bold uppercase tracking-[0.1em] hover:text-slate-900"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Success;