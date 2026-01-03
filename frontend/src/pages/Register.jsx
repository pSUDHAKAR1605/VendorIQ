import { TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    business_name: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      let message = 'Registration failed. ';
      if (err.response) {
        // Backend returned an error
        message += err.response.data 
          ? Object.entries(err.response.data)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ')
          : 'Server error.';
      } else if (err.request) {
        // Request was made but no response received
        message += 'No response from server. Check your internet connection';
      } else {
        // Something else happened
        message += err.message;
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-8 lg:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">VendorIQ</span>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create account</h1>
          <p className="text-slate-500 mb-8">Start managing your business smarter</p>

          {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                placeholder="My Store"
                value={formData.business_name}
                onChange={(e) => setFormData({...formData, business_name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold transition-colors shadow-lg shadow-indigo-200 mt-4 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-indigo-600 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h2 className="text-5xl font-bold mb-6">Join Thousands of Smart Vendors</h2>
          <p className="text-xl text-indigo-100 leading-relaxed">
            Get insights that help you sell smarter, price better, and never run out of stock.
          </p>
        </div>
      </div>
    </div>
  );
}
