import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface BacktestResultsProps {
  results: {
    trades: Array<{
      type: 'buy' | 'sell';
      price: number;
      timestamp: Date;
      confidence: number;
      reason: string;
    }>;
    metrics: {
      totalReturn: number;
      sharpeRatio: number;
      maxDrawdown: number;
      winRate: number;
    };
    equity: Array<{
      timestamp: Date;
      value: number;
    }>;
  };
}

export const BacktestResults = ({ results }: BacktestResultsProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Backtest Results</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Total Return</h3>
          <p className="text-2xl font-bold text-gray-900">
            {(results.metrics.totalReturn * 100).toFixed(2)}%
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Sharpe Ratio</h3>
          <p className="text-2xl font-bold text-gray-900">
            {results.metrics.sharpeRatio.toFixed(2)}
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Max Drawdown</h3>
          <p className="text-2xl font-bold text-gray-900">
            {(results.metrics.maxDrawdown * 100).toFixed(2)}%
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500">Win Rate</h3>
          <p className="text-2xl font-bold text-gray-900">
            {(results.metrics.winRate * 100).toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="h-96 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={results.equity}>
            <XAxis 
              dataKey="timestamp"
              tickFormatter={(time) => new Date(time).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Trade History</h3>
        <div className="space-y-2">
          {results.trades.map((trade, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg ${
                trade.type === 'buy' ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="flex justify-between">
                <span className="font-medium">
                  {trade.type.toUpperCase()} @ ${trade.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(trade.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm mt-1">{trade.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
