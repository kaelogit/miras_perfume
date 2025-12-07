import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialFilter = searchParams.get('filter'); 
  const initialBrand = searchParams.get('brand');
  const initialType = searchParams.get('type');    
  const initialScent = searchParams.get('scent');  
  
  const { addToCart } = useCart();
  
  const [products, setProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [activeGender, setActiveGender] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [activeScent, setActiveScent] = useState('all');
  const [activeBrand, setActiveBrand] = useState('all');

  const [isFilterOpen, setIsFilterOpen] = useState(false); 
  const [brandGroups, setBrandGroups] = useState({}); 
  const [openBrandGroup, setOpenBrandGroup] = useState(null); 

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsList);
        setFilteredProducts(productsList); 
        
        organizeBrands(productsList); 
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const organizeBrands = (items) => {
    const groups = { 'A-E': [], 'F-K': [], 'L-Q': [], 'R-V': [], 'W-Z': [] };
    const uniqueBrands = [...new Set(items.map(p => p.brand).filter(Boolean))].sort();

    uniqueBrands.forEach(brand => {
      const firstLetter = brand.charAt(0).toUpperCase();
      if (firstLetter >= 'A' && firstLetter <= 'E') groups['A-E'].push(brand);
      else if (firstLetter >= 'F' && firstLetter <= 'K') groups['F-K'].push(brand);
      else if (firstLetter >= 'L' && firstLetter <= 'Q') groups['L-Q'].push(brand);
      else if (firstLetter >= 'R' && firstLetter <= 'V') groups['R-V'].push(brand);
      else if (firstLetter >= 'W' && firstLetter <= 'Z') groups['W-Z'].push(brand);
      else {
        if (!groups['#']) groups['#'] = [];
        groups['#'].push(brand);
      }
    });
    setBrandGroups(groups);
  };

  
  const handleGenderChange = (gender) => {
    setActiveGender(gender);
    if (gender !== 'all') {
      setActiveType('all');
      setActiveScent('all');
      setActiveBrand('all');
      setSearchParams({}); 
    }
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
    if (type !== 'all') {
      setActiveGender('all');
      setActiveScent('all');
      setActiveBrand('all');
      setSearchParams({});
    }
  };

  const handleScentChange = (scent) => {
    setActiveScent(scent);
    if (scent !== 'all') {
      setActiveGender('all');
      setActiveType('all');
      setActiveBrand('all');
      setSearchParams({});
    }
  };

  const handleBrandChange = (brand) => {
    setActiveBrand(brand);
    if (brand !== 'all') {
      setActiveGender('all');
      setActiveType('all');
      setActiveScent('all');
      setSearchParams({});
      setIsFilterOpen(false); 
    }
  };

  useEffect(() => {
    if (initialBrand) {
      setActiveBrand(initialBrand);
      setActiveGender('all'); setActiveType('all'); setActiveScent('all');
    } 
    else if (initialType) {
      setActiveType(initialType);
      setActiveGender('all'); setActiveScent('all'); setActiveBrand('all');
    }
    else if (initialScent) {
      setActiveScent(initialScent);
      setActiveGender('all'); setActiveType('all'); setActiveBrand('all');
    }
    else if (initialFilter === 'men') {
      setActiveGender('men');
      setActiveType('all'); setActiveScent('all'); setActiveBrand('all');
    }
    else if (initialFilter === 'women') {
      setActiveGender('women');
      setActiveType('all'); setActiveScent('all'); setActiveBrand('all');
    }
    else if (initialFilter === 'unisex') {
      setActiveGender('unisex');
      setActiveType('all'); setActiveScent('all'); setActiveBrand('all');
    }
    else if (!initialFilter) {
    }

  }, [initialType, initialScent, initialBrand, initialFilter]);

  useEffect(() => {
    if (products.length === 0) return;

    let result = products;

    
    if (activeBrand !== 'all') {
      result = result.filter(p => p.brand && p.brand.toLowerCase() === activeBrand.toLowerCase());
    }
    else if (activeGender !== 'all') {
      result = result.filter(p => p.gender === activeGender);
    }
    else if (activeType !== 'all') {
      result = result.filter(p => p.collectionType === activeType);
    }
    else if (activeScent !== 'all') {
      result = result.filter(p => p.scentFamily === activeScent);
    }
    
    if (initialFilter === 'best-sellers') {
      result = products.filter(p => p.isBestSeller);
    } else if (initialFilter === 'new-arrivals') {
      result = products.filter(p => p.isNewArrival);
    }

    setFilteredProducts(result);
  }, [activeGender, activeType, activeScent, activeBrand, initialFilter, products]);

  const handleQuickAdd = (e, product) => {
    e.preventDefault(); 
    e.stopPropagation();
    addToCart(product, 1);
  };

  const clearFilters = () => {
    setActiveGender('all');
    setActiveType('all');
    setActiveScent('all');
    setActiveBrand('all');
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  const getTitle = () => {
    if (initialFilter === 'best-sellers') return "Best Sellers";
    if (initialFilter === 'new-arrivals') return "New Arrivals";
    
    if (activeBrand !== 'all') return `${activeBrand} Collection`;
    if (activeType !== 'all') return `${activeType.charAt(0).toUpperCase() + activeType.slice(1)} Collection`;
    if (activeScent !== 'all') return `${activeScent.charAt(0).toUpperCase() + activeScent.slice(1)} Fragrances`;
    if (activeGender !== 'all') return `${activeGender.charAt(0).toUpperCase() + activeGender.slice(1)}'s Fragrances`;
    
    return "All Fragrances";
  };

  const FilterSidebar = () => (
    <div className="space-y-10">
      
      <div>
        <h3 className="font-bold text-xs uppercase tracking-widest text-slate-900 mb-4 border-b border-slate-100 pb-2">Gender</h3>
        <div className="space-y-3">
          {['all', 'women', 'men', 'unisex'].map(g => (
            <label key={g} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${activeGender === g ? 'border-brand-DEFAULT' : 'border-slate-300'}`}>
                {activeGender === g && <div className="w-2 h-2 bg-brand-DEFAULT rounded-full"></div>}
              </div>
              <input type="radio" name="gender" className="hidden" checked={activeGender === g} onChange={() => handleGenderChange(g)} />
              <span className={`text-sm capitalize ${activeGender === g ? 'text-slate-900 font-bold' : 'text-slate-500 group-hover:text-slate-900'}`}>
                {g === 'all' ? 'All Genders' : g}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-xs uppercase tracking-widest text-slate-900 mb-4 border-b border-slate-100 pb-2">Collection Type</h3>
        <div className="space-y-3">
          {[
            { id: 'all', label: 'All Types' },
            { id: 'designer', label: 'Designer' },
            { id: 'niche', label: 'Niche / Exclusive' },
            { id: 'arabian', label: 'Arabian / Oud' },
          ].map(t => (
            <label key={t.id} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${activeType === t.id ? 'border-brand-DEFAULT' : 'border-slate-300'}`}>
                {activeType === t.id && <div className="w-2 h-2 bg-brand-DEFAULT rounded-full"></div>}
              </div>
              <input type="radio" name="type" className="hidden" checked={activeType === t.id} onChange={() => handleTypeChange(t.id)} />
              <span className={`text-sm ${activeType === t.id ? 'text-slate-900 font-bold' : 'text-slate-500 group-hover:text-slate-900'}`}>{t.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-xs uppercase tracking-widest text-slate-900 mb-4 border-b border-slate-100 pb-2">Scent Profile</h3>
        <div className="space-y-3">
          {[
            { id: 'all', label: 'All Scents' },
            { id: 'woody', label: 'Woody & Oud' },
            { id: 'floral', label: 'Floral & Sweet' },
            { id: 'fresh', label: 'Fresh & Citrus' },
            { id: 'oriental', label: 'Spicy & Warm' },
            { id: 'gourmand', label: 'Vanilla & Rich' },
          ].map(t => (
            <label key={t.id} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${activeScent === t.id ? 'border-brand-DEFAULT' : 'border-slate-300'}`}>
                {activeScent === t.id && <div className="w-2 h-2 bg-brand-DEFAULT rounded-full"></div>}
              </div>
              <input type="radio" name="scent" className="hidden" checked={activeScent === t.id} onChange={() => handleScentChange(t.id)} />
              <span className={`text-sm ${activeScent === t.id ? 'text-slate-900 font-bold' : 'text-slate-500 group-hover:text-slate-900'}`}>{t.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-xs uppercase tracking-widest text-slate-900 mb-4 border-b border-slate-100 pb-2">Brands</h3>
        <div className="space-y-2">
          <button 
            onClick={() => handleBrandChange('all')}
            className={`text-sm block w-full text-left py-1 ${activeBrand === 'all' ? 'text-brand-DEFAULT font-bold' : 'text-slate-500'}`}
          >
            All Brands
          </button>

          {Object.keys(brandGroups).map((groupKey) => (
            brandGroups[groupKey].length > 0 && (
              <div key={groupKey} className="border-b border-slate-50 last:border-0">
                <button 
                  onClick={() => setOpenBrandGroup(openBrandGroup === groupKey ? null : groupKey)}
                  className="flex justify-between items-center w-full py-3 text-sm font-medium text-slate-800 hover:text-brand-DEFAULT transition-colors"
                >
                  <span>{groupKey}</span>
                  <span className="text-xs text-slate-400">
                    {openBrandGroup === groupKey ? '−' : '+'}
                  </span>
                </button>
                
                {openBrandGroup === groupKey && (
                  <div className="pl-2 pb-4 space-y-2 animate-fade-in">
                    {brandGroups[groupKey].map(brand => (
                      <button
                        key={brand}
                        onClick={() => handleBrandChange(brand)}
                        className={`block text-sm text-left w-full py-1 ${activeBrand === brand ? 'text-brand-DEFAULT font-bold' : 'text-slate-500 hover:text-slate-800'}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          ))}
        </div>
      </div>

      {(activeGender !== 'all' || activeType !== 'all' || activeScent !== 'all' || activeBrand !== 'all') && (
        <button onClick={clearFilters} className="text-xs font-bold text-red-500 uppercase tracking-widest hover:text-red-700 block mt-6">Clear All Filters</button>
      )}
    </div>
  );

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10 md:mb-16 relative">
          <h1 className="font-serif text-3xl md:text-4xl text-slate-900 mb-2 capitalize">
            {getTitle()}
          </h1>
          <div className="w-24 h-1 bg-brand-DEFAULT mx-auto mt-4"></div>
          
          <div className="md:hidden mt-6">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="inline-flex items-center gap-2 border border-slate-300 px-6 py-2 text-sm uppercase tracking-widest font-bold text-slate-700 hover:bg-slate-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
              Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          
          <div className="w-full md:w-64 hidden md:block">
            <FilterSidebar />
          </div>

          {isFilterOpen && (
            <div className="fixed inset-0 z-[60] flex md:hidden">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}></div>
              <div className="relative bg-white w-3/4 max-w-xs h-full shadow-xl p-6 overflow-y-auto animate-slide-in-left">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="font-serif text-xl text-slate-900">Filters</h2>
                  <button onClick={() => setIsFilterOpen(false)} className="text-slate-400 hover:text-red-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <FilterSidebar />
              </div>
            </div>
          )}

          <div className="flex-1">
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-slate-50 rounded-sm">
                <p className="text-slate-500 mb-4">No products found matching your selection.</p>
                <button onClick={clearFilters} className="text-brand-DEFAULT underline text-sm">Clear Filters</button>
              </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-8">
              {filteredProducts.map((product) => (
                <div key={product.id} className="group relative">
                  
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden rounded-sm mb-3">
                      {product.isBestSeller && (
                        <span className="absolute top-2 left-2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest z-10">Best Seller</span>
                      )}
                      {product.isNewArrival && !product.isBestSeller && (
                        <span className="absolute top-2 left-2 bg-brand-DEFAULT text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest z-10">New Arrival</span>
                      )}
                      
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>

                    <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 truncate">
                                {product.brand}
                            </h3>
                            <h2 className="font-serif text-sm md:text-base text-slate-900 mb-1 leading-tight group-hover:text-brand-DEFAULT transition-colors truncate">
                                {product.name}
                            </h2>
                            <p className="text-slate-600 font-light text-sm md:text-sm">
                                ₦{product.price ? product.price.toLocaleString() : "0"}
                            </p>
                        </div>

                        <button 
                            onClick={(e) => handleQuickAdd(e, product)}
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

        </div>
      </div>
    </div>
  );
};

export default Shop;