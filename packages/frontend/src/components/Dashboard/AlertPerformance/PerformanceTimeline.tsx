import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const PerformanceTimeline = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['alert-performance-timeline'],
    queryFn: async () => {
      const response = await fetch('/api/alerts/performance/timeline');
      return response.json();
    }
  });

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-gray-100 rounded-lg" />;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Performance Timeline</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="successRate"
              stroke="#10B981"
              name="Success Rate"
              dot={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgPnl"
              stroke="#3B82F6"
              name="Avg PnL"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
