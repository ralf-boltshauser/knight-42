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
      techniques: {
        where: {
          alerts: {
            some: {
              attackChainId: attackChain.id,
            },
          },
        },
        include: {
          alerts: {
            where: {
              attackChainId: attackChain.id,
            },
          },
        },
      },
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

  console.log(threatActors.map((ta) => ta.techniques));

  return (
    <div className="space-y-6">
      {threatActors
        .sort(
          (a, b) =>
            b.iocs.reduce((acc, ioc) => acc + ioc.linkedAlerts.length, 0) +
            b.techniques.reduce(
              (acc, technique) => acc + technique.alerts.length,
              0
            ) -
            (a.iocs.reduce((acc, ioc) => acc + ioc.linkedAlerts.length, 0) +
              a.techniques.reduce(
                (acc, technique) => acc + technique.alerts.length,
                0
              ))
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
              {threatActor.techniques.map((technique) => (
                <div
                  key={technique.id}
                  className="border rounded p-3 bg-gray-50"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Technique:</span>
                      <span>{technique.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">ID:</span>
                      <span className="font-mono text-sm">
                        {technique.ttpIdentifier}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium mb-1">Related Alerts:</div>
                      {technique.alerts.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {technique.alerts.map((alert) => (
                            <li key={alert.id} className="text-sm">
                              {alert.name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No related alerts
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
