import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, MapPin, X, QrCode } from 'lucide-react';

interface Table {
  _id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  location: string;
  qrCode?: string;
  createdAt: string;
}

const TableManagement: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/tables`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTables(data);
      }
    } catch (error) {
      console.error('Failed to fetch tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTable = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_BASE_URL}/api/tables/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.ok) {
          fetchTables();
        }
      } catch (error) {
        console.error('Failed to delete table:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'reserved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return '✅';
      case 'occupied':
        return '🔴';
      case 'reserved':
        return '📅';
      case 'maintenance':
        return '🔧';
      default:
        return '⚪';
    }
  };

  const filteredTables = tables.filter(table => 
    statusFilter === 'all' || table.status === statusFilter
  );

  const statusCounts = {
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    maintenance: tables.filter(t => t.status === 'maintenance').length,
  };

  return (
    <div className="space-y-6">
      {/* Header and Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Table Management</h2>
            <p className="text-gray-600 mt-1">Manage your restaurant's seating arrangements</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Table
          </button>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 font-medium">Available</p>
                <p className="text-2xl font-bold text-green-700">{statusCounts.available}</p>
              </div>
              <div className="text-2xl">✅</div>
            </div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 font-medium">Occupied</p>
                <p className="text-2xl font-bold text-red-700">{statusCounts.occupied}</p>
              </div>
              <div className="text-2xl">🔴</div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 font-medium">Reserved</p>
                <p className="text-2xl font-bold text-blue-700">{statusCounts.reserved}</p>
              </div>
              <div className="text-2xl">📅</div>
            </div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 font-medium">Maintenance</p>
                <p className="text-2xl font-bold text-yellow-700">{statusCounts.maintenance}</p>
              </div>
              <div className="text-2xl">🔧</div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="all">All Tables</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : filteredTables.map((table) => (
          <div
            key={table._id}
            className={`bg-white rounded-xl shadow-sm border-2 p-6 hover:shadow-md transition-all ${getStatusColor(table.status)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getStatusIcon(table.status)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Table {table.number}</h3>
                  <p className="text-sm text-gray-600 capitalize">{table.status}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setEditingTable(table)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => deleteTable(table._id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <Users size={16} className="mr-2" />
                <span className="text-sm">{table.capacity} seats</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-2" />
                <span className="text-sm">{table.location}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="flex items-center justify-center w-full px-3 py-2 text-sm text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50">
                <QrCode size={16} className="mr-2" />
                View QR Code
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTables.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🪑</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tables found</h3>
          <p className="text-gray-600">Try adjusting your filters or add some tables</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingTable) && (
        <TableModal
          table={editingTable}
          onClose={() => {
            setShowAddModal(false);
            setEditingTable(null);
          }}
          onSave={fetchTables}
        />
      )}
    </div>
  );
};

// Table Modal Component
interface TableModalProps {
  table: Table | null;
  onClose: () => void;
  onSave: () => void;
}

const TableModal: React.FC<TableModalProps> = ({ table, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    number: table?.number || 0,
    capacity: table?.capacity || 2,
    status: table?.status || 'available',
    location: table?.location || '',
  });
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const url = table 
        ? `${API_BASE_URL}/api/tables/${table._id}`
        : `${API_BASE_URL}/api/tables`;
      
      const method = table ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSave();
        onClose();
      }
    } catch (error) {
      console.error('Failed to save table:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {table ? 'Edit Table' : 'Add New Table'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Table Number
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seating Capacity
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Main Dining Area, Patio, Private Room"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (table ? 'Update Table' : 'Add Table')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableManagement;