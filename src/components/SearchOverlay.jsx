import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Fuse from 'fuse.js';
import { Link } from 'react-router-dom';
import { supabase, mapProduct, getEffectivePrice, isFlashSaleActive } from '../supabase';

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [activeChip, setActiveChip] = useState({ type: 'all', value: 'all' });

  const fuse = useMemo(() => {
    return new Fuse(allProducts, {
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 2,
      keys: [
        { name: 'name', weight: 0.45 },
        { name: 'brand', weight: 0.35 },
        { name: 'scentFamily', weight: 0.15 },
        { name: 'notes', weight: 0.05 },
      ],
    });
  }, [allProducts]);

  const chipOptions = useMemo(() => {
    const collections = [...new Set(allProducts.map((p) => p.collectionType).filter(Boolean))].slice(0, 5);
    const scents = [...new Set(allProducts.map((p) => p.scentFamily).filter(Boolean))].slice(0, 5);
    const brands = [...new Set(allProducts.map((p) => p.brand).filter(Boolean))].slice(0, 6);
    return { collections, scents, brands };
  }, [allProducts]);

  const matchChip = useCallback((product) => {
    if (activeChip.type === 'all') return true;
    if (activeChip.type === 'flash') return isFlashSaleActive(product);
    if (activeChip.type === 'collection') return product.collectionType === activeChip.value;
    if (activeChip.type === 'scent') return product.scentFamily === activeChip.value;
    if (activeChip.type === 'brand') return product.brand === activeChip.value;
    return true;
  }, [activeChip]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data: rows, error } = await supabase.from('products').select('*');
        if (error) throw error;
        setAllProducts((rows || []).map(mapProduct));
      } catch (error) {
        console.error("Error fetching products for search:", error);
      }
    };

    if (isOpen && allProducts.length === 0) {
      fetchProducts();
    }
  }, [isOpen, allProducts.length]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) {
      if (activeChip.type === 'all') {
        setResults([]);
      } else {
        setResults(allProducts.filter(matchChip));
      }
      return;
    }

    if (q.length > 0) {
      const exact = allProducts.filter((p) =>
        [p.name, p.brand, p.scentFamily].some((v) => (v || '').toLowerCase() === q)
      );
      const prefix = allProducts.filter((p) =>
        [p.name, p.brand, p.scentFamily].some((v) => (v || '').toLowerCase().startsWith(q))
      );
      const includes = allProducts.filter((p) =>
        [p.name, p.brand, p.scentFamily].some((v) => (v || '').toLowerCase().includes(q))
      );
      const fuzzy = fuse.search(q).map((r) => r.item);

      const merged = [];
      const seen = new Set();
      [exact, prefix, includes, fuzzy].forEach((group) => {
        group.forEach((item) => {
          if (!seen.has(item.id)) {
            seen.add(item.id);
            merged.push(item);
          }
        });
      });

      setResults(merged.filter(matchChip));
    } else {
      setResults([]);
    }
  }, [query, allProducts, fuse, matchChip, activeChip.type]);

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
            placeholder="Search by Brand, Scent, or Name (typos allowed)..." 
            className="w-full text-2xl md:text-4xl font-serif bg-transparent py-4 outline-none text-slate-900 placeholder-slate-300"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400">
             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveChip({ type: 'all', value: 'all' })}
              className={`px-3 py-1 rounded-full text-xs border ${activeChip.type === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-300 text-slate-600'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveChip({ type: 'flash', value: 'flash' })}
              className={`px-3 py-1 rounded-full text-xs border ${activeChip.type === 'flash' ? 'bg-red-600 text-white border-red-600' : 'border-red-300 text-red-600'}`}
            >
              Flash Drop
            </button>
            {chipOptions.collections.map((c) => (
              <button
                key={`collection-${c}`}
                onClick={() => setActiveChip({ type: 'collection', value: c })}
                className={`px-3 py-1 rounded-full text-xs border ${activeChip.type === 'collection' && activeChip.value === c ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-300 text-slate-600'}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {chipOptions.scents.map((s) => (
              <button
                key={`scent-${s}`}
                onClick={() => setActiveChip({ type: 'scent', value: s })}
                className={`px-3 py-1 rounded-full text-xs border ${activeChip.type === 'scent' && activeChip.value === s ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-300 text-slate-600'}`}
              >
                {s}
              </button>
            ))}
            {chipOptions.brands.map((b) => (
              <button
                key={`brand-${b}`}
                onClick={() => setActiveChip({ type: 'brand', value: b })}
                className={`px-3 py-1 rounded-full text-xs border ${activeChip.type === 'brand' && activeChip.value === b ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-300 text-slate-600'}`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 overflow-y-auto max-h-[60vh] custom-scrollbar">
          
          {query.length > 0 && results.length === 0 && (
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
                  <img src={product.image} alt={product.name} loading="lazy" decoding="async" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-slate-900 group-hover:text-brand-DEFAULT transition-colors line-clamp-1">{product.name}</h4>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{product.brand}</p>
                  {isFlashSaleActive(product) ? (
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-slate-400 line-through">₦{product.price.toLocaleString()}</p>
                      <p className="text-sm text-red-600 font-semibold">₦{getEffectivePrice(product).toLocaleString()}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-800 mt-1">₦{product.price.toLocaleString()}</p>
                  )}
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