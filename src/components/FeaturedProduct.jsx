import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const FeaturedProduct = () => {
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchRandomProduct = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        if (productsList.length > 0) {
          const randomIndex = Math.floor(Math.random() * productsList.length);
          setProduct(productsList[randomIndex]);
        }
      } catch (error) {
        console.error("Error fetching featured product:", error);
      }
    };

    fetchRandomProduct();
  }, []);

  if (!product) return null;

  return (
    <section className="bg-brand-light/20 py-12 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
          
          <div className="w-full lg:w-1/2 relative">
            <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-white rounded-full blur-3xl opacity-50 z-0"></div>
            
            <Link to={`/product/${product.id}`}>
              <img 
                src={product.image} 
                alt={product.name} 
                className="relative z-10 w-[70%] lg:w-full max-w-sm mx-auto rounded-lg shadow-xl transform hover:-translate-y-2 transition-transform duration-500 cursor-pointer object-contain bg-white/50"
              />
            </Link>
          </div>

          <div className="w-full lg:w-1/2 text-center lg:text-left">
            
            <div className="mb-3">
                <span className="text-brand-DEFAULT font-bold tracking-widest uppercase text-[10px] md:text-xs block mb-1">
                    Trending Now
                </span>
                <h3 className="text-slate-500 text-sm md:text-lg uppercase tracking-wide font-medium">
                    {product.brand}
                </h3>
            </div>
            
            <Link to={`/product/${product.id}`}>
              <h2 className="font-serif text-3xl md:text-5xl text-slate-900 leading-none mb-4 hover:text-brand-DEFAULT transition-colors">
                {product.name}
              </h2>
            </Link>

            <p className="text-slate-600 font-light text-sm md:text-lg leading-relaxed max-w-md mx-auto lg:mx-0 mb-6 line-clamp-3">
              {product.description}
            </p>

            {product.notes && (
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                  {product.notes.slice(0, 3).map((note, index) => (
                    <span key={index} className="px-3 py-1 bg-white border border-brand-light text-slate-600 text-xs rounded-full shadow-sm">
                      {note}
                    </span>
                  ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <p className="font-serif text-2xl md:text-3xl text-slate-800">₦{product.price.toLocaleString()}</p>
              <button 
                onClick={() => addToCart(product, 1)}
                className="px-8 py-3 bg-slate-900 text-white text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-brand-DEFAULT transition-colors duration-300 rounded-sm shadow-lg"
              >
                Add to Cart
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;