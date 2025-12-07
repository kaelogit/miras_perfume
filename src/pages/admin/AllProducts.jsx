import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const list = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(list);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, "products", id));
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        alert("Error deleting product");
      }
    }
  };

  if (loading) return <div className="p-8">Loading Inventory...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl text-slate-900">Inventory ({products.length})</h1>
        <Link to="/admin/add-product" className="bg-slate-900 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-brand-DEFAULT transition-colors">
          + Add New
        </Link>
      </div>

      <div className="bg-white border border-slate-100 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
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
                      <span className="font-medium text-slate-900 text-sm">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{product.brand}</td>
                  <td className="p-4 text-sm text-slate-900 font-medium">₦{product.price.toLocaleString()}</td>
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
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="text-red-400 hover:text-red-600 text-xs font-bold uppercase tracking-wide"
                    >
                      Delete
                    </button>
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