import {
  AlertTriangle,
  BarChart3,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  TrendingUp
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Package, label: 'Products', path: '/products' },
  { icon: ShoppingCart, label: 'Sales', path: '/sales' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: AlertTriangle, label: 'Inventory', path: '/inventory' },
  { icon: DollarSign, label: 'Price Comparison', path: '/price-comparison' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            <span className="text-xl font-bold text-slate-900">VendorIQ</span>
          </div>
          <p className="text-xs text-slate-500 font-medium ml-8 uppercase tracking-wider">
            {user?.business_name}
          </p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg mb-2">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-700 font-bold">
                {(user?.full_name || 'V').charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.full_name || 'Vendor'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
