import DashboardView from '@/components/DashboardView';

export default function AdminDashboardPage() {
  return (
    <DashboardView
      expectedRole="ADMIN"
      portalTitle="Administration Portal"
    />
  );
}
