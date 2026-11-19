import DashboardView from '../components/DashboardView';

export default function UserDashboard() {
  return (
    <DashboardView
      title="Spot Finder Dashboard"
      endpoint="/api/user/dashboard"
      features={['Browse the quiet-spot map', 'Search and filter spots', 'Rate and review spots', 'Save spots to your library']}
    />
  );
}