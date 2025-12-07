import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Brands = () => {
  const [brandGroups, setBrandGroups] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const uniqueBrands = new Set();
        
        querySnapshot.forEach(doc => {
          const b = doc.data().brand;
          if (b) uniqueBrands.add(b.trim());
        });

        const groups = {};
        [...uniqueBrands].sort().forEach(brand => {
          const letter = brand.charAt(0).toUpperCase();
          if (!groups[letter]) groups[letter] = [];
          groups[letter].push(brand);
        });

        setBrandGroups(groups);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  const letters = Object.keys(brandGroups).sort();

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl text-slate-900 mb-4">Authorized Retailer</h1>
          <p className="text-slate-500 font-light max-w-2xl mx-auto">
            Explore our curated collection of authentic luxury fragrances from the world's most prestigious houses.
          </p>
        </div>

        {letters.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-sm">
            <p className="text-slate-500">No brands found in the catalog yet.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {letters.map((letter) => (
              <div key={letter} className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <span className="font-serif text-4xl text-slate-200 font-bold">{letter}</span>
                  <div className="h-px bg-slate-100 flex-1"></div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {brandGroups[letter].map((brand) => (
                    <Link 
                      key={brand}
                      to={`/shop?brand=${brand}`} 
                      className="group flex items-center justify-center p-6 border border-slate-100 rounded-sm hover:border-brand-DEFAULT hover:shadow-md transition-all duration-300 bg-white"
                    >
                      <span className="font-serif text-center text-slate-600 group-hover:text-slate-900 text-sm md:text-base uppercase tracking-wide">
                        {brand}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 p-12 bg-slate-900 text-center rounded-sm">
          <h2 className="font-serif text-2xl text-white mb-4">Don't see a brand?</h2>
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