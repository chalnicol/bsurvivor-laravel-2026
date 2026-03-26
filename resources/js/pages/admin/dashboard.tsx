import AdminLayout from '@/layouts/admin/layout';

const AdminDashboard = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex min-h-40 flex-col gap-2 rounded border border-gray-400 px-3 pt-2 pb-4"
          >
            <div>
              <h2 className="font-bold">Title</h2>
              <p className="text-xs text-slate-400">
                This is a sample description.
              </p>
            </div>
            <div className="flex-grow rounded border border-gray-600 bg-gray-800"></div>
          </div>
        ))}
      </div>
    </>
  );
};

AdminDashboard.layout = (page: React.ReactNode) => (
  <AdminLayout children={page} />
);

export default AdminDashboard;
