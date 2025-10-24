import { getAllServices } from "@/features/services/service-actions";
import { ServiceList } from "@/features/services/service-list";

export default async function ServicesPage() {
  const services = await getAllServices();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Services</h1>
        <p className="text-muted-foreground">
          Monitor and manage your service dependencies and health.
        </p>
      </div>

      <ServiceList services={services} />
    </div>
  );
}
