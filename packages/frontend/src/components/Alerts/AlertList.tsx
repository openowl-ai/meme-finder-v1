import { useQuery } from '@tanstack/react-query';

export const AlertList = () => {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const response = await fetch('/api/alerts');
      return response.json();
    }
  });

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-gray-100 rounded-lg" />;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Active Alerts</h2>
      <div className="space-y-4">
        {alerts?.map((alert: any) => (
          <div 
            key={alert.id}
            className="border rounded-lg p-4 hover:bg-gray-50"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className={`
                  inline-block px-2 py-1 rounded text-sm font-medium
                  ${alert.type === 'BUY' ? 'bg-green-100 text-green-800' :
                    alert.type === 'SELL' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'}
                `}>
                  {alert.type}
                </span>
                <span className="ml-2 font-medium">{alert.symbol}</span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(alert.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="mt-2 space-y-1">
              {Object.entries(alert.conditions).map(([key, value]: [string, any]) => (
                value.enabled && (
                  <div key={key} className="text-sm text-gray-600">
                    {key}: {value.condition} {value.value}
                  </div>
                )
              ))}
            </div>

            <div className="mt-2 flex space-x-2">
              {alert.notifications.email && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  📧 Email
                </span>
              )}
              {alert.notifications.telegram && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  📱 Telegram
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
