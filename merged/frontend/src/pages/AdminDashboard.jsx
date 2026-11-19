import DashboardView from '../components/DashboardView';

export default function AdminDashboard() {
  return (
    <DashboardView
      title="Admin Dashboard"
      endpoint="/api/admin/dashboard"
      features={['Review business verification requests', 'Moderate flagged spots and reviews', 'Suspend non-compliant accounts', 'View the audit log']}
    />
  );
}