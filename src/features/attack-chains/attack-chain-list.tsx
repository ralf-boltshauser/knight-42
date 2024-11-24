import { Button } from "@/components/ui/button";
import { PopulatedAttackChain } from "@/types/attack-chain";
import Link from "next/link";

export default function AttackChainList({
  attackChains,
}: {
  attackChains: PopulatedAttackChain[];
}) {
  return (
    <div>
      {attackChains.map((attackChain) => (
        <Link
          key={attackChain.id}
          href={`/attack-chains/${attackChain.id}`}
          className="block mb-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {attackChain.name}
              </h3>
              <div className="mt-2 text-sm text-gray-600">
                <p>Created by: {attackChain.analyst.name}</p>
                <p>Created: {attackChain.createdAt.toLocaleDateString()}</p>
                {attackChain.notes && (
                  <p className="mt-2 text-gray-700">{attackChain.notes}</p>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {attackChain.alerts.length} alerts
            </div>
          </div>
          {attackChain.relatedThreatActor && (
            <div className="mt-3 inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
              Threat Actor: {attackChain.relatedThreatActor.name}
            </div>
          )}
        </Link>
      ))}
      <Link href="/attack-chains/create">
        <Button>Create Attack Chain</Button>
      </Link>
    </div>
  );
}
