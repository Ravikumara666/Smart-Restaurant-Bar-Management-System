import React from 'react';
import PropTypes from 'prop-types';
import { Clock, ChefHat, CheckCircle, XCircle } from 'lucide-react';

const QuickStats = ({ stats }) => {
  const statItems = [
    { label: 'Pending Orders', value: stats.pending, icon: Clock, color: 'yellow' },
    { label: 'Preparing', value: stats.preparing, icon: ChefHat, color: 'blue' },
    { label: 'Served', value: stats.served, icon: CheckCircle, color: 'green' },
    { label: 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'red' },
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'yellow':
        return { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: 'text-yellow-500' };
      case 'blue':
        return { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500' };
      case 'green':
        return { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-500' };
      case 'red':
        return { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-500' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-600', icon: 'text-gray-500' };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item) => {
          const colors = getColorClasses(item.color);
          const Icon = item.icon;
          
          return (
            <div key={item.label} className="text-center">
              <div className={`inline-flex p-3 rounded-full ${colors.bg} mb-2`}>
                <Icon className={`h-6 w-6 ${colors.icon}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-sm text-gray-600">{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

QuickStats.propTypes = {
  stats: PropTypes.shape({
    pending: PropTypes.number.isRequired,
    preparing: PropTypes.number.isRequired,
    served: PropTypes.number.isRequired,
    cancelled: PropTypes.number.isRequired
  }).isRequired
};

export default QuickStats;