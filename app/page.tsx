import { NexusDashboard } from "@/components/dashboard/NexusDashboard";
import { getDashboardHoje, getSnapshotFinanceiro } from "@/lib/api";

export default async function Home() {
  const [initialDashboard, initialFinanceiro] = await Promise.all([
    getDashboardHoje().catch(() => undefined),
    getSnapshotFinanceiro().catch(() => undefined),
  ]);

  return (
    <NexusDashboard
      initialDashboard={initialDashboard ?? undefined}
      initialFinanceiro={initialFinanceiro ?? undefined}
    />
  );
}
