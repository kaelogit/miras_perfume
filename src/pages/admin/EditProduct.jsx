import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase, mapProduct } from '../../supabase';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const minFlashEndsAt = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const [formData, setFormData] = useState({
    brand: '',
    name: '',
    price: '',
    stock: '',
    gender: 'women',
    scentFamily: 'woody',
    collectionType: 'designer',
    description: '',
    notes: '',
    isBestSeller: false,
    isNewArrival: false,
    isFlashSale: false,
    flashSalePrice: '',
    flashSaleEndsAt: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const { data: row, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (error || !row) throw error || new Error('Product not found');
        const p = mapProduct(row);
        setFormData({
          brand: p.brand || '',
          name: p.name || '',
          price: String(p.price ?? ''),
          stock: String(p.stock ?? ''),
          gender: p.gender || 'women',
          scentFamily: p.scentFamily || 'woody',
          collectionType: p.collectionType || 'designer',
          description: p.description || '',
          notes: Array.isArray(p.notes) ? p.notes.join(', ') : '',
          isBestSeller: Boolean(p.isBestSeller),
          isNewArrival: Boolean(p.isNewArrival),
          isFlashSale: Boolean(p.isFlashSale),
          flashSalePrice: p.flashSalePrice != null ? String(p.flashSalePrice) : '',
          flashSaleEndsAt: p.flashSaleEndsAt ? new Date(p.flashSaleEndsAt).toISOString().slice(0, 16) : '',
        });
      } catch (err) {
        setErrorMessage(err?.message || 'Could not load product.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    try {
      const flashSalePrice = formData.flashSalePrice === '' ? null : Number(formData.flashSalePrice);
      const flashSaleEndsAt = formData.flashSaleEndsAt ? new Date(formData.flashSaleEndsAt) : null;
      if (formData.isFlashSale) {
        if (!flashSalePrice || flashSalePrice <= 0) {
          throw new Error('Flash sale price is required and must be greater than 0.');
        }
        if (flashSalePrice >= Number(formData.price)) {
          throw new Error('Flash sale price must be lower than the regular price.');
        }
        if (!flashSaleEndsAt || Number.isNaN(flashSaleEndsAt.getTime())) {
          throw new Error('Flash end date/time is required.');
        }
        if (flashSaleEndsAt.getTime() <= Date.now()) {
          throw new Error('Flash end date/time must be in the future.');
        }
      }

      const updates = {
        brand: formData.brand,
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock),
        gender: formData.gender,
        scent_family: formData.scentFamily,
        collection_type: formData.collectionType,
        description: formData.description || null,
        notes: formData.notes ? formData.notes.split(',').map((n) => n.trim()).filter(Boolean) : [],
        search_keywords: [formData.brand, formData.name, formData.scentFamily].map((v) => v?.toLowerCase()).filter(Boolean),
        is_best_seller: formData.isBestSeller,
        is_new_arrival: formData.isNewArrival,
        is_flash_sale: formData.isFlashSale,
        flash_sale_price: formData.isFlashSale ? flashSalePrice : null,
        flash_sale_ends_at: formData.isFlashSale ? flashSaleEndsAt.toISOString() : null,
      };

      const { error } = await supabase.from('products').update(updates).eq('id', id);
      if (error) throw error;
      navigate('/admin/products');
    } catch (err) {
      setErrorMessage(err?.message || 'Could not update product.');
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading product...</div>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl text-slate-900 mb-8">Edit Product</h1>
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-sm shadow-sm space-y-6 border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Brand Name</label>
            <input name="brand" className="input-field" value={formData.brand} onChange={handleChange} required />
          </div>
          <div>
            <label className="label">Product Name</label>
            <input name="name" className="input-field" value={formData.name} onChange={handleChange} required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="label">Collection Type</label>
            <select name="collectionType" className="input-field bg-white" value={formData.collectionType} onChange={handleChange}>
              <option value="designer">Designer (Western)</option>
              <option value="arabian">Arabian / Oud</option>
              <option value="niche">Niche / Exclusive</option>
              <option value="combo">Combos & Sets</option>
            </select>
          </div>
          <div>
            <label className="label">Scent Family</label>
            <select name="scentFamily" className="input-field bg-white" value={formData.scentFamily} onChange={handleChange}>
              <option value="woody">Woody & Oud (Strong)</option>
              <option value="floral">Floral & Fruity (Sweet)</option>
              <option value="fresh">Fresh & Citrus (Clean)</option>
              <option value="oriental">Oriental & Spicy (Warm)</option>
              <option value="gourmand">Gourmand (Vanilla/Sweet)</option>
            </select>
          </div>
          <div>
            <label className="label">Gender</label>
            <select name="gender" className="input-field bg-white" value={formData.gender} onChange={handleChange}>
              <option value="women">Women</option>
              <option value="men">Men</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Price (₦)</label>
            <input name="price" type="number" className="input-field" value={formData.price} onChange={handleChange} required />
          </div>
          <div>
            <label className="label">Stock Quantity</label>
            <input name="stock" type="number" className="input-field" value={formData.stock} onChange={handleChange} required />
          </div>
        </div>

        <div>
          <label className="label">Fragrance Notes (comma separated)</label>
          <input name="notes" className="input-field" value={formData.notes} onChange={handleChange} />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea name="description" rows="3" className="input-field" value={formData.description} onChange={handleChange} required />
        </div>

        <div className="flex flex-wrap gap-6 pt-2">
          <label className="flex items-center gap-2"><input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} /> Best Seller</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} /> New Arrival</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="isFlashSale" checked={formData.isFlashSale} onChange={handleChange} /> Flash Drop</label>
        </div>

        {formData.isFlashSale && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Flash Sale Price (₦)</label>
              <input
                name="flashSalePrice"
                type="number"
                className="input-field"
                value={formData.flashSalePrice}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="label">Flash Ends At</label>
              <input
                name="flashSaleEndsAt"
                type="datetime-local"
                className="input-field"
                value={formData.flashSaleEndsAt}
                onChange={handleChange}
                min={minFlashEndsAt}
                required
              />
            </div>
          </div>
        )}

        <button disabled={saving} className="btn-primary w-full mt-4 flex justify-center items-center gap-3">
          {saving && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>}
          {saving ? 'Saving...' : 'Update Product'}
        </button>
      </form>

      <style>{`
        .label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #64748B; margin-bottom: 0.5rem; }
        .input-field { width: 100%; border: 1px solid #E2E8F0; padding: 0.75rem; border-radius: 0.125rem; outline: none; }
        .input-field:focus { border-color: #0F172A; }
        .btn-primary { background-color: #0F172A; color: white; padding: 1rem; font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 0.125rem; transition: background 0.3s; }
        .btn-primary:hover { background-color: #E29578; }
      `}</style>
    </div>
  );
};

export default EditProduct;
