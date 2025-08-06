import React, { useState, useEffect } from 'react';
import { Users, ShoppingBag, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import RecentOrders from '../components/RecentOrders';
import QuickStats from '../components/QuickStats';
import MenuManagement from '../components/MenuManagement';
import TableManagement from '../components/TableManagement';

interface AdminSummary {
  totalRevenue: number;
  totalOrders: number;
  activeCustomers: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
}

interface AdminStats {
  pending: number;
  preparing: number;
  served: number;
  cancelled: number;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [summaryRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/summary`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/stats`, { headers })
      ]);

      if (summaryRes.ok && statsRes.ok) {
        const summaryData = await summaryRes.json();
        const statsData = await statsRes.json();
        setSummary(summaryData);
        setStats(statsData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'menu', label: 'Menu Management', icon: ShoppingBag },
    { id: 'tables', label: 'Table Management', icon: Users },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">🍽️</div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Smart Restaurant</h1>
                  <p className="text-sm text-gray-500">Admin Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                Scan QR
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Alex Morgan</p>
                  <p className="text-xs text-gray-500">Restaurant Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard
                title="Total Revenue"
                value={`$${summary?.totalRevenue?.toLocaleString() || '0'}`}
                icon={DollarSign}
                color="green"
                change="+12.5%"
              />
              <DashboardCard
                title="Total Orders"
                value={summary?.totalOrders?.toString() || '0'}
                icon={ShoppingBag}
                color="blue"
                change="+8.2%"
              />
              <DashboardCard
                title="Active Customers"
                value={summary?.activeCustomers?.toString() || '0'}
                icon={Users}
                color="purple"
                change="+15.3%"
              />
              <DashboardCard
                title="Avg Order Value"
                value={`$${summary?.averageOrderValue?.toFixed(2) || '0.00'}`}
                icon={TrendingUp}
                color="orange"
                change="+5.7%"
              />
            </div>

            {/* Order Status Quick Stats */}
            {stats && <QuickStats stats={stats} />}

            {/* Recent Orders */}
            <RecentOrders />
          </div>
        )}

        {activeTab === 'menu' && <MenuManagement />}
        {activeTab === 'tables' && <TableManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;