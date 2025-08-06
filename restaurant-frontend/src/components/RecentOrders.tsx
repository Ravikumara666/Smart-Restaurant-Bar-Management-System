import React, { useState, useEffect } from 'react';
import { Clock, Eye, MoreVertical } from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  table: { number: number } | null;
  items: Array<{ name: string; quantity: number; price: number }>;
  status: 'pending' | 'preparing' | 'served' | 'cancelled';
  total: number;
  createdAt: string;
}

const RecentOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Get the 10 most recent orders
        setOrders(data.slice(0, 10));
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'served':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchRecentOrders(); // Refresh the orders
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
        <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
          View all
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Order ID</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Table</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Items</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Time</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-900">
                    #{order.orderNumber || order._id.slice(-6).toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-gray-700">
                    {order.table ? `Table ${order.table.number}` : 'Takeaway'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="max-w-xs">
                    <p className="text-sm text-gray-700 truncate">
                      {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                    </p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="served">Served</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-900">${order.total.toFixed(2)}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center text-gray-500">
                    <Clock size={14} className="mr-1" />
                    <span className="text-sm">
                      {new Date(order.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Eye size={16} />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">📋</div>
          <p className="text-gray-500">No orders found</p>
        </div>
      )}
    </div>
  );
};

export default RecentOrders;