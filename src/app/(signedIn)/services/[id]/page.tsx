import { getServiceById } from "@/features/services/service-actions";
import { ServiceDependencyGraph } from "@/features/services/service-dependency-graph";
import { notFound } from "next/navigation";

export default async function ServiceDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex-shrink-0 space-y-4 p-6 pb-4">
        <h1 className="text-3xl font-bold">{service.name}</h1>
        <p className="text-muted-foreground">{service.description}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Owner: {service.owner}
          </span>
          {service.missionCritical && (
            <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
              Mission Critical
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 px-6 pb-6">
        <ServiceDependencyGraph service={service} />
      </div>
    </div>
  );
}
