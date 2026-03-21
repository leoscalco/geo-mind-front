import { NexusDashboard } from "@/components/dashboard/NexusDashboard";

/**
 * Home page — Server Component.
 *
 * For SSR: fetch the latest analysis from GeoMind backend here
 * and pass it as `initialAnalysis` prop to avoid client-side loading flash.
 *
 * Example:
 *   import { getAnalysis } from "@/lib/api";
 *   const analysis = await getAnalysis("latest").catch(() => undefined);
 *   return <NexusDashboard initialAnalysis={analysis} />;
 */
export default function Home() {
  return <NexusDashboard />;
}
