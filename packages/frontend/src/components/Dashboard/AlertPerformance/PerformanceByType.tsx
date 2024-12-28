import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = {
  BUY: '#10B981',
  SELL: '#EF4444',
  WATCH: '#3B82F6'
};

export const PerformanceByType = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['alert-performance'],
    queryFn: async () => {
      const response = await fetch('/api/alerts/performance');
      return response.json();
    }
  });

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-gray-100 rounded-lg" />;
  }

  const { byType } = data;
  const chartData = Object.entries(byType).map(([type, stats]: [string, any]) => ({
    name: type,
    value: stats.totalAlerts,
    successRate: stats.successRate,
    avgPnl: stats.avgPnl
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Performance by Alert Type</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.name as keyof typeof COLORS]} 
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          {chartData.map(type => (
            <div 
              key={type.name}
              className="p-4 rounded-lg bg-gray-50"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{type.name}</span>
                <span className="text-sm text-gray-500">
                  {type.value} alerts
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-medium">
                    {(type.successRate * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg PnL</span>
                  <span className={`font-medium ${
                    type.avgPnl >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {type.avgPnl >= 0 ? '+' : ''}{type.avgPnl.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
