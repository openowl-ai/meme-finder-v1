import { MainLayout } from '../components/Layout/MainLayout';
import { AlertForm } from '../components/Alerts/AlertForm';
import { AlertList } from '../components/Alerts/AlertList';

export default function Alerts() {
  return (
    <MainLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-8">Alerts</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlertForm onSubmit={console.log} />
          <AlertList />
        </div>
      </div>
    </MainLayout>
  );
}
