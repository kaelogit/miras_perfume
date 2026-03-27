import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase, mapProduct, getEffectivePrice, isFlashSaleActive, formatFlashCountdown } from '../supabase';

const FlashDrops = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setTicker] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    const t = setInterval(() => {
      setTicker((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const fetchFlash = async () => {
      try {
        const { data: rows, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_flash_sale', true)
          .order('created_at', { ascending: false })
          .limit(6);
        if (error) throw error;
        const mapped = (rows || []).map(mapProduct).filter(isFlashSaleActive);
        setItems(mapped);
      } catch (err) {
        console.error('Error fetching flash drops:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlash();
  }, []);

  if (loading) return null;
  if (items.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-red-50/40 border-t border-red-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-red-600 font-bold tracking-widest uppercase text-xs mb-2">Limited Time</p>
          <h2 className="font-serif text-3xl md:text-4xl text-slate-900">Flash Drops</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-8">
          {items.map((product) => (
            <div key={product.id} className="group relative">
              <Link to={`/product/${product.id}`} className="block">
                <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden rounded-sm mb-3">
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest z-10">Flash Drop</span>
                  <img src={product.image} alt={product.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>

                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 truncate">{product.brand}</h3>
                    <h2 className="font-serif text-sm md:text-base text-slate-900 mb-1 leading-tight group-hover:text-brand-DEFAULT transition-colors truncate">{product.name}</h2>
                    {product.soldCount > 0 && (
                      <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">
                        Sold {product.soldCount.toLocaleString()} times
                      </p>
                    )}
                    {product.stock > 0 && product.stock <= 3 && (
                      <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">
                        Only {product.stock} left
                      </p>
                    )}
                    {formatFlashCountdown(product.flashSaleEndsAt) && (
                      <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1">
                        Ends in {formatFlashCountdown(product.flashSaleEndsAt)}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <p className="text-slate-400 line-through text-xs md:text-sm">₦{product.price.toLocaleString()}</p>
                      <p className="text-red-600 font-semibold text-sm md:text-sm">₦{getEffectivePrice(product).toLocaleString()}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product, 1);
                    }}
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
    </section>
  );
};

export default FlashDrops;
