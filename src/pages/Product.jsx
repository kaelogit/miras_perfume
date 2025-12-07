import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Product = () => {
  const { id } = useParams(); 
  const { addToCart } = useCart();
  
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(false);
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
          setActiveImage(0); 
          setQuantity(1);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-DEFAULT"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <h2 className="font-serif text-2xl text-slate-900 mb-4">Product Not Found</h2>
        <Link to="/shop" className="bg-slate-900 text-white px-8 py-3 text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-brand-DEFAULT transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const notes = product.notes || [];
  
  const currentStock = product.stock || 0;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock < 5;

  const handleIncreaseQty = () => {
    if (quantity < currentStock) setQuantity(q => q + 1);
  };

  const handleDecreaseQty = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            
            {images.length > 1 && (
              <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 hide-scrollbar">
                {images.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 border rounded-sm overflow-hidden transition-all duration-300 ${
                      activeImage === index ? "border-brand-DEFAULT opacity-100" : "border-slate-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 relative bg-slate-50 rounded-sm overflow-hidden shadow-sm h-[400px] lg:h-[500px] flex items-center justify-center p-8">
              <img 
                src={images[activeImage]} 
                alt={product.name} 
                className="w-auto h-full max-h-full object-contain transition-transform duration-500 hover:scale-105 mix-blend-multiply" 
              />
              
              {isOutOfStock && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <span className="bg-slate-900 text-white px-6 py-2 text-sm font-bold uppercase tracking-widest">Out of Stock</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8 lg:pt-4">
            
            <div>
              <h3 className="text-brand-DEFAULT font-bold tracking-widest uppercase text-xs mb-2">
                {product.brand}
              </h3>
              <h1 className="font-serif text-3xl md:text-4xl text-slate-900 mb-4 leading-tight">
                {product.name}
              </h1>
              <p className="text-2xl font-light text-slate-800">
                ₦{product.price?.toLocaleString()}
              </p>
            </div>

            <div className="prose prose-slate text-slate-600 font-light leading-relaxed text-sm md:text-base">
              <p>{product.description}</p>
            </div>

            <div className="border-t border-b border-slate-100 py-8 space-y-6">
              
              <div className="flex items-center gap-6">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-900">Quantity</span>
                <div className="flex items-center border border-slate-300 rounded-sm">
                  <button onClick={handleDecreaseQty} disabled={isOutOfStock} className="px-4 py-2 hover:bg-slate-50 text-slate-600 disabled:opacity-50">-</button>
                  <span className="px-4 py-2 font-medium text-slate-900 w-12 text-center">{quantity}</span>
                  <button onClick={handleIncreaseQty} disabled={isOutOfStock || quantity >= currentStock} className="px-4 py-2 hover:bg-slate-50 text-slate-600 disabled:opacity-50">+</button>
                </div>
                {isLowStock && (
                  <span className="text-xs text-orange-600 font-bold uppercase tracking-wide animate-pulse">
                    Only {currentStock} Left!
                  </span>
                )}
              </div>

              <button 
                onClick={() => addToCart(product, quantity)}
                disabled={isOutOfStock}
                className={`w-full py-4 text-white text-sm font-bold uppercase tracking-[0.2em] transition-colors duration-300 shadow-lg rounded-sm ${
                  isOutOfStock 
                    ? 'bg-slate-300 cursor-not-allowed' 
                    : 'bg-slate-900 hover:bg-brand-DEFAULT'
                }`}
              >
                {isOutOfStock ? "Out of Stock" : `Add to Cart — ₦${(product.price * quantity).toLocaleString()}`}
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-500 pt-2">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path></svg>
                  100% Authentic Guaranteed
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-DEFAULT" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Same-Day Delivery
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {notes.length > 0 && (
                <details className="group border-b border-slate-100 pb-4 cursor-pointer" open>
                  <summary className="flex justify-between items-center font-medium text-slate-900 list-none">
                    <span>Fragrance Notes</span>
                    <span className="transition group-open:rotate-180"><svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg></span>
                  </summary>
                  <div className="text-slate-500 text-sm mt-4 leading-relaxed">
                    <ul className="flex flex-wrap gap-2">
                      {notes.map((note, i) => (
                        <li key={i} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs">{note}</li>
                      ))}
                    </ul>
                  </div>
                </details>
              )}
              
              <details className="group border-b border-slate-100 pb-4 cursor-pointer">
                <summary className="flex justify-between items-center font-medium text-slate-900 list-none">
                  <span>Delivery & Returns</span>
                  <span className="transition group-open:rotate-180"><svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg></span>
                </summary>
                <div className="text-slate-500 text-sm mt-4 leading-relaxed">
                  We offer same-day delivery for orders placed before 12 PM in Ogun State. Nationwide delivery takes 1-3 working days. Returns are accepted within 12 hours if the seal is unbroken.
                </div>
              </details>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;