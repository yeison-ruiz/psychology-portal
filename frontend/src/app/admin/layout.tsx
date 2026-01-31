import AdminSidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <AdminSidebar />
      <div className="pl-64">{children}</div>
    </div>
  );
}
