import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const BrandShowcase = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const brandSet = new Set();
        querySnapshot.forEach(doc => {
          const data = doc.data();
          if (data.brand) brandSet.add(data.brand);
        });
        // Sort and take top 8
        setBrands([...brandSet].sort().slice(0, 8));
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) return <div className="py-20 text-center text-slate-400 text-xs">Loading Brands...</div>;
  
  if (brands.length === 0) return null; 

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <p className="text-brand-DEFAULT font-bold tracking-widest uppercase text-xs mb-4 md:mb-8">
          Authorized Retailer
        </p>
        
        <h2 className="font-serif text-2xl md:text-4xl text-slate-900 mb-8 md:mb-12">
          Shop by Brand
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {brands.map((brand, index) => (
            <Link 
              key={index} 
              to={`/shop?brand=${brand}`} 
              className="flex items-center justify-center p-4 md:p-6 bg-white shadow-sm border border-slate-100 rounded-sm hover:border-brand-DEFAULT hover:shadow-md transition-all duration-300 cursor-pointer group"
            >
              <span className="font-serif text-sm md:text-xl text-slate-500 group-hover:text-slate-900 transition-colors text-center uppercase tracking-wide">
                {brand}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 md:mt-12">
          <Link to="/brands" className="inline-block border border-slate-300 px-8 py-3 text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white transition-colors rounded-sm">
            View All Brands
          </Link>
        </div>

      </div>
    </section>
  );
};

export default BrandShowcase;