import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AdminLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/admin/login');
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  const LinkItem = ({ to, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`block px-4 py-3 text-sm font-medium rounded-sm transition-colors ${
          isActive 
            ? 'bg-brand-DEFAULT text-white' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        {label}
      </Link>
    );
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading Admin...</div>;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-50 shadow-md">
        <span className="font-serif tracking-widest font-bold">MIRA'S ADMIN</span>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 focus:outline-none">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col 
          transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-slate-800 hidden md:block">
          <h2 className="font-serif text-xl tracking-widest">MIRA'S</h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto pt-20 md:pt-4">
          
          <LinkItem to="/admin/dashboard" label="Overview" />
          
          <div className="pt-6 pb-2 px-4 text-[10px] uppercase tracking-widest text-slate-600 font-bold">Catalog</div>
          <LinkItem to="/admin/add-product" label="Add Product" />
          <LinkItem to="/admin/products" label="All Products" />
          <LinkItem to="/admin/categories" label="Categories & Brands" />

          <div className="pt-6 pb-2 px-4 text-[10px] uppercase tracking-widest text-slate-600 font-bold">Business</div>
          <LinkItem to="/admin/orders" label="Orders & Tracking" />
          <LinkItem to="/admin/customers" label="Customer History" />
          
          <div className="pt-6 pb-2 px-4 text-[10px] uppercase tracking-widest text-slate-600 font-bold">Communication</div>
          <LinkItem to="/admin/messages" label="Contact Messages" />

        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 w-full px-4 py-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto h-screen bg-slate-50 w-full pt-16 md:pt-0">
        <div className="p-4 md:p-8 max-w-full overflow-x-hidden">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;