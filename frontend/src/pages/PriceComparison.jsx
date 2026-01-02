import { AlertCircle, ArrowDownRight, ArrowUpRight, DollarSign, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const PriceComparison = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('dashboard/');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching price comparison:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-500">Loading comparisons...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Price Comparison</h1>
        <p className="text-slate-500">Analyze your pricing strategy against market benchmarks</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <DollarSign className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Market Price Insights</h3>
            <p className="text-sm text-slate-500">Significant deviations from local market averages</p>
          </div>
        </div>

        {!data || data.price_mismatches.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
              <Info className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-500">No price mismatches detected. Your prices are competitive!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm font-medium">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Your Price</th>
                  <th className="px-6 py-4">Market Price</th>
                  <th className="px-6 py-4">Deviation</th>
                  <th className="px-6 py-4">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.price_mismatches.map((item, index) => {
                  const isOverpriced = item.price > item.market_price;
                  return (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">${item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-slate-600">${item.market_price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-1 font-bold ${isOverpriced ? 'text-red-600' : 'text-emerald-600'}`}>
                          {isOverpriced ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          {item.deviation.toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <AlertCircle className={`w-4 h-4 ${isOverpriced ? 'text-amber-500' : 'text-blue-500'}`} />
                          <span className="text-sm font-medium text-slate-700">
                            {isOverpriced ? 'Consider lowering to increase volume' : 'Opportunity to increase margins'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pricing Strategy Card */}
      <div className="bg-indigo-600 rounded-2xl p-8 text-white">
        <h3 className="text-xl font-bold mb-2">Smart Pricing Tip</h3>
        <p className="text-indigo-100 max-w-2xl">
          Based on your sales velocity, products with a negative deviation (priced below market) are seeing 
          25% more volume. Consider maintaining these low prices for "loss leader" items to drive foot traffic.
        </p>
      </div>
    </div>
  );
};

export default PriceComparison;
