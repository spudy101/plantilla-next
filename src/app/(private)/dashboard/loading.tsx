export default function DashboardLoading() {
  return (
    <div className="flex animate-pulse flex-col gap-6" aria-busy="true" aria-label="Cargando panel">
      <div className="bg-muted h-9 w-64 rounded-lg" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-muted h-44 rounded-2xl" />
        <div className="bg-muted h-44 rounded-2xl" />
      </div>
    </div>
  );
}
