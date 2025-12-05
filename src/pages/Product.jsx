import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // 1. Import Cart Hook

const Product = () => {
  const { id } = useParams(); // Grabs ID from URL
  const { addToCart } = useCart(); // 2. Get the add function
  
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);

  // ------------------------------------------------------------------
  // MOCK BACKEND DATA (Simulates your future API)
  // ------------------------------------------------------------------
  const mockDatabase = [
    {
      id: "101", // YSL Libre
      brand: "YVES SAINT LAURENT",
      name: "Libre Eau de Parfum",
      price: 145000,
      description: "A statement fragrance for those who live by their own rules. Lavender essence from France combines with the sensuality of Moroccan orange blossom and a daring note of musk accord for a unique scent.",
      images: [
        "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?q=80&w=1000&auto=format&fit=crop", // Front
        "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop", // Side/Lifestyle
        "https://images.unsplash.com/photo-1585120040315-2241b774ad0f?q=80&w=1000&auto=format&fit=crop", // Detail
      ],
      notes: ["Lavender", "Orange Blossom", "Musk"],
      sku: "YSL-LIB-001",
      inStock: true
    },
    {
      id: "102", // Dior Sauvage
      brand: "DIOR",
      name: "Sauvage Elixir",
      price: 180000,
      description: "An extraordinarily concentrated fragrance steeped in the emblematic freshness of Sauvage with an intoxicating heart of spices, a 'tailor-made' lavender essence and a blend of rich woods.",
      images: [
        "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1523293188086-b589b9e54020?q=80&w=1000&auto=format&fit=crop",
      ],
      notes: ["Nutmeg", "Cinnamon", "Cardamom"],
      sku: "DIOR-SAU-001",
      inStock: true
    },
    {
        id: "103", // Creed Aventus
        brand: "CREED",
        name: "Aventus",
        price: 450000,
        description: "The exceptional Aventus was inspired by the dramatic life of a historic emperor, celebrating strength, power, and success. Introduced in 2010, this scent has grown to become the best-selling fragrance in the history of the brand.",
        images: [
          "https://images.unsplash.com/photo-1594035910387-fea4779426e9?q=80&w=1000&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1547887537-6158d64c35e4?q=80&w=1000&auto=format&fit=crop",
        ],
        notes: ["Pineapple", "Birch", "Musk"],
        sku: "CREED-AV-001",
        inStock: true
      },
    // Fallback for testing random IDs
    {
      id: "default",
      brand: "MIRA'S SELECTION",
      name: "Luxury Fragrance",
      price: 95000,
      description: "Experience the essence of pure luxury. A curated scent that defines elegance and sophistication.",
      images: [
        "https://images.unsplash.com/photo-1617239476458-9569a5c435b9?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=1000&auto=format&fit=crop",
      ],
      notes: ["Oud", "Amber", "Rose"],
      sku: "GEN-LUX-001",
      inStock: true
    }
  ];

  // ------------------------------------------------------------------
  // FETCH SIMULATION
  // ------------------------------------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when page loads
    setLoading(true);
    
    setTimeout(() => {
      // Find product by ID, or return default if not found
      const foundProduct = mockDatabase.find(p => p.id === id) || mockDatabase.find(p => p.id === "default");
      setProduct(foundProduct);
      setLoading(false);
      setQuantity(1); // Reset quantity
      setActiveImage(0); // Reset image
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-DEFAULT"></div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // UI RENDER
  // ------------------------------------------------------------------
  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* LEFT: Image Gallery */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 hide-scrollbar">
              {product.images.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative flex-shrink-0 w-20 h-20 border-2 rounded-sm overflow-hidden transition-all duration-300 ${
                    activeImage === index ? "border-brand-DEFAULT opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative aspect-[4/5] bg-slate-50 rounded-sm overflow-hidden shadow-sm">
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
              />
            </div>
          </div>

          {/* RIGHT: Product Details */}
          <div className="space-y-8 lg:pt-8">
            
            {/* Header */}
            <div>
              <h3 className="text-brand-DEFAULT font-bold tracking-widest uppercase text-xs mb-2">
                {product.brand}
              </h3>
              <h1 className="font-serif text-4xl text-slate-900 mb-4 leading-tight">
                {product.name}
              </h1>
              <p className="text-2xl font-light text-slate-800">
                ₦{product.price.toLocaleString()}
              </p>
            </div>

            {/* Description */}
            <div className="prose prose-slate text-slate-600 font-light leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Selector & Add to Cart */}
            <div className="border-t border-b border-slate-100 py-8 space-y-6">
              
              {/* Quantity */}
              <div className="flex items-center gap-6">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-900">Quantity</span>
                <div className="flex items-center border border-slate-300 rounded-sm">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-slate-50 text-slate-600"
                  >-</button>
                  <span className="px-4 py-2 font-medium text-slate-900 w-12 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-slate-50 text-slate-600"
                  >+</button>
                </div>
              </div>

              {/* Add Button - CONNECTED TO CONTEXT */}
              <button 
                onClick={() => addToCart(product, quantity)}
                className="w-full bg-slate-900 text-white py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-brand-DEFAULT transition-colors duration-300 shadow-lg"
              >
                Add to Cart — ₦{(product.price * quantity).toLocaleString()}
              </button>

              {/* Trust Badges */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs text-slate-500 pt-2">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  100% Authentic Guaranteed
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-DEFAULT" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Same-Day Lagos Delivery
                </span>
              </div>
            </div>

            {/* Accordions */}
            <div className="space-y-4">
              <details className="group border-b border-slate-100 pb-4 cursor-pointer" open>
                <summary className="flex justify-between items-center font-medium text-slate-900 list-none">
                  <span>Fragrance Notes</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-slate-500 text-sm mt-4 leading-relaxed">
                  <ul className="list-disc pl-5 space-y-1">
                    {product.notes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </div>
              </details>
              
              <details className="group border-b border-slate-100 pb-4 cursor-pointer">
                <summary className="flex justify-between items-center font-medium text-slate-900 list-none">
                  <span>Delivery & Returns</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="text-slate-500 text-sm mt-4 leading-relaxed">
                  We offer same-day delivery for orders placed before 12 PM in Lagos. Nationwide delivery takes 2-4 working days. Returns are accepted within 48 hours if the seal is unbroken.
                </div>
              </details>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;