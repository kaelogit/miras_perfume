import React from 'react';

const BrandShowcase = () => {
  const brands = [
    "DIOR", "CHANEL", "YVES SAINT LAURENT", 
    "TOM FORD", "CREED", "LATTAFA", 
    "GIORGIO ARMANI", "VERSACE"
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <p className="text-brand-DEFAULT font-bold tracking-widest uppercase text-xs mb-8">
          Authorized Retailer
        </p>
        
        <h2 className="font-serif text-3xl md:text-4xl text-slate-900 mb-12">
          Home to the Icons
        </h2>

        {/* The Grid of Names */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 opacity-80">
          {brands.map((brand, index) => (
            <div 
              key={index} 
              className="flex items-center justify-center p-6 bg-white shadow-sm border border-slate-100 rounded-sm hover:border-brand-DEFAULT hover:shadow-md transition-all duration-300 cursor-pointer group"
            >
              <span className="font-serif text-xl md:text-2xl text-slate-400 group-hover:text-slate-900 transition-colors">
                {brand}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <a href="#" className="text-sm font-medium text-slate-500 hover:text-brand-DEFAULT transition-colors underline decoration-1 underline-offset-4">
            View All 50+ Brands
          </a>
        </div>

      </div>
    </section>
  );
};

export default BrandShowcase;