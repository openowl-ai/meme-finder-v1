import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface PriceData {
  symbol: string;
  price: number;
  timestamp: string;
  volume24h: number;
}

export const PriceFeeds = () => {
  const { data } = useQuery<Record<string, PriceData[]>>({
    queryKey: ['price-feeds'],
    queryFn: async () => {
      const response = await fetch('/api/prices');
      return response.json();
    },
    refetchInterval: 5000
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Price Feeds</h2>
      <div className="space-y-6">
        {Object.entries(data || {}).map(([symbol, prices]) => (
          <div key={symbol} className="border-b pb-4">
            <h3 className="text-lg font-semibold mb-2">{symbol}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={prices.slice(-50)}>
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(time) => new Date(time).toLocaleTimeString()} 
                />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8884d8" 
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
    </div>
  );
}
