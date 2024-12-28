import { useState } from 'react';
import { PerformanceOverview } from '../../components/Dashboard/AlertPerformance/PerformanceOverview';
import { PerformanceByType } from '../../components/Dashboard/AlertPerformance/PerformanceByType';
import { PerformanceTimeline } from '../../components/Dashboard/AlertPerformance/PerformanceTimeline';

export default function AlertPerformanceDashboard() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Alert Performance Dashboard</h1>
          <select
            className="rounded-md border-gray-300 shadow-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </select>
        </div>

        <div className="space-y-6">
          <PerformanceOverview />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceByType />
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Top Performing Symbols</h2>
                {/* Add symbol performance table/chart */}
              </div>
            </div>
          </div>

          <PerformanceTimeline />
        </div>
      </div>
    </div>
  );
}
