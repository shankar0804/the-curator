import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
            <AdminSidebar />
            <main style={{
                marginLeft: '250px',
                flex: 1,
                padding: '2rem',
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}>
                {children}
            </main>
        </div>
    );
}
