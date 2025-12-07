import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard'); 
    } catch (err) {
      setError('Invalid credentials. Access denied.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-sm shadow-md w-full max-w-md">
        <h1 className="font-serif text-2xl text-slate-900 mb-2 text-center">Mira's Admin</h1>
        <p className="text-xs text-slate-500 text-center mb-8 uppercase tracking-widest">Restricted Access</p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 text-sm mb-4 text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-3 rounded-sm focus:border-slate-900 outline-none"
              placeholder="admin@miras.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-3 rounded-sm focus:border-slate-900 outline-none"
              placeholder="••••••••"
            />
          </div>
          <button className="w-full bg-slate-900 text-white py-3 text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-colors">
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;