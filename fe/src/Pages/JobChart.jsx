import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line
} from 'recharts';

const JobTrendChart = ({ data, trend }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-6 rounded-xl shadow-lg w-[1200px]">
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-lg font-semibold text-blue-600">
            {payload[0].value} việc làm
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg w-[1233px] h-[450px] mx-auto flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            Xu hướng việc làm mới
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            7 ngày gần nhất
          </p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
          trend >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {trend >= 0 ? '↑' : '↓'}
          <span className="font-medium">
            {Math.abs(trend)} việc làm
          </span>
        </div>
      </div>
      
      <div className="w-[1000px] h-[310px] mx-auto flex">
        <ResponsiveContainer width="100%" height="100%" >
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              tick={{ fill: '#6B7280', fontSize: 12 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              maxBarSize={50}
            />
            <Line 
              type="linear"
              dataKey="count"
              stroke="#FF0000"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default JobTrendChart;