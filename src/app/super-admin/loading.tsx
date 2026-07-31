export default function SuperAdminLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-8 w-64 bg-[#16161F] sa-skeleton rounded-lg"></div>
          <div className="h-4 w-96 bg-[#16161F] sa-skeleton rounded-md mt-2"></div>
        </div>
        <div className="h-10 w-32 bg-[#16161F] sa-skeleton rounded-xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-[#16161F] sa-skeleton rounded-2xl border border-[#1E1E2E]"></div>
        ))}
      </div>

      <div className="h-96 bg-[#16161F] sa-skeleton rounded-2xl border border-[#1E1E2E]"></div>
    </div>
  );
}
