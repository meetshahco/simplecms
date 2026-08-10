import { listProjects, getSettings } from "@/lib/cms/storage";
import { PortfolioShell } from "@/components/v2/PortfolioShell";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, settings] = await Promise.all([
    listProjects(),
    getSettings(),
  ]);

  return (
    <PortfolioShell
      projects={projects}
      settings={settings}
    />
  );
}
