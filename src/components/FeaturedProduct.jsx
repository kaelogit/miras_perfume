import React, { useState, useEffect } from 'react';

const FeaturedProduct = () => {
  const [product, setProduct] = useState(null);

  const productsDB = [
    {
      id: 101, brand: "YVES SAINT LAURENT", name: "Libre Eau de Parfum", tagline: "Trending Now", price: "₦145,000",
      description: "The floral perfume of a strong, bold, and free woman. A statement piece featuring lavender essence and orange blossom.",
      notes: ["Lavender", "Orange Blossom", "Musk"],
      image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=2535&auto=format&fit=crop" 
    },
    // ... (other products remain same)
  ];

  useEffect(() => {
    // Only pick one if we haven't already (simple randomizer)
    if (!product) {
       setProduct(productsDB[0]); // Default to YSL for consistent look in this fix
    }
  }, []);

  if (!product) return null;

  return (
    // Reduced padding
    <section className="bg-brand-light/20 py-12 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
          
          {/* Image Side */}
          <div className="w-full lg:w-1/2 relative">
            {/* Hidden blur circle on mobile to save visual noise */}
            <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-white rounded-full blur-3xl opacity-50 z-0"></div>
            
            {/* Smaller image on mobile */}
            <img 
              src={product.image} 
              alt={product.name} 
              className="relative z-10 w-[70%] lg:w-full max-w-sm mx-auto rounded-lg shadow-xl transform hover:-translate-y-2 transition-transform duration-500"
            />
          </div>

          {/* Details Side - Tighter spacing */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            
            <div className="mb-3">
                <span className="text-brand-DEFAULT font-bold tracking-widest uppercase text-[10px] md:text-xs block mb-1">
                    {product.tagline}
                </span>
                <h3 className="text-slate-500 text-sm md:text-lg uppercase tracking-wide font-medium">
                    {product.brand}
                </h3>
            </div>
            
            {/* Reduced Text Size for Mobile */}
            <h2 className="font-serif text-3xl md:text-5xl text-slate-900 leading-none mb-4">
              {product.name}
            </h2>

            <p className="text-slate-600 font-light text-sm md:text-lg leading-relaxed max-w-md mx-auto lg:mx-0 mb-6">
              {product.description}
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                {product.notes.map((note, index) => (
                  <span key={index} className="px-3 py-1 bg-white border border-brand-light text-slate-600 text-xs rounded-full shadow-sm">
                    {note}
                  </span>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <p className="font-serif text-2xl md:text-3xl text-slate-800">{product.price}</p>
              <button className="px-8 py-3 bg-slate-900 text-white text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-brand-DEFAULT transition-colors duration-300 rounded-sm shadow-lg">
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