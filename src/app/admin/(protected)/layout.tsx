import { verifySession } from "@/lib/auth/dal";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();

  return <AdminShell email={session.email}>{children}</AdminShell>;
}
