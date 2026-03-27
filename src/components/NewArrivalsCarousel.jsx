import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase, mapProduct, getEffectivePrice, isFlashSaleActive } from '../supabase';

const NewArrivalsCarousel = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const { data: rows, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        if (error) throw error;
        setItems((rows || []).map(mapProduct));
      } catch (err) {
        console.error('Error fetching new arrivals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-brand-DEFAULT font-bold tracking-widest uppercase text-xs mb-2">Fresh In</p>
            <h2 className="font-serif text-3xl md:text-4xl text-slate-900">New Arrivals</h2>
          </div>
          <Link to="/shop?filter=new-arrivals" className="text-sm underline text-slate-600 hover:text-slate-900">
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <div className="flex gap-6 min-w-max pb-2">
            {items.map((product) => (
              <div key={product.id} className="w-56 group relative flex-shrink-0">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden rounded-sm mb-3">
                    {isFlashSaleActive(product) && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest z-10">Flash Drop</span>
                    )}
                    <img src={product.image} alt={product.name} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>

                  <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 truncate">{product.brand}</h3>
                  <h4 className="font-serif text-sm text-slate-900 mb-1 truncate">{product.name}</h4>
                  {product.soldCount > 0 && (
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Sold {product.soldCount.toLocaleString()} times</p>
                  )}
                  {product.stock > 0 && product.stock <= 3 && (
                    <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">Only {product.stock} left</p>
                  )}
                  {isFlashSaleActive(product) ? (
                    <div className="flex items-center gap-2">
                      <p className="text-slate-400 line-through text-xs">₦{product.price.toLocaleString()}</p>
                      <p className="text-red-600 font-semibold text-sm">₦{getEffectivePrice(product).toLocaleString()}</p>
                    </div>
                  ) : (
                    <p className="text-slate-700 text-sm">₦{product.price.toLocaleString()}</p>
                  )}
                </Link>

                <button
                  onClick={() => addToCart(product, 1)}
                  className="mt-3 w-full border border-slate-300 py-2 text-[11px] font-bold uppercase tracking-widest text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-colors"
                >
                  Add to Bag
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsCarousel;
