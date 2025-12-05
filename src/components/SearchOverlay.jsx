import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // 1. SEARCH DATABASE (Combine all your mock data here for now)
  const allProducts = [
    { id: "101", brand: "YVES SAINT LAURENT", name: "Libre Eau de Parfum", price: 145000, image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=200&auto=format&fit=crop" },
    { id: "102", brand: "DIOR", name: "Sauvage Elixir", price: 180000, image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=200&auto=format&fit=crop" },
    { id: "103", brand: "CREED", name: "Aventus", price: 450000, image: "https://images.unsplash.com/photo-1594035910387-fea4779426e9?q=80&w=200&auto=format&fit=crop" },
    { id: "104", brand: "ARMANI", name: "Si Passione", price: 120000, image: "https://images.unsplash.com/photo-1585120040315-2241b774ad0f?q=80&w=200&auto=format&fit=crop" },
    { id: "105", brand: "TOM FORD", name: "Black Orchid", price: 210000, image: "https://images.unsplash.com/photo-1547887537-6158d64c35e4?q=80&w=200&auto=format&fit=crop" },
    // Add dummy Lattafa for testing
    { id: "106", brand: "LATTAFA", name: "Oud Mood", price: 25000, image: "https://images.unsplash.com/photo-1547887537-6158d64c35e4?q=80&w=200&auto=format&fit=crop" },
  ];

  // 2. LIVE FILTER LOGIC
  useEffect(() => {
    if (query.length > 1) {
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.brand.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  // Don't render if closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-xl animate-fade-in">
      
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <div className="max-w-3xl mx-auto px-4 pt-32">
        
        {/* Search Input */}
        <div className="relative border-b-2 border-slate-200 focus-within:border-slate-900 transition-colors">
          <input 
            type="text" 
            placeholder="Search for a scent or brand..." 
            className="w-full text-2xl md:text-4xl font-serif bg-transparent py-4 outline-none text-slate-900 placeholder-slate-300"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <svg className="w-8 h-8 text-slate-300 absolute right-0 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        {/* Results Grid */}
        <div className="mt-12 overflow-y-auto max-h-[60vh]">
          
          {query.length > 1 && results.length === 0 && (
            <p className="text-slate-500 text-center">No results found for "{query}"</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {results.map(product => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                onClick={onClose} // Close overlay when clicked
                className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-sm transition-colors group"
              >
                <div className="w-16 h-20 bg-slate-100 overflow-hidden flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-slate-900 group-hover:text-brand-DEFAULT transition-colors">{product.name}</h4>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{product.brand}</p>
                  <p className="text-sm text-slate-800 mt-1">₦{product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Suggested Links (Only show when no query) */}
          {query.length === 0 && (
            <div className="mt-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Trending Searches</h3>
              <div className="flex flex-wrap gap-3">
                {['Lattafa', 'Creed', 'Vanilla', 'Oud', 'Dior Sauvage'].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-4 py-2 border border-slate-200 rounded-full text-sm text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;