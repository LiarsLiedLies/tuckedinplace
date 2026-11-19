import DashboardView from '../components/DashboardView';

export default function OwnerDashboard() {
  return (
    <DashboardView
      title="Business Owner Dashboard"
      endpoint="/api/owner/dashboard"
      features={['Submit business verification', 'Manage your official listing', 'View spot analytics', 'Respond to reviews']}
    />
  );
}