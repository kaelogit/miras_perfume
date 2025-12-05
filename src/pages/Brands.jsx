import React from 'react';
import { Link } from 'react-router-dom';

const Brands = () => {
  
  // --------------------------------------------------------
  // MOCK DATABASE: This will come from your Admin API later
  // --------------------------------------------------------
  const brandDatabase = [
    {
      category: "Arabian & Oud Collection",
      description: "Rich, long-lasting scents from the Middle East.",
      brands: [
        "Lattafa", "Fragrance World", "Al Haramain", "Rasasi", 
        "Mousuf", "Ard Al Zaafaran", "Paris Corner"
      ]
    },
    {
      category: "Designer Classics",
      description: "Timeless fragrances from the world's top fashion houses.",
      brands: [
        "Christian Dior", "Chanel", "Yves Saint Laurent", "Giorgio Armani", 
        "Versace", "Gucci", "Tom Ford", "Dolce & Gabbana", 
        "Paco Rabanne", "Carolina Herrera", "Jean Paul Gaultier"
      ]
    },
    {
      category: "Niche & Exclusives",
      description: "Rare, artisanal scents for those who stand out.",
      brands: [
        "Creed", "Maison Francis Kurkdjian", "Roja Parfums", 
        "Parfums de Marly", "Amouage", "Xerjoff", "Byredo"
      ]
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl text-slate-900 mb-4">Authorized Retailer</h1>
          <p className="text-slate-500 font-light max-w-2xl mx-auto">
            We are proud stockists of over 50+ authentic luxury brands. 
            From the streets of Paris to the palaces of Dubai.
          </p>
        </div>

        {/* Brand Sections */}
        <div className="space-y-20">
          {brandDatabase.map((section, index) => (
            <div key={index}>
              
              {/* Section Title */}
              <div className="border-b border-slate-100 pb-4 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-2">
                <div>
                  <h2 className="font-serif text-2xl text-slate-900">{section.category}</h2>
                  <p className="text-sm text-slate-500 mt-1">{section.description}</p>
                </div>
                {/* Link to pre-filtered shop page for this category */}
                <Link 
                   to="/shop" 
                   className="text-brand-DEFAULT text-xs font-bold uppercase tracking-widest hover:text-slate-900 transition-colors"
                >
                  Shop {section.category.split(' ')[0]} &rarr;
                </Link>
              </div>

              {/* The Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {section.brands.map((brand, idx) => (
                  <Link 
                    key={idx} 
                    // In real app, this would be: to={`/shop?brand=${brand.toLowerCase()}`}
                    to="/shop" 
                    className="group flex items-center justify-center p-6 border border-slate-100 rounded-sm hover:border-brand-DEFAULT hover:shadow-md transition-all duration-300 bg-slate-50/30"
                  >
                    <span className="font-serif text-center text-slate-600 group-hover:text-slate-900 text-sm md:text-base">
                      {brand}
                    </span>
                  </Link>
                ))}
              </div>

            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 p-12 bg-slate-900 text-center rounded-sm">
          <h2 className="font-serif text-2xl text-white mb-4">Don't see your favorite brand?</h2>
          <p className="text-slate-400 mb-8 font-light">
            We restock weekly. Contact our concierge to request a specific fragrance.
          </p>
          <Link 
            to="/contact" 
            className="inline-block bg-white text-slate-900 px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-brand-DEFAULT hover:text-white transition-colors rounded-sm"
          >
            Contact Us
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Brands;