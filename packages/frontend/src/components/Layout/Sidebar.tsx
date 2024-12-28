import Link from 'next/link';
import { useRouter } from 'next/router';

export const Sidebar = () => {
  const router = useRouter();
  const isActive = (path: string) => router.pathname === path;

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 shadow-lg">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-800">Meme Coin Intel</h1>
      </div>
      <nav className="mt-6">
        <Link
          href="/"
          className={`flex items-center px-6 py-3 ${
            isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="mr-3">📊</span>
          Dashboard
        </Link>
        <Link
          href="/alerts"
          className={`flex items-center px-6 py-3 ${
            isActive('/alerts') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="mr-3">🔔</span>
          Alerts
        </Link>
        <Link
          href="/dashboard/alert-performance"
          className={`flex items-center px-6 py-3 ${
            isActive('/dashboard/alert-performance') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="mr-3">📈</span>
          Performance
        </Link>
        <Link
          href="/backtest"
          className={`flex items-center px-6 py-3 ${
            isActive('/backtest') ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="mr-3">🔬</span>
          Backtest
        </Link>
      </nav>
    </div>
  );
};
