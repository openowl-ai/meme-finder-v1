import { useState } from 'react';
import { DateRangePicker } from './DateRangePicker';

export const BacktestForm = ({ onSubmit }: { onSubmit: (params: any) => void }) => {
  const [params, setParams] = useState({
    symbol: '',
    mentionThreshold: 50,
    sentimentThreshold: 0.6,
    scamThreshold: 0.3,
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    }
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Backtest Configuration</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit(params);
      }}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Symbol
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={params.symbol}
              onChange={(e) => setParams({ ...params, symbol: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mention Threshold
            </label>
            <input
              type="number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              value={params.mentionThreshold}
              onChange={(e) => setParams({ 
                ...params, 
                mentionThreshold: parseInt(e.target.value) 
              })}
            />
          </div>

          <DateRangePicker
            startDate={params.dateRange.start}
            endDate={params.dateRange.end}
            onChange={(start, end) => setParams({
              ...params,
              dateRange: { start, end }
            })}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Run Backtest
          </button>
        </div>
      </form>
    </div>
  );
};
