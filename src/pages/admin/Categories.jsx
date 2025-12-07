import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Categories = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const brandMap = {};

        querySnapshot.forEach(doc => {
          const b = doc.data().brand;
          if (b) {
            brandMap[b] = (brandMap[b] || 0) + 1;
          }
        });

        const brandList = Object.keys(brandMap).map(key => ({
          name: key,
          count: brandMap[key]
        })).sort((a, b) => a.name.localeCompare(b.name));

        setBrands(brandList);
      } catch (error) {
        console.error("Error fetching brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading Brands...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-serif text-3xl text-slate-900 mb-8">Categories & Brands</h1>
      
      <div className="bg-white border border-slate-100 rounded-sm shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Active Brands ({brands.length})</h2>
        
        {brands.length === 0 ? (
          <p className="text-slate-500">No brands found. Add products to create brands.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map((brand, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-sm border border-slate-100">
                <span className="font-medium text-slate-700">{brand.name}</span>
                <span className="bg-white px-2 py-1 text-xs font-bold text-slate-500 rounded-full shadow-sm border border-slate-200">
                  {brand.count} Products
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;