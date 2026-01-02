import { BarChart3, DollarSign, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../api/axios';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/dashboard/');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-500">Loading analytics...</div>;
  if (!data || data.best_selling.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Sales Analytics</h1>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center space-y-4">
          <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
            <BarChart3 className="w-8 h-8 text-slate-300" />
          </div>
          <div>
            <p className="text-slate-900 font-medium">No sales data available</p>
            <p className="text-slate-500">Start recording sales to see analytics!</p>
          </div>
        </div>
      </div>
    );
  }

  const COLORS = ['#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Sales Analytics</h1>
        <p className="text-slate-500">Visualize your sales performance and trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Selling Products */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Top Products by Quantity
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.best_selling}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="product__name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="total_qty" radius={[6, 6, 0, 0]}>
                  {data.best_selling.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Contribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            Revenue Contribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.best_selling}
                  dataKey="total_revenue"
                  nameKey="product__name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.best_selling.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Stats Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Performance Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm font-medium">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Units Sold</th>
                <th className="px-6 py-4">Revenue</th>
                <th className="px-6 py-4">Avg. Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.best_selling.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.product__name}</td>
                  <td className="px-6 py-4 text-slate-600">{item.total_qty}</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold">${item.total_revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-600">${(item.total_revenue / item.total_qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
