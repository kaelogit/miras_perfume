import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const customerMap = {};

        querySnapshot.forEach(doc => {
          const data = doc.data();
          const email = data.customer.email;
          
          if (!customerMap[email]) {
            customerMap[email] = {
              name: `${data.customer.firstName} ${data.customer.lastName}`,
              email: email,
              phone: data.customer.phone,
              totalOrders: 0,
              totalSpent: 0,
              lastOrder: data.date
            };
          }
          
          customerMap[email].totalOrders += 1;
          customerMap[email].totalSpent += Number(data.total);
          
          if (data.date > customerMap[email].lastOrder) {
            customerMap[email].lastOrder = data.date;
          }
        });

        setCustomers(Object.values(customerMap));
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) return <div className="p-8">Loading Customers...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="font-serif text-3xl text-slate-900 mb-8">Customer History</h1>

      <div className="bg-white border border-slate-100 rounded-sm shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 text-xs font-bold uppercase text-slate-500">Name</th>
              <th className="p-4 text-xs font-bold uppercase text-slate-500">Contact</th>
              <th className="p-4 text-xs font-bold uppercase text-slate-500">Orders</th>
              <th className="p-4 text-xs font-bold uppercase text-slate-500">Total Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {customers.map((customer, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50">
                <td className="p-4 font-medium text-slate-800">{customer.name}</td>
                <td className="p-4 text-sm text-slate-600">
                  <div>{customer.email}</div>
                  <div className="text-xs text-slate-400">{customer.phone}</div>
                </td>
                <td className="p-4 text-sm text-slate-700">{customer.totalOrders}</td>
                <td className="p-4 text-sm font-bold text-brand-DEFAULT">₦{customer.totalSpent.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && <div className="p-8 text-center text-slate-500">No customer history available.</div>}
      </div>
    </div>
  );
};

export default Customers;