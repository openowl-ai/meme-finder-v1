import { TrendingCoins } from '../components/Dashboard/TrendingCoins';
import { ScamAlerts } from '../components/Dashboard/ScamAlerts';
import { PriceFeeds } from '../components/Dashboard/PriceFeeds';

export function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendingCoins />
        <ScamAlerts />
        <div className="lg:col-span-2">
          <PriceFeeds />
        </div>
      </div>
    </div>
  );
}
