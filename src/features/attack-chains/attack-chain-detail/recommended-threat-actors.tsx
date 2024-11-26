import { prisma } from "@/lib/client";
import { getAttackChain } from "../attack-chain-actions";

export default async function RecommendedThreatActors({
  attackChain,
}: {
  attackChain: Awaited<ReturnType<typeof getAttackChain>>;
}) {
  if (!attackChain) return null;
  const threatActors = await prisma.threatActor.findMany({
    where: {
      iocs: {
        some: {
          linkedAlerts: {
            some: {
              attackChainId: attackChain.id,
            },
          },
        },
      },
    },
    include: {
      iocs: {
        where: {
          linkedAlerts: {
            some: {
              attackChainId: attackChain.id,
            },
          },
        },
        include: {
          linkedAlerts: {
            where: {
              attackChainId: attackChain.id,
            },
          },
          type: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      {threatActors
        .sort(
          (a, b) =>
            b.iocs.reduce((acc, ioc) => acc + ioc.linkedAlerts.length, 0) -
            a.iocs.reduce((acc, ioc) => acc + ioc.linkedAlerts.length, 0)
        )
        .map((threatActor, index) => (
          <div key={threatActor.id} className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-semibold">{threatActor.name}</h3>
              {index === 0 && (
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  Likely Match
                </span>
              )}
            </div>
            <div className="space-y-3">
              {threatActor.iocs.map((ioc) => (
                <div key={ioc.id} className="border rounded p-3 bg-gray-50">
                  <div className="flex gap-2 items-center mb-2">
                    <span className="font-medium">Type:</span>
                    <span>{ioc.type.name}</span>
                  </div>
                  <div className="flex gap-2 items-center mb-2">
                    <span className="font-medium">Value:</span>
                    <span>{ioc.value}</span>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Found in alerts:</div>
                    <ul className="list-disc list-inside">
                      {ioc.linkedAlerts.map((alert) => (
                        <li key={alert.id}>{alert.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
