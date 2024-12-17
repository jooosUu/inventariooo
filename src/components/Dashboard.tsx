import React from 'react';
import { useInventoryStore } from '../store/useInventoryStore';
import { Package, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const stats = useInventoryStore((state) => state.stats);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <Package className="h-8 w-8 text-blue-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Productos</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <TrendingUp className="h-8 w-8 text-green-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Valor Total</p>
            <p className="text-2xl font-semibold text-gray-900">
              ${stats.totalValue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <AlertTriangle className="h-8 w-8 text-yellow-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Stock Bajo</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.lowStock}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center">
          <Activity className="h-8 w-8 text-purple-500" />
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Movimientos Recientes</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.recentMovements}</p>
          </div>
        </div>
      </div>
    </div>
  );
};