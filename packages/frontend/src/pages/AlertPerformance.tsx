import { useState } from 'react';
import { PerformanceOverview } from '../components/Dashboard/AlertPerformance/PerformanceOverview';
import { PerformanceByType } from '../components/Dashboard/AlertPerformance/PerformanceByType';
import { PerformanceTimeline } from '../components/Dashboard/AlertPerformance/PerformanceTimeline';

export function AlertPerformance() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Alert Performance</h1>
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
        </div>
        <PerformanceTimeline />
      </div>
    </div>
  );
}
