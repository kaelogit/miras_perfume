import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SearchOverlay from './SearchOverlay';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { cartCount, setIsCartOpen } = useCart();

  const closeAll = () => {
    setIsMobileMenuOpen(false);
    setIsShopDropdownOpen(false);
  };

  // CORRECTED LINKS: Using '?type=' for categories so filtering works
  const collections = [
    { name: "Arabian / Oud", link: "/shop?type=arabian" },
    { name: "Designer / Western", link: "/shop?type=designer" },
    { name: "Niche / Exclusive", link: "/shop?type=niche" },
    { name: "Men's Cologne", link: "/shop?filter=men" },
    { name: "Women's Perfume", link: "/shop?filter=women" },
    { name: "Unisex", link: "/shop?filter=unisex" },
  ];

  const scentFamilies = [
    { name: "Woody & Intense", link: "/shop?scent=woody" },
    { name: "Fresh & Citrus", link: "/shop?scent=fresh" },
    { name: "Floral & Sweet", link: "/shop?scent=floral" },
    { name: "Warm & Spicy", link: "/shop?scent=oriental" },
    { name: "Vanilla / Gourmand", link: "/shop?scent=gourmand" },
  ];

  return (
    <>
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            <div className="flex items-center md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-800 hover:text-brand-DEFAULT focus:outline-none p-2">
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>

            <div className="flex-shrink-0 flex items-center justify-center flex-1 md:flex-none">
              <Link to="/" onClick={closeAll}>
                <img src="/images/categories/logo.jpg" alt="Mira's" className="h-10 md:h-14 w-auto object-contain" />
              </Link>
            </div>

            <div className="hidden md:flex space-x-12 items-center h-full">
              <div className="relative group h-full flex items-center">
                <Link to="/shop" className={`text-xs font-medium tracking-[0.15em] uppercase transition-colors duration-300 flex items-center gap-1 py-8 ${location.pathname.includes('/shop') ? 'text-brand-DEFAULT font-bold' : 'text-slate-500 hover:text-brand-DEFAULT'}`}>
                  Shop
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path></svg>
                </Link>

                <div className="absolute top-full -left-10 w-[600px] bg-white border border-slate-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 p-8 grid grid-cols-2 gap-8 rounded-sm">
                  <div>
                    <h3 className="text-xs font-bold text-brand-DEFAULT uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">By Category</h3>
                    <ul className="space-y-3">
                      {collections.map((item, idx) => (
                        <li key={idx}><Link to={item.link} className="text-sm text-slate-600 hover:text-brand-DEFAULT transition-colors block">{item.name}</Link></li>
                      ))}
                      <li className="pt-2"><Link to="/shop" className="text-xs font-bold uppercase text-slate-900 underline hover:text-brand-DEFAULT">View All Products</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-brand-DEFAULT uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">By Scent Family</h3>
                    <ul className="space-y-3">
                      {scentFamilies.map((item, idx) => (
                        <li key={idx}><Link to={item.link} className="text-sm text-slate-600 hover:text-brand-DEFAULT transition-colors block">{item.name}</Link></li>
                      ))}
                      <li className="pt-2"><Link to="/brands" className="text-xs font-bold uppercase text-slate-900 underline hover:text-brand-DEFAULT">View All Brands</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
              <Link to="/shop?filter=new-arrivals" className="text-slate-500 hover:text-brand-DEFAULT text-xs font-medium tracking-[0.15em] uppercase transition-colors">New Arrivals</Link>
              <Link to="/brands" className="text-slate-500 hover:text-brand-DEFAULT text-xs font-medium tracking-[0.15em] uppercase transition-colors">Brands</Link>
              <Link to="/track" className="text-slate-500 hover:text-brand-DEFAULT text-xs font-medium tracking-[0.15em] uppercase transition-colors">Track Order</Link>
            </div>

            <div className="flex items-center space-x-6">
               <button onClick={() => setIsSearchOpen(true)} className="text-slate-800 hover:text-brand-DEFAULT transition"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></button>
               <button onClick={() => setIsCartOpen(true)} className="text-slate-800 hover:text-brand-DEFAULT transition relative p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 01-8 0"></path></svg>
                  {cartCount > 0 && <span className="absolute -top-1 -right-2 bg-brand-DEFAULT text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">{cartCount}</span>}
               </button>
            </div>
          </div>
        </div>

        <div className={`md:hidden bg-white border-t border-slate-100 overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-[80vh] opacity-100 overflow-y-auto" : "max-h-0 opacity-0"}`}>
          <div className="px-6 py-6 space-y-6">
            <div>
              <button onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)} className="flex items-center justify-between w-full text-slate-800 font-medium uppercase tracking-widest text-sm">
                Shop
                <svg className={`w-4 h-4 transition-transform ${isShopDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <div className={`mt-4 space-y-6 pl-4 border-l border-slate-100 ${isShopDropdownOpen ? 'block' : 'hidden'}`}>
                  
                  <Link to="/shop" onClick={closeAll} className="block text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 underline">View All Products</Link>

                  <div>
                      <h4 className="text-xs font-bold text-brand-DEFAULT uppercase mb-3">Collections</h4>
                      <ul className="space-y-3">
                          {collections.map((item, idx) => (
                              <li key={idx}><Link to={item.link} onClick={closeAll} className="text-sm text-slate-500 block">{item.name}</Link></li>
                          ))}
                      </ul>
                  </div>
                  <div>
                      <h4 className="text-xs font-bold text-brand-DEFAULT uppercase mb-3">Scent Profile</h4>
                      <ul className="space-y-3">
                          {scentFamilies.map((item, idx) => (
                              <li key={idx}><Link to={item.link} onClick={closeAll} className="text-sm text-slate-500 block">{item.name}</Link></li>
                          ))}
                          <li className="pt-2 border-t border-slate-50 mt-2"><Link to="/brands" onClick={closeAll} className="text-xs font-bold uppercase text-slate-900 underline block">View All Brands</Link></li>
                      </ul>
                  </div>
              </div>
            </div>
            <Link to="/shop?filter=new-arrivals" onClick={closeAll} className="block text-slate-800 font-medium uppercase tracking-widest text-sm">New Arrivals</Link>
            <Link to="/brands" onClick={closeAll} className="block text-slate-800 font-medium uppercase tracking-widest text-sm">All Brands</Link>
            <Link to="/track" onClick={closeAll} className="block text-slate-800 font-medium uppercase tracking-widest text-sm">Track Order</Link>
          </div>
        </div>
      </nav>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;