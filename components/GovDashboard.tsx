import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { GOV_STATS } from '../constants';
import { Icons } from './Icons';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const GovDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-earth-100">
          <div className="flex items-center space-x-3 text-earth-700 mb-2">
            <Icons.Map className="w-6 h-6" />
            <h3 className="font-semibold">Registered Land</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">12,450 <span className="text-sm font-normal text-gray-500">Acres</span></p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-earth-100">
          <div className="flex items-center space-x-3 text-earth-700 mb-2">
            <Icons.User className="w-6 h-6" />
            <h3 className="font-semibold">Active Farmers</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">3,204</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-earth-100">
          <div className="flex items-center space-x-3 text-red-600 mb-2">
            <Icons.AlertTriangle className="w-6 h-6" />
            <h3 className="font-semibold">Critical Alerts</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">14 <span className="text-sm font-normal text-gray-500">Regions</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yield Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-earth-100 h-96">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Regional Crop Yield Estimate (Tons)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={GOV_STATS}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="yield" fill="#468649" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Disease Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-earth-100 h-96">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Disease Prevalence (%)</h3>
           <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={GOV_STATS}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="disease"
                label
              >
                {GOV_STATS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};