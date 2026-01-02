import { Plus, ShoppingCart, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import Toast from '../components/Toast';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    unit_price: ''
  });

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await api.get('/sales/');
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-fill price if product changes
    if (name === 'product') {
      const product = products.find(p => p.id === parseInt(value));
      if (product) {
        setFormData(prev => ({ ...prev, unit_price: product.price }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sales/', formData);
      setIsModalOpen(false);
      setFormData({ product: '', quantity: '', unit_price: '' });
      fetchSales();
      setToast({ message: 'Sale recorded successfully!', type: 'success' });
    } catch (error) {
      console.error('Error recording sale:', error);
      const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      setToast({ message: 'Failed to record sale: ' + errorMsg, type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sales</h1>
          <p className="text-slate-500">Track and record your sales transactions</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Record Sale
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading sales...</div>
        ) : sales.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
              <ShoppingCart className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <p className="text-slate-900 font-medium">No sales recorded yet</p>
              <p className="text-slate-500">Start recording your first sale!</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl inline-flex items-center gap-2 hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Record Sale
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm font-medium">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Unit Price</th>
                  <th className="px-6 py-4">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(sale.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{sale.product_name}</td>
                    <td className="px-6 py-4 text-slate-600">{sale.quantity}</td>
                    <td className="px-6 py-4 text-slate-600">${sale.unit_price}</td>
                    <td className="px-6 py-4 text-slate-900 font-semibold">${sale.total_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Record New Sale</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
                <select 
                  name="product" required
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.product} onChange={handleInputChange}
                >
                  <option value="">Select a product</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (In stock: {p.stock})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                  <input 
                    type="number" name="quantity" required min="1"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.quantity} onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unit Price ($)</label>
                  <input 
                    type="number" step="0.01" name="unit_price" required
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                    value={formData.unit_price} onChange={handleInputChange}
                    readOnly
                  />
                </div>
              </div>
              <div className="bg-indigo-50 p-4 rounded-xl">
                <div className="flex justify-between items-center text-indigo-900">
                  <span className="font-medium">Total Amount</span>
                  <span className="text-xl font-bold">
                    ${(formData.quantity * formData.unit_price || 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors mt-2"
              >
                Record Sale
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
