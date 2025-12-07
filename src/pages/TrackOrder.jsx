import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [statusResult, setStatusResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatusResult(null);

    try {
      const formattedId = orderId.trim().toUpperCase();
      const q = query(collection(db, "orders"), where("orderId", "==", formattedId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const orderData = querySnapshot.docs[0].data();
        setStatusResult({
          status: orderData.status,
          date: orderData.date.toDate().toLocaleDateString(),
          total: orderData.total,
          id: formattedId,
          items: orderData.items || [], 
          customer: orderData.customer || {},
          courier: orderData.courier,
          trackingNumber: orderData.trackingNumber
        });
      } else {
        setError('Order ID not found. Please check your receipt.');
      }
    } catch (err) {
      console.error(err);
      setError('System error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status) => {
    if (status === 'Pending') return 0;
    if (status === 'Packing') return 1;
    if (status === 'Shipped') return 2;
    if (status === 'Delivered') return 3;
    return 0; 
  };

  const getStatusMessage = (status) => {
    if (status === 'Pending') return "We have received your order. Our team will begin processing it shortly.";
    if (status === 'Packing') return "Your order is being carefully packed and prepared for shipment.";
    if (status === 'Shipped') return "Good news! Your package is with our delivery partner and on its way to you.";
    if (status === 'Delivered') return "Your package has been delivered. Thank you for shopping with Mira's.";
    return "Status update pending.";
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl md:text-4xl text-slate-900 mb-4">Track Order</h1>
          <p className="text-slate-500 font-light text-sm tracking-wide uppercase">Luxury Delivery Service</p>
        </div>

        <div className="bg-white p-2 rounded-full shadow-lg border border-slate-100 flex max-w-md mx-auto mb-16 transform -translate-y-4">
          <input 
            type="text" 
            placeholder="ENTER ORDER ID (e.g. MIRA-123456)"
            className="flex-1 bg-transparent px-6 py-3 outline-none text-slate-900 placeholder-slate-400 text-sm font-medium uppercase tracking-widest text-center"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button 
            onClick={handleTrack}
            disabled={loading}
            className="bg-slate-900 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-brand-DEFAULT transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-center p-4 rounded-sm text-sm mb-8 animate-fade-in">
            {error}
          </div>
        )}

        {statusResult && (
          <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-slate-100 animate-fade-in-up">
            
            <div className={`p-8 text-center ${
              statusResult.status === 'Delivered' ? 'bg-green-600 text-white' : 
              statusResult.status === 'Shipped' ? 'bg-brand-DEFAULT text-slate-900' : 
              'bg-slate-800 text-white'
            }`}>
              <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80 mb-2">Current Status</p>
              <h2 className="font-serif text-3xl md:text-4xl">{statusResult.status}</h2>
              <p className="text-sm mt-4 opacity-90 max-w-md mx-auto leading-relaxed">
                {getStatusMessage(statusResult.status)}
              </p>

              {(statusResult.status === 'Shipped' || statusResult.status === 'Delivered') && statusResult.trackingNumber && (
                <div className={`mt-8 inline-block backdrop-blur-md border p-4 rounded-sm min-w-[250px] ${
                   statusResult.status === 'Shipped' ? 'bg-white/40 border-slate-900/10 text-slate-900' : 'bg-white/10 border-white/20 text-white'
                }`}>
                   <p className="text-[10px] font-bold uppercase tracking-widest opacity-75 mb-1">
                     {statusResult.courier || 'Courier'} Tracking/Phone Number
                   </p>
                   <p className="font-mono text-xl tracking-widest select-all cursor-pointer hover:opacity-75 transition-opacity" title="Click to copy">
                     {statusResult.trackingNumber}
                   </p>
                </div>
              )}
            </div>

            <div className="p-8 md:p-12 border-b border-slate-100">
              <div className="relative flex justify-between items-center max-w-lg mx-auto">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
                <div 
                  className="absolute top-1/2 left-0 h-0.5 bg-brand-DEFAULT -z-10 transition-all duration-1000"
                  style={{ width: `${(getStepIndex(statusResult.status) / 3) * 100}%` }}
                ></div>

                {['Pending', 'Packing', 'Shipped', 'Delivered'].map((step, idx) => {
                  const isActive = idx <= getStepIndex(statusResult.status);
                  const iconPaths = [
                    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", // Pending
                    "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", // Packing
                    "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 02-1-1h-2.586a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 4H4c-.553 0-1 .448-1 1v4h6v2h5m-1 0V4", // Shipped
                    "M5 13l4 4L19 7" // Delivered
                  ];

                  return (
                    <div key={idx} className="flex flex-col items-center gap-3 bg-white px-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                        isActive ? 'bg-brand-DEFAULT border-brand-DEFAULT text-white shadow-lg shadow-brand-light' : 'bg-white border-slate-300 text-slate-400'
                      }`}>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={iconPaths[idx]} />
                        </svg>
                      </div>
                      <span className={`text-[10px] uppercase font-bold tracking-widest ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 border-b md:border-b-0 md:border-r border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Delivery Details</h3>
                <p className="font-serif text-xl text-slate-900 mb-1">
                  {statusResult.customer.firstName} {statusResult.customer.lastName}
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {statusResult.customer.address}<br/>
                  {statusResult.customer.city}, {statusResult.customer.state}
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs text-slate-400 bg-slate-50 p-3 rounded-sm inline-block">
                  <span>Order ID:</span>
                  <span className="font-mono text-slate-600">{statusResult.id}</span>
                </div>
              </div>

              <div className="p-8 bg-slate-50/50">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Package Contains</h3>
                <div className="space-y-4">
                  {statusResult.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-sm overflow-hidden border border-slate-200 flex-shrink-0">
                        <img src={item.image} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.brand} • x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-700">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-500">Total Paid</span>
                  <span className="font-serif text-xl text-slate-900">₦{statusResult.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default TrackOrder;