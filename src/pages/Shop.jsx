import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';
  const { addToCart } = useCart(); 

  const productsDB = [
    {
      id: "101",
      brand: "YVES SAINT LAURENT",
      name: "Libre Eau de Parfum",
      price: 145000,
      image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=1000&auto=format&fit=crop",
      isBestSeller: true,
      isNewArrival: false,
      category: "women"
    },
    {
      id: "102",
      brand: "DIOR",
      name: "Sauvage Elixir",
      price: 180000,
      image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1000&auto=format&fit=crop",
      isBestSeller: true,
      isNewArrival: false,
      category: "men"
    },
    {
      id: "103",
      brand: "CREED",
      name: "Aventus",
      price: 450000,
      image: "https://images.unsplash.com/photo-1594035910387-fea4779426e9?q=80&w=1000&auto=format&fit=crop",
      isBestSeller: false,
      isNewArrival: true,
      category: "men"
    },
    {
      id: "104",
      brand: "ARMANI",
      name: "Si Passione",
      price: 120000,
      image: "https://images.unsplash.com/photo-1585120040315-2241b774ad0f?q=80&w=1000&auto=format&fit=crop",
      isBestSeller: false,
      isNewArrival: true,
      category: "women"
    },
    {
      id: "105",
      brand: "TOM FORD",
      name: "Black Orchid",
      price: 210000,
      image: "https://images.unsplash.com/photo-1547887537-6158d64c35e4?q=80&w=1000&auto=format&fit=crop",
      isBestSeller: true,
      isNewArrival: false,
      category: "unisex"
    },
  ];

  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [filteredProducts, setFilteredProducts] = useState(productsDB);

  useEffect(() => {
    let result = productsDB;
    if (activeFilter === 'best-sellers') result = productsDB.filter(p => p.isBestSeller);
    else if (activeFilter === 'new-arrivals') result = productsDB.filter(p => p.isNewArrival);
    else if (activeFilter === 'men') result = productsDB.filter(p => p.category === 'men');
    else if (activeFilter === 'women') result = productsDB.filter(p => p.category === 'women');
    setFilteredProducts(result);
  }, [activeFilter]);

  const handleQuickAdd = (e, product) => {
    e.preventDefault(); 
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - REMOVED RESULTS COUNT */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl text-slate-900 mb-2 capitalize">
            {activeFilter.replace('-', ' ')} Collection
          </h1>
          {/* Subtle line to replace the count */}
          <div className="w-24 h-1 bg-brand-DEFAULT mx-auto mt-6"></div>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          
          {/* SIDEBAR */}
          <div className="w-full md:w-64 space-y-8 hidden md:block">
            <div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-slate-900 mb-4">Collections</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className={`cursor-pointer hover:text-brand-DEFAULT ${activeFilter === 'all' ? 'text-brand-DEFAULT font-bold' : ''}`} onClick={() => setActiveFilter('all')}>View All</li>
                <li className={`cursor-pointer hover:text-brand-DEFAULT ${activeFilter === 'best-sellers' ? 'text-brand-DEFAULT font-bold' : ''}`} onClick={() => setActiveFilter('best-sellers')}>Best Sellers</li>
                <li className={`cursor-pointer hover:text-brand-DEFAULT ${activeFilter === 'new-arrivals' ? 'text-brand-DEFAULT font-bold' : ''}`} onClick={() => setActiveFilter('new-arrivals')}>New Arrivals</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-widest text-slate-900 mb-4">Category</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="cursor-pointer hover:text-brand-DEFAULT" onClick={() => setActiveFilter('women')}>Women's Perfume</li>
                <li className="cursor-pointer hover:text-brand-DEFAULT" onClick={() => setActiveFilter('men')}>Men's Cologne</li>
                <li className="cursor-pointer hover:text-brand-DEFAULT" onClick={() => setActiveFilter('unisex')}>Unisex / Niche</li>
              </ul>
            </div>
          </div>

          {/* GRID */}
          <div className="flex-1">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group relative">
                  
                  <Link to={`/product/${product.id}`} className="block">
                    {/* Image */}
                    <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden rounded-sm mb-3">
                      {product.isBestSeller && (
                        <span className="absolute top-2 left-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest z-10">Best Seller</span>
                      )}
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>

                    {/* NEW LAYOUT: Info Left, Button Right */}
                    <div className="flex justify-between items-start gap-3">
                        
                        <div className="flex-1 min-w-0">
                            <h3 className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 truncate">
                                {product.brand}
                            </h3>
                            <h2 className="font-serif text-sm md:text-base text-slate-900 mb-1 leading-tight group-hover:text-brand-DEFAULT transition-colors truncate">
                                {product.name}
                            </h2>
                            <p className="text-slate-600 font-light text-sm md:text-sm">
                                ₦{product.price.toLocaleString()}
                            </p>
                        </div>

                        {/* Quick Add Button */}
                        <button 
                            onClick={(e) => handleQuickAdd(e, product)}
                            className="w-8 h-8 md:w-10 md:h-10 border border-slate-200 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-900 hover:border-slate-900 hover:text-white transition-all flex-shrink-0"
                            title="Add to Bag"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 01-8 0"></path><line x1="12" y1="13" x2="12" y2="17"></line><line x1="10" y1="15" x2="14" y2="15"></line></svg>
                        </button>
                    </div>
                  </Link>

                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Shop;