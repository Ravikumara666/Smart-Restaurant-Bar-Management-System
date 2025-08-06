import React from 'react';
import { LucideIcon } from 'lucide-react';

type CardColor = 'green' | 'blue' | 'purple' | 'orange' | 'red';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: CardColor;
  change?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon: Icon, color, change }) => {
  const colorClasses = {
    green: 'bg-green-500 text-green-600 bg-green-50',
    blue: 'bg-blue-500 text-blue-600 bg-blue-50',
    purple: 'bg-purple-500 text-purple-600 bg-purple-50',
    orange: 'bg-orange-500 text-orange-600 bg-orange-50',
    red: 'bg-red-500 text-red-600 bg-red-50'
  };

  const iconBg = colorClasses[color].split(' ')[0];
  const textColor = colorClasses[color].split(' ')[1];
  const bgColor = colorClasses[color].split(' ')[2];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm font-medium mt-1 ${
              change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {change} from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`h-6 w-6 ${textColor}`} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;