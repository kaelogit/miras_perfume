import React, { useEffect, useState } from 'react';
import { supabase, mapProduct, getEffectivePrice, isFlashSaleActive } from '../../supabase';
import { Link } from 'react-router-dom';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Fetch Products
  const fetchProducts = async () => {
    setFetchError(null);
    try {
      const { data: rows, error: fetchErr } = await supabase.from('products').select('*');
      if (fetchErr) throw fetchErr;
      setProducts((rows || []).map(mapProduct));
    } catch (error) {
      console.error("Error fetching products:", error);
      setFetchError(error?.message || String(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete Product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product? This cannot be undone.")) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        setProducts(products.filter(product => product.id !== id));
      } catch {
        alert("Error deleting product");
      }
    }
  };

  if (loading) return <div className="p-8">Loading Inventory...</div>;

  if (fetchError) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <p className="text-red-600 font-medium mb-2">Could not load products</p>
        <p className="text-slate-500 text-sm mb-4">{fetchError}</p>
        <p className="text-slate-400 text-xs">Check Supabase policies and connectivity in the Dashboard if this persists.</p>
        <button onClick={fetchProducts} className="mt-4 text-brand-DEFAULT underline text-sm">Try again</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-2xl md:text-3xl text-slate-900">Inventory ({products.length})</h1>
        <Link to="/admin/add-product" className="bg-slate-900 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-brand-DEFAULT transition-colors">
          + Add New
        </Link>
      </div>

      <div className="bg-white border border-slate-100 rounded-sm shadow-sm overflow-hidden">
        {/* Scroll wrapper for mobile */}
        <div className="overflow-x-auto">
          {/* Min-width ensures columns don't squash on phone screens */}
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Product</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Brand</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Price</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Stock</th>
                <th className="p-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-sm overflow-hidden flex-shrink-0">
                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium text-slate-900 text-sm line-clamp-1 max-w-[200px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{product.brand}</td>
                  <td className="p-4 text-sm text-slate-900 font-medium">
                    {isFlashSaleActive(product) ? (
                      <div>
                        <p className="text-xs text-slate-400 line-through">₦{product.price.toLocaleString()}</p>
                        <p className="text-red-600 font-semibold">₦{getEffectivePrice(product).toLocaleString()}</p>
                      </div>
                    ) : (
                      <>₦{product.price.toLocaleString()}</>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.stock > 5 ? 'bg-green-100 text-green-800' : 
                      product.stock > 0 ? 'bg-orange-100 text-orange-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock} left
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {/* FIXED: Larger button area for mobile touch */}
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/edit-product/${product.id}`}
                        className="bg-slate-50 text-slate-700 hover:bg-slate-800 hover:text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wide transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wide transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {products.length === 0 && (
          <div className="p-12 text-center text-slate-500 text-sm">
            No products found. Start adding some!
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;