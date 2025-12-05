import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Mobile: 2 Columns. Desktop: 4 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-8">
          
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="font-serif text-2xl tracking-widest mb-4 font-semibold">MIRA'S</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-4 max-w-xs">
              Your premier destination for authentic luxury fragrances. Based in Ogun State, delivering happiness nationwide.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-brand-DEFAULT transition">Instagram</a>
              <a href="#" className="text-slate-400 hover:text-brand-DEFAULT transition">WhatsApp</a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Shop</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/shop?filter=new-arrivals" className="hover:text-brand-DEFAULT transition">New Arrivals</Link></li>
              <li><Link to="/shop?filter=best-sellers" className="hover:text-brand-DEFAULT transition">Best Sellers</Link></li>
              <li><Link to="/shop?filter=men" className="hover:text-brand-DEFAULT transition">Men's Cologne</Link></li>
              <li><Link to="/shop?filter=women" className="hover:text-brand-DEFAULT transition">Women's Perfume</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Support</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link to="/track" className="hover:text-brand-DEFAULT transition">Track Order</Link></li>
              <li><Link to="/shipping" className="hover:text-brand-DEFAULT transition">Shipping Policy</Link></li>
              <li><Link to="/contact" className="hover:text-brand-DEFAULT transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-4">Join the List</h3>
            <p className="text-slate-400 text-sm mb-3">Be the first to know about new stock.</p>
            <form className="flex flex-col space-y-2">
              <input type="email" placeholder="Enter your email" className="bg-slate-800 text-white px-4 py-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-brand-DEFAULT text-sm" />
              <button className="bg-brand-DEFAULT text-white px-4 py-3 text-sm font-medium uppercase tracking-widest hover:bg-brand-dark transition rounded-sm">
                Subscribe
              </button>
            </form>
          </div>

        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4 md:gap-0 text-center">
          <p>&copy; 2025 Mira's Perfume. Ogun State, Nigeria.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;