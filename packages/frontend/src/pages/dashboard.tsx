import { TrendingCoins } from '../components/Dashboard/TrendingCoins';
import { ScamAlerts } from '../components/Dashboard/ScamAlerts';
import { PriceFeeds } from '../components/Dashboard/PriceFeeds';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Meme Coin Intelligence</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <TrendingCoins />
          </div>
          <div className="col-span-1">
            <ScamAlerts />
          </div>
          <div className="col-span-2">
            <PriceFeeds />
          </div>
        </div>
      </main>
    </div>
  );
}
