import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './components/Layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Alerts } from './pages/Alerts';
import { AlertPerformance } from './pages/AlertPerformance';
import { Backtest } from './pages/Backtest';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/alerts" element={<MainLayout><Alerts /></MainLayout>} />
          <Route path="/performance" element={<MainLayout><AlertPerformance /></MainLayout>} />
          <Route path="/backtest" element={<MainLayout><Backtest /></MainLayout>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
