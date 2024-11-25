import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { prisma } from "@/lib/client";
import { PopulatedAttackChain } from "@/types/attack-chain";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { getAlerts } from "../attack-chain-actions";

export default async function AttackChainDetail({
  attackChain,
}: {
  attackChain: PopulatedAttackChain;
}) {
  const alerts = await getAlerts();
  const availableAlerts = alerts?.filter(
    (alert) => !attackChain.alerts.find((a) => a.id === alert.id)
  );
  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6">{attackChain.name}</h1>
      {attackChain.relatedThreatActor && (
        <Card>
          <CardHeader>
            <CardTitle>Threat Actor</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{attackChain.relatedThreatActor?.name}</p>
          </CardContent>
        </Card>
      )}
      <div className="flex flex-col gap-8">
        {attackChain.alerts
          .toSorted(
            (a, b) => a.startDateTime.getTime() - b.startDateTime.getTime()
          )
          .map((alert, index) => (
            <div key={alert.id} className="flex flex-col gap-2">
              <div className="bg-white p-4 rounded-lg shadow-md border">
                <Link
                  href={`/alerts/${alert.id}`}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-lg">{alert.name}</h3>
                </Link>
                <div
                  className="text-gray-600 mt-1 prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: alert.description,
                  }}
                />

                <div className="mt-3">
                  <h4 className="font-medium text-sm text-gray-700">
                    Affected Assets:
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {alert.assets.map((asset) => (
                      <Link
                        key={asset.id}
                        href={`/assets/${asset.id}`}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                      >
                        <span className="font-medium">{asset.identifier}</span>-{" "}
                        {asset.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="mt-3">
                  <h4 className="font-medium text-sm text-gray-700">
                    Related IOCs:
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {alert.relatedIOCs.map((ioc) => (
                      <span
                        key={ioc.id}
                        className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-sm"
                      >
                        {ioc.type.name}: {ioc.value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        {availableAlerts && availableAlerts.length > 0 && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Add Alert to Chain</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                action={async (formData: FormData) => {
                  "use server";
                  const alertId = formData.get("alertId") as string;
                  if (!alertId) return;

                  await prisma.attackChain.update({
                    where: { id: attackChain.id },
                    data: {
                      alerts: {
                        connect: { id: alertId },
                      },
                    },
                  });
                  revalidatePath(`/attack-chains/${attackChain.id}`);
                }}
              >
                <div className="flex gap-2">
                  <Select name="alertId">
                    <SelectTrigger>
                      <SelectValue placeholder="Select an alert" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAlerts?.map((alert) => (
                        <SelectItem key={alert.id} value={alert.id}>
                          {alert.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="submit">Add Alert</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
