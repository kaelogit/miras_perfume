import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ScrollToTop from './components/ScrollToTop'; 
import Toast from './components/Toast'; 
import { useCart } from './context/CartContext'; 

const Home = lazy(() => import('./pages/Home'));
const Product = lazy(() => import('./pages/Product'));
const Shop = lazy(() => import('./pages/Shop'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Contact = lazy(() => import('./pages/Contact'));
const Brands = lazy(() => import('./pages/Brands'));
const Success = lazy(() => import('./pages/Success'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const JournalIndex = lazy(() => import('./pages/JournalIndex'));
const JournalPost = lazy(() => import('./pages/JournalPost'));

import AdminLayout from './layouts/AdminLayout';
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AddProduct = lazy(() => import('./pages/admin/AddProduct'));
const EditProduct = lazy(() => import('./pages/admin/EditProduct'));
const AllProducts = lazy(() => import('./pages/admin/AllProducts'));
const Orders = lazy(() => import('./pages/admin/Orders'));
const Messages = lazy(() => import('./pages/admin/Messages'));
const Categories = lazy(() => import('./pages/admin/Categories'));
const Customers = lazy(() => import('./pages/admin/Customers'));

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

      <Suspense
        fallback={
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900" />
          </div>
        }
      >
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
            <Route path="edit-product/:id" element={<EditProduct />} />
            <Route path="products" element={<AllProducts />} />
            <Route path="orders" element={<Orders />} />
            <Route path="messages" element={<Messages />} />
            <Route path="categories" element={<Categories />} />
            <Route path="customers" element={<Customers />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;