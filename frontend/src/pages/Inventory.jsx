import { AlertTriangle, CheckCircle2, Info, TrendingDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const Inventory = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/dashboard/');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-500">Loading inventory...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Inventory Management</h1>
        <p className="text-slate-500">Monitor stock levels and restock recommendations</p>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-amber-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Low Stock Alerts</h3>
            <p className="text-sm text-slate-500">Products with stock at or below reorder levels</p>
          </div>
        </div>
        
        {!data || data.low_stock.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-slate-600 font-medium">No low stock alerts. All products are well stocked!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm font-medium">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Current Stock</th>
                  <th className="px-6 py-4">Reorder Level</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.low_stock.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                    <td className={`px-6 py-4 font-bold ${product.status === 'Critical' ? 'text-red-600' : 'text-amber-600'}`}>
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{product.low_stock_threshold}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        product.status === 'Critical' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {product.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Restock Predictions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <TrendingDown className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Restock Predictions</h3>
            <p className="text-sm text-slate-500">AI-powered recommendations based on sales trends</p>
          </div>
        </div>

        {!data || data.restock_recommendations.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
              <Info className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500">No restock predictions available. Record more sales to see recommendations!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm font-medium">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Weekly Forecast</th>
                  <th className="px-6 py-4">Est. Days Left</th>
                  <th className="px-6 py-4">Recommended Order</th>
                  <th className="px-6 py-4">ML Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.restock_recommendations.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                    <td className="px-6 py-4 text-slate-600">{parseFloat(item.predicted_weekly_sales).toFixed(1)} units/week</td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${
                        item.status === 'Critical' ? 'text-red-600' : 'text-amber-600'
                      }`}>
                        {item.days_stock_left} days
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-indigo-600 font-bold">+{item.suggested_restock} units</span>
                        <span className="text-xs text-slate-400">Predicted demand</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        item.confidence === 'High' ? 'bg-green-50 text-green-600' :
                        item.confidence === 'Medium' ? 'bg-blue-50 text-blue-600' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {item.confidence}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
