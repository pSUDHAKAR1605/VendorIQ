import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Package,
  ShoppingCart
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import api from '../api/axios';

const StatCard = ({ icon: Icon, label, value, colorClass }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-xl ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('dashboard/');
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setError(err.response?.data?.detail || err.message || "Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full py-20">Loading...</div>;
  if (error) return (
    <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-100">
      <h2 className="text-red-800 font-bold text-xl mb-2">Error Loading Dashboard</h2>
      <p className="text-red-600">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 bg-red-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
  if (!data) return <div className="p-8 text-center text-slate-500">No dashboard data available.</div>;

  const stats = [
    { icon: Package, label: 'Total Products', value: data.stats.total_products, colorClass: 'bg-indigo-50 text-indigo-600' },
    { icon: ShoppingCart, label: 'Total Sales', value: data.stats.total_sales, colorClass: 'bg-emerald-50 text-emerald-600' },
    { icon: DollarSign, label: 'Total Revenue', value: `$${parseFloat(data.stats.total_revenue).toLocaleString()}`, colorClass: 'bg-blue-50 text-blue-600' },
    { icon: AlertTriangle, label: 'Low Stock Alerts', value: data.stats.low_stock_alerts, colorClass: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Best Selling Products Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Best Selling Products</h2>
          <div className="h-[300px] w-full min-h-0">
            {data.best_selling.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.best_selling}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="product__name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="total_qty" radius={[6, 6, 0, 0]}>
                    {data.best_selling.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'][index % 5]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <ShoppingCart className="w-12 h-12 mb-2 opacity-20" />
                <p>No sales data yet. Start recording sales to see your best sellers!</p>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Restock Alerts</h2>
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-full">
              {data.restock_recommendations.length}
            </span>
          </div>
          <div className="space-y-4">
            {data.restock_recommendations.length > 0 ? (
              data.restock_recommendations.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">Current Stock: {item.current_stock}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-amber-600">Restock</p>
                    <p className="text-sm font-bold text-slate-900">+{item.suggested_restock}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">All products are well stocked!</p>
            )}
          </div>
        </div>
      </div>

      {/* Price Mismatches */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Price Insights</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 text-sm font-semibold text-slate-500">Product</th>
                <th className="pb-4 text-sm font-semibold text-slate-500">Your Price</th>
                <th className="pb-4 text-sm font-semibold text-slate-500">Market Price</th>
                <th className="pb-4 text-sm font-semibold text-slate-500">Status</th>
                <th className="pb-4 text-sm font-semibold text-slate-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.price_mismatches.length > 0 ? (
                data.price_mismatches.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 text-sm font-medium text-slate-900">{item.name}</td>
                    <td className="py-4 text-sm text-slate-600">${item.current_price}</td>
                    <td className="py-4 text-sm text-slate-600">${item.market_price}</td>
                    <td className="py-4 text-sm">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                        item.status === 'Overpriced' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.status === 'Overpriced' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm">
                      <button className="text-indigo-600 font-semibold hover:underline">Adjust Price</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500 text-sm">
                    No price mismatches detected. Your pricing is competitive!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
