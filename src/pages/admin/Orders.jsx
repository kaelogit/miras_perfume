import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, updateDoc, doc, orderBy, query } from 'firebase/firestore';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, "orders"), orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        const ordersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleUpdateTracking = async (orderId) => {
    setSavingId(orderId); 
    
    const courierInput = document.getElementById(`courier-${orderId}`);
    const trackingInput = document.getElementById(`tracking-${orderId}`);
    
    if (!courierInput || !trackingInput) {
        setSavingId(null);
        return;
    }

    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { 
        courier: courierInput.value,
        trackingNumber: trackingInput.value
      });
      
      setTimeout(() => setSavingId(null), 1500);
      
    } catch (error) {
      console.error("Error updating tracking:", error);
      setSavingId(null);
    }
  };

  if (loading) return <div className="p-8">Loading Orders...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="font-serif text-3xl text-slate-900 mb-8">Incoming Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-sm border border-slate-100">
          <p className="text-slate-500">No orders yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-slate-100 rounded-sm p-6 shadow-sm hover:shadow-md transition-shadow">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-50 pb-4 mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{order.orderId || "Order"}</h3>
                  <p className="text-xs text-slate-400">
                    {order.date?.toDate ? order.date.toDate().toLocaleString() : "Date Unknown"}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    order.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                    order.status === 'Packing' ? 'bg-yellow-100 text-yellow-600' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {order.status}
                  </span>
                  
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="text-xs border p-2 rounded-sm bg-slate-50 cursor-pointer outline-none focus:border-slate-300"
                  >
                    <option value="Pending">Mark Pending</option>
                    <option value="Packing">Mark Packing</option>
                    <option value="Shipped">Mark Shipped</option>
                    <option value="Delivered">Mark Delivered</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Customer</h4>
                  <p className="font-bold text-slate-800">{order.customer.firstName} {order.customer.lastName}</p>
                  <p className="text-sm text-slate-600">{order.customer.email}</p>
                  <p className="text-sm text-slate-600">{order.customer.phone}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Shipping To</h4>
                  <p className="text-sm text-slate-600">
                    {order.customer.address}, <br/>
                    {order.customer.city}, {order.customer.state}
                  </p>
                </div>
              </div>

              <div className="mb-6 bg-slate-50 p-4 rounded-sm border border-slate-100">
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">Delivery Logistics</h4>
                <div className="flex flex-col md:flex-row gap-3">
                    <input 
                        id={`courier-${order.id}`}
                        defaultValue={order.courier || ''}
                        placeholder="Courier (e.g. DHL, GIG)" 
                        className="flex-1 border p-2 text-sm rounded-sm focus:border-brand-DEFAULT outline-none"
                    />
                    <input 
                        id={`tracking-${order.id}`}
                        defaultValue={order.trackingNumber || ''}
                        placeholder="Tracking Number / Driver Phone" 
                        className="flex-1 border p-2 text-sm rounded-sm focus:border-brand-DEFAULT outline-none"
                    />
                    <button 
                        onClick={() => handleUpdateTracking(order.id)}
                        disabled={savingId === order.id}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-sm transition-colors min-w-[100px] ${
                            savingId === order.id ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-brand-DEFAULT'
                        }`}
                    >
                        {savingId === order.id ? "Saved!" : "Save Info"}
                    </button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-sm">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 text-sm">{item.quantity}x</span>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.brand}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700">₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
                <div className="flex justify-end pt-4 mt-2 border-t border-slate-200">
                  <p className="text-lg font-bold text-slate-900">Total: ₦{order.total.toLocaleString()}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;