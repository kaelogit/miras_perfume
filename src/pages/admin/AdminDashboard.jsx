import React, { useEffect, useState } from 'react';
import { supabase, mapOrder } from '../../supabase';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    ordersCount: 0,
    productsCount: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: orderRows, error: orderErr } = await supabase.from('orders').select('*');
        if (orderErr) throw orderErr;
        let totalRevenue = 0;
        let pending = 0;
        (orderRows || []).forEach((row) => {
          totalRevenue += Number(row.total) || 0;
          if (row.status === 'Pending') pending++;
        });

        const { data: productRows, error: productErr } = await supabase.from('products').select('id');
        if (productErr) throw productErr;

        const { data: recentRows, error: recentErr } = await supabase
          .from('orders')
          .select('*')
          .order('date', { ascending: false })
          .limit(5);
        if (recentErr) throw recentErr;
        const recentList = (recentRows || []).map(mapOrder);

        setStats({
          revenue: totalRevenue,
          ordersCount: (orderRows || []).length,
          productsCount: (productRows || []).length,
          pendingOrders: pending
        });
        setRecentOrders(recentList);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading Dashboard...</div>;

  return (
    <div>
      <h1 className="text-2xl font-serif text-slate-900 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Revenue", value: `₦${stats.revenue.toLocaleString()}`, color: "bg-green-50 text-green-700" },
          { label: "Total Orders", value: stats.ordersCount, color: "bg-blue-50 text-blue-700" },
          { label: "Products in Stock", value: stats.productsCount, color: "bg-purple-50 text-purple-700" },
          { label: "Pending Orders", value: stats.pendingOrders, color: "bg-orange-50 text-orange-700" },
        ].map((stat, idx) => (
          <div key={idx} className={`p-6 rounded-sm shadow-sm border border-slate-100 ${stat.color}`}>
            <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-50 pb-2">Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-slate-500 italic">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-bold text-slate-800">{order.customer.firstName} {order.customer.lastName}</p>
                    <p className="text-xs text-slate-400">{order.orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-900">₦{order.total.toLocaleString()}</p>
                    <span className={`text-[10px] uppercase font-bold ${
                      order.status === 'Pending' ? 'text-orange-500' : 'text-green-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-sm shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-50 pb-2">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Website is Live</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Database Connected</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Payments Active (Paystack)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;