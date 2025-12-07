import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAllProducts(list);
      } catch (error) {
        console.error("Error fetching products for search:", error);
      }
    };

    if (isOpen && allProducts.length === 0) {
      fetchProducts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length > 1) {
      const lowerQuery = query.toLowerCase();
      const filtered = allProducts.filter(p => 
        (p.name && p.name.toLowerCase().includes(lowerQuery)) || 
        (p.brand && p.brand.toLowerCase().includes(lowerQuery)) ||
        (p.scentFamily && p.scentFamily.toLowerCase().includes(lowerQuery))
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, allProducts]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white/98 backdrop-blur-xl animate-fade-in">
      
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <div className="max-w-3xl mx-auto px-4 pt-32">
        
        <div className="relative border-b-2 border-slate-200 focus-within:border-slate-900 transition-colors">
          <input 
            type="text" 
            placeholder="Search by Brand, Scent, or Name..." 
            className="w-full text-2xl md:text-4xl font-serif bg-transparent py-4 outline-none text-slate-900 placeholder-slate-300"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400">
             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        <div className="mt-12 overflow-y-auto max-h-[60vh] custom-scrollbar">
          
          {query.length > 1 && results.length === 0 && (
            <div className="text-center py-10">
                <p className="text-slate-500 text-lg">No results found for "{query}"</p>
                <p className="text-slate-400 text-sm mt-2">Try searching for "Oud", "Tom Ford", or "Floral"</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map(product => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                onClick={onClose}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-sm transition-colors group border border-transparent hover:border-slate-100"
              >
                <div className="w-16 h-20 bg-slate-100 overflow-hidden flex-shrink-0 rounded-sm">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-slate-900 group-hover:text-brand-DEFAULT transition-colors line-clamp-1">{product.name}</h4>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{product.brand}</p>
                  <p className="text-sm text-slate-800 mt-1">₦{product.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>

          {query.length === 0 && (
            <div className="mt-8">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Trending Searches</h3>
              <div className="flex flex-wrap gap-3">
                {['Lattafa', 'Tom Ford', 'Oud', 'Vanilla', 'Creed'].map(tag => (
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