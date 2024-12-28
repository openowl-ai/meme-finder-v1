import { useQuery } from '@tanstack/react-query';
import { Card } from '../common/Card';

export const PerformanceOverview = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['alert-performance'],
    queryFn: async () => {
      const response = await fetch('/api/alerts/performance');
      return response.json();
    }
  });

  if (isLoading) {
    return <div className="animate-pulse h-48 bg-gray-100 rounded-lg" />;
  }

  const { overall } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-500">Success Rate</h3>
          <p className="text-3xl font-bold text-green-600">
            {(overall.successRate * 100).toFixed(1)}%
          </p>
        </div>
      </Card>

      <Card>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-500">Total Alerts</h3>
          <p className="text-3xl font-bold text-blue-600">
            {overall.totalAlerts}
          </p>
        </div>
      </Card>

      <Card>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-500">Average PnL</h3>
          <p className={`text-3xl font-bold ${
            overall.avgPnl >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {overall.avgPnl >= 0 ? '+' : ''}{overall.avgPnl.toFixed(2)}%
          </p>
        </div>
      </Card>
    </div>
  );
};
