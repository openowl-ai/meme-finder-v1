import { useQuery } from '@tanstack/react-query';

interface ScamAlert {
  symbol: string;
  confidence: number;
  reason: string;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const ScamAlerts = () => {
  const { data } = useQuery<ScamAlert[]>({
    queryKey: ['scam-alerts'],
    queryFn: async () => {
      const response = await fetch('/api/alerts/scam');
      return response.json();
    },
    refetchInterval: 15000
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Scam Alerts</h2>
      <div className="space-y-4">
        {data?.map((alert, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg ${
              alert.severity === 'HIGH' 
                ? 'bg-red-100' 
                : alert.severity === 'MEDIUM'
                ? 'bg-yellow-100'
                : 'bg-blue-100'
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="font-bold">{alert.symbol}</span>
              <span className="text-sm text-gray-500">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm mt-2">{alert.reason}</p>
            <div className="mt-2">
              <span className="text-sm font-medium">
                Confidence: {(alert.confidence * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
