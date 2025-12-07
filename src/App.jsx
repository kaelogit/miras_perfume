import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ScrollToTop from './components/ScrollToTop'; 
import Toast from './components/Toast'; 
import { useCart } from './context/CartContext'; 

import Home from './pages/Home';
import Product from './pages/Product';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Brands from './pages/Brands';
import Success from './pages/Success';
import TrackOrder from './pages/TrackOrder';
import JournalIndex from './pages/JournalIndex'; 
import JournalPost from './pages/JournalPost';   

import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AddProduct from './pages/admin/AddProduct';
import AllProducts from './pages/admin/AllProducts';
import Orders from './pages/admin/Orders';
import Messages from './pages/admin/Messages';
import Categories from './pages/admin/Categories';
import Customers from './pages/admin/Customers';

const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Outlet /> 
      <Footer />
    </>
  );
};

function App() {
  const { notification, clearNotification } = useCart(); 

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <ScrollToTop /> 
      
      {notification && (
        <Toast message={notification} onClose={clearNotification} />
      )}

      <Routes>
        
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/journal" element={<JournalIndex />} />
          <Route path="/journal/:id" element={<JournalPost />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} /> 
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="products" element={<AllProducts />} />
          <Route path="orders" element={<Orders />} />
          <Route path="messages" element={<Messages />} />
          <Route path="categories" element={<Categories />} />
          <Route path="customers" element={<Customers />} />
        </Route>

      </Routes>
    </div>
  );
}

export default App;