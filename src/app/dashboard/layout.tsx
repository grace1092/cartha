import RequireAuth from '@/components/auth/RequireAuth';
import AuthLoginPage from '@/app/auth/signin/page';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth fallback={<AuthLoginPage />}>
      {children}
    </RequireAuth>
  );
}