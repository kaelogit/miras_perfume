import React, { useState, useEffect } from 'react';
import { db } from '../../firebase'; 
import { collection, addDoc, getDocs } from 'firebase/firestore';

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [existingBrands, setExistingBrands] = useState([]); // Store fetched brands

  // --- CLOUDINARY CONFIG ---
  // REPLACE THESE WITH YOUR REAL CREDENTIALS FROM CLOUDINARY DASHBOARD
  const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; 
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_PRESET; 

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
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0); 

  // 1. FETCH EXISTING BRANDS ON LOAD
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const brandsSet = new Set();
        querySnapshot.forEach(doc => {
          if (doc.data().brand) {
            brandsSet.add(doc.data().brand);
          }
        });
        // Sort alphabetically
        setExistingBrands([...brandsSet].sort());
      } catch (err) {
        console.error("Failed to load brands", err);
      }
    };
    fetchBrands();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const combinedFiles = [...imageFiles, ...newFiles];
      if (combinedFiles.length > 3) {
        alert("Max 3 images allowed.");
        return;
      }
      setImageFiles(combinedFiles);
    }
  };

  const removeImage = (index) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(updatedFiles);
    if (index <= mainImageIndex) setMainImageIndex(0);
  };

  // UPLOAD LOGIC (Cloudinary)
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET); 
    data.append("cloud_name", CLOUD_NAME);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: data
    });
    
    if (!res.ok) throw new Error("Image upload failed");
    
    const fileData = await res.json();
    return fileData.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('Starting...');

    try {
      const imageUrls = [];

      // 1. Upload Images
      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          setStatus(`Uploading image ${i + 1} of ${imageFiles.length}...`);
          const url = await uploadToCloudinary(imageFiles[i]);
          imageUrls.push(url);
        }
      } else {
        imageUrls.push("https://placehold.co/600x400?text=No+Image");
      }

      const mainImage = imageUrls[mainImageIndex] || imageUrls[0];

      // 2. Prepare Data
      const productData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        notes: formData.notes.split(',').map(n => n.trim()),
        image: mainImage, 
        images: imageUrls, 
        // Search Keywords for easier finding
        searchKeywords: [
          formData.brand.toLowerCase(), 
          formData.name.toLowerCase(), 
          formData.scentFamily.toLowerCase()
        ],
        createdAt: new Date()
      };

      // 3. Save to Firebase
      await addDoc(collection(db, "products"), productData);

      setStatus('Success! Product Live.');
      setLoading(false);
      
      // Reset Form
      setFormData({
        brand: '', name: '', price: '', stock: '', gender: 'women', scentFamily: 'woody', collectionType: 'designer',
        description: '', notes: '', isBestSeller: false, isNewArrival: false
      });
      setImageFiles([]);
      setMainImageIndex(0);

    } catch (error) {
      console.error("Error:", error);
      setStatus('Error: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl text-slate-900 mb-8">Add New Product</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-sm shadow-sm space-y-6 border border-slate-100">
        
        {/* BRAND SELECTION (Smart Dropdown) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Brand Name</label>
            <input 
              list="brand-list" // Connects to the datalist below
              name="brand" 
              placeholder="Type or select brand..." 
              className="input-field" 
              value={formData.brand} 
              onChange={handleChange} 
              required 
            />
            {/* The Dropdown List of existing brands */}
            <datalist id="brand-list">
              {existingBrands.map((b, i) => (
                <option key={i} value={b} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="label">Product Name</label>
            <input name="name" placeholder="e.g. Oud Mood" className="input-field" value={formData.name} onChange={handleChange} required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Collection Type - UPDATED with "Combos & Sets" */}
          <div>
            <label className="label">Collection Type</label>
            <select name="collectionType" className="input-field bg-white" value={formData.collectionType} onChange={handleChange}>
              <option value="designer">Designer (Western)</option>
              <option value="arabian">Arabian / Oud</option>
              <option value="niche">Niche / Exclusive</option>
              <option value="combo">Combos & Sets</option> {/* NEW OPTION */}
            </select>
          </div>

          {/* Scent Family */}
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

          {/* Gender */}
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
            <input name="stock" type="number" placeholder="e.g. 10" className="input-field" value={formData.stock} onChange={handleChange} required />
          </div>
        </div>

        <div>
            <label className="label">Fragrance Notes (comma separated)</label>
            <input name="notes" placeholder="Oud, Vanilla, Amber" className="input-field" value={formData.notes} onChange={handleChange} />
        </div>

        <div>
            <label className="label">Description</label>
            <textarea name="description" rows="3" className="input-field" value={formData.description} onChange={handleChange} required />
        </div>

        {/* IMAGE UPLOAD SECTION */}
        <div className="bg-slate-50 p-4 rounded-sm border border-slate-200 border-dashed">
            <label className="label">Product Images (Max 3)</label>
            <div className="flex flex-col gap-3">
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="input-field pt-2" disabled={imageFiles.length >= 3} />
              <p className="text-xs text-slate-400">
                {imageFiles.length === 0 ? "Select images to upload." : `${imageFiles.length} / 3 images selected.`}
              </p>
            </div>
            
            {imageFiles.length > 0 && (
              <div className="flex gap-4 mt-4">
                {imageFiles.map((file, idx) => (
                  <div key={idx} className={`relative w-24 h-24 rounded-md overflow-hidden border-2 group ${mainImageIndex === idx ? 'border-brand-DEFAULT' : 'border-slate-200'}`}>
                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover cursor-pointer" onClick={() => setMainImageIndex(idx)} />
                    {mainImageIndex === idx && <div className="absolute bottom-0 w-full bg-brand-DEFAULT text-white text-[10px] text-center font-bold py-1">MAIN</div>}
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition-opacity">×</button>
                  </div>
                ))}
              </div>
            )}
        </div>

        <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2"><input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} /> Best Seller</label>
            <label className="flex items-center gap-2"><input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} /> New Arrival</label>
        </div>

        <button disabled={loading} className="btn-primary w-full mt-4 flex justify-center items-center gap-3">
            {loading && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>}
            {loading ? status : "Upload Product"}
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

export default AddProduct;