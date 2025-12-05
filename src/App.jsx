import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Product from './pages/Product';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Brands from './pages/Brands'; // 1. Import Brands
import CartDrawer from './components/CartDrawer';

function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <Navbar />
      <CartDrawer />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* 2. Add Route */}
        <Route path="/brands" element={<Brands />} />
      </Routes>
      
      <Footer />
    </div>
  );
}

export default App;